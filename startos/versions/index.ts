import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_9_6_9 } from './v0.9.6_9'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_9_6_9],
})
