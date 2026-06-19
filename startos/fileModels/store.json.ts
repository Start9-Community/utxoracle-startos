import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// The UTXOracle run mode the entrypoint passes to the script: 'rb' (today),
// 'yesterday', or a 'YYYY/MM/DD' date.
export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: 'store.json' },
  z.object({
    mode: z.string().catch('rb'),
  }),
)
