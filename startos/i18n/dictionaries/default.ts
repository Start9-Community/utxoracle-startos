export const DEFAULT_LANG = 'en_US'

const dict = {
  // actions/configure.ts
  Configure: 0,
  'Choose which UTXOracle price to estimate': 1,
  'Price to Compute': 2,
  'Which UTXOracle price to estimate the next time the service runs.': 3,
  Today: 4,
  Yesterday: 5,
  'Specific Date': 6,
  'Date (UTC)': 7,
  'A UTC date from 2023-12-15 onward. Historical dates require an unpruned Bitcoin Core node.': 8,

  // interfaces.ts
  'Web UI': 9,
  'The UTXOracle web interface': 10,

  // main.ts
  'Starting UTXOracle': 11,
  'Web Interface': 12,
  'The web interface is ready': 13,
  'The web interface is not ready': 14,
  'UTXOracle Completion': 15,
  'UTXOracle is still running': 16,
  'UTXOracle completed successfully': 17,
  'UTXOracle exited with an error': 18,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
