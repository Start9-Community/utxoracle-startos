import { FileHelper, T } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { bitcoinMountpoint, bitcoinRpcCookieFile, uiPort } from './utils'

type BitcoinCoreManifest = T.SDKManifest & {
  id: 'bitcoind'
  volumes: ['main']
}

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting UTXOracle'))

  // The run mode (set by the Configure action); re-run when it changes.
  const mode = (await storeJson.read((s) => s.mode).const(effects)) || 'rb'

  // Only Bitcoin Core's volume is mounted (read-only, for the RPC cookie);
  // UTXOracle keeps no state of its own.
  const mounts = sdk.Mounts.of().mountDependency<BitcoinCoreManifest>({
    dependencyId: 'bitcoind',
    volumeId: 'main',
    subpath: null,
    mountpoint: bitcoinMountpoint,
    readonly: true,
  })

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    mounts,
    'utxoracle-sub',
  )

  // Restart the daemon chain if Bitcoin Core's RPC cookie changes
  await FileHelper.string(`${subcontainer.rootfs}${bitcoinRpcCookieFile}`)
    .read()
    .const(effects)

  return sdk.Daemons.of(effects)
    .addDaemon('primary', {
      subcontainer,
      exec: {
        command: sdk.useEntrypoint(),
        env: { UTXORACLE_MODE: mode },
        runAsInit: true,
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
        gracePeriod: 30_000,
      },
      requires: [],
    })
    .addHealthCheck('complete', {
      ready: {
        display: i18n('UTXOracle Completion'),
        fn: async () => {
          // The entrypoint writes utxoracle.py's exit code here once it finishes.
          // A nonzero `cat` exit means the file is absent: still computing.
          const res = await subcontainer.exec(
            ['cat', '/tmp/utxoracle_exit_code'],
            {},
            10_000,
          )
          if (res.exitCode !== 0) {
            return {
              result: 'loading',
              message: i18n('UTXOracle is still running'),
            }
          }
          const code = String(res.stdout).trim()
          if (code === '0') {
            return {
              result: 'success',
              message: i18n('UTXOracle completed successfully'),
            }
          }
          return {
            result: 'failure',
            message: `${i18n('UTXOracle exited with an error')} (exit code ${code})`,
          }
        },
        trigger: sdk.trigger.statusTrigger(30_000, {
          starting: 5_000,
          loading: 30_000,
          failure: 30_000,
        }),
      },
      requires: ['primary'],
    })
})
