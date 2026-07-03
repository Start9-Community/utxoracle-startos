import { setupManifest } from '@start9labs/start-sdk'
import { bitcoindDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'utxoracle',
  title: 'UTXOracle',
  license: 'UTXOracle License 1.0',
  packageRepo: 'https://github.com/Start9-Community/utxoracle-startos',
  upstreamRepo: 'https://utxo.live/oracle/',
  marketingUrl: 'https://utxo.live/',
  donationUrl:
    'https://primal.net/p/nprofile1qqsd39l0ekt3lrj74cyvs6ma5ehcnvcwwcdy4p4vg8vswsjazkmrplspa5mvm',
  description: { short, long },
  volumes: ['startos'],
  images: {
    main: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoindDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin Core',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/31.x/icon.svg',
      },
    },
  },
})
