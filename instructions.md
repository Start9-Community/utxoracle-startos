# UTXOracle

UTXOracle estimates the price of Bitcoin from the blockchain itself — no exchange, no API, no price feed. It reads the transaction output values in recent blocks and derives a consensus price from their distribution.

## Documentation

- [UTXOracle](https://utxo.live/oracle/) — the upstream project, by [@SteveSimple](https://twitter.com/SteveSimple), including how the method works.

## Before you start

Install and start **Bitcoin** on the same StartOS server. UTXOracle connects to it over JSON-RPC and authenticates with Bitcoin's own `.cookie` file, so there is no RPC username or password to set up.

Bitcoin must be **fully synced** before UTXOracle will run — a price derived from a partial chain is not a price.

## Choosing what to compute

Use the **Configure** action to choose which price UTXOracle estimates on its next run:

- **Today** — the price from the most recent blocks. This is the default.
- **Yesterday** — the consensus price for the previous full UTC day.
- **Specific Date** — pick a UTC date with the date picker.

Changing the selection restarts the service and recomputes.

**Today works on a pruned node. A historical date does not** — a pruned node no longer stores those blocks, so the run will fail rather than return a wrong answer. Use an unpruned (archival) Bitcoin node for historical dates.

## Reading the result

Open the **Web UI** interface to see the chart.

The first run takes several minutes: the interface comes up straight away, but the chart only appears once the computation finishes. The **UTXOracle Completion** health check tells you which stage you are in — it reports that the run is still going, and then whether it succeeded or failed.

Every run recomputes from the chain. Nothing is cached and no history of past results is kept, so re-running a date gives you the same answer rather than a stored one.
