# Instructions for UTXOracle

Before starting UTXOracle, install and start Bitcoin Core on the same StartOS server. UTXOracle connects to it over JSON-RPC and authenticates with Bitcoin Core's local `.cookie` file (`/mnt/bitcoind/.cookie`), so no RPC username or password is required.

Use the **Configure** action to choose which price UTXOracle estimates on its next run:

- **Today** — the price from the most recent 144 blocks (the default).
- **Yesterday** — the consensus price for the previous full UTC day.
- **Specific Date** — pick a UTC date (from 2023-12-15 onward) with the date picker.

Changing the selection automatically restarts the service to recompute. "Today" works on a pruned node; evaluating a historical date requires an unpruned (archival) Bitcoin Core node, since a pruned node no longer stores those blocks.

This package is a wrapper for [UTXOracle](https://utxo.live/oracle/) by [@SteveSimple](https://twitter.com/SteveSimple).
