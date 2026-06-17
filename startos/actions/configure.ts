import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants } = sdk

const inputSpec = InputSpec.of({
  mode: Value.union({
    name: i18n('Price to Compute'),
    description: i18n(
      'Which UTXOracle price to estimate the next time the service runs.',
    ),
    default: 'today',
    variants: Variants.of({
      today: {
        name: i18n('Today'),
        spec: InputSpec.of({}),
      },
      yesterday: {
        name: i18n('Yesterday'),
        spec: InputSpec.of({}),
      },
      date: {
        name: i18n('Specific Date'),
        spec: InputSpec.of({
          date: Value.datetime({
            name: i18n('Date (UTC)'),
            description: i18n(
              'A UTC date from 2023-12-15 onward. Historical dates require an unpruned Bitcoin Core node.',
            ),
            required: true,
            default: null,
            inputmode: 'date',
            min: '2023-12-15',
            max: null,
          }),
        }),
      },
    }),
  }),
})

// The date picker yields 'YYYY-MM-DD'; UTXOracle.py's -d wants 'YYYY/MM/DD'.
const dateToMode = (date: string) => date.slice(0, 10).replace(/-/g, '/')
const modeToDate = (mode: string) => mode.replace(/\//g, '-')

export const configure = sdk.Action.withInput(
  'configure',
  {
    name: i18n('Configure'),
    description: i18n('Choose which UTXOracle price to estimate'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async ({ effects }) => {
    const mode = (await storeJson.read((s) => s.mode).once()) || 'rb'
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(mode)) {
      return {
        mode: { selection: 'date' as const, value: { date: modeToDate(mode) } },
      }
    }
    if (mode === 'yesterday') {
      return { mode: { selection: 'yesterday' as const, value: {} } }
    }
    return { mode: { selection: 'today' as const, value: {} } }
  },
  async ({ effects, input }) => {
    const selected = input.mode
    const mode =
      selected.selection === 'today'
        ? 'rb'
        : selected.selection === 'yesterday'
          ? 'yesterday'
          : dateToMode(selected.value.date)
    await storeJson.merge(effects, { mode })
  },
)
