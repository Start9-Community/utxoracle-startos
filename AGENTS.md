# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`utxoracle.py` is vendored unmodified — never patch it.** `docker_entrypoint.sh` is the whole wrapper: it writes a `bitcoin.conf` for the script, runs it once, records the exit code, and serves the HTML. Fixes belong in the wrapper or upstream, not in the script.
- **Import Bitcoin's host id and RPC port from `bitcoin-core-startos/startos/utils`** rather than hardcoding, so a change on Bitcoin's side is a compile error here.
- **Cookie auth is read off the read-only dependency mount**, never copied — a cookie rotated on bitcoind's restart is picked up with no action here, and no RPC user is ever created.
- **`runAsInit: true` is required**: the wrapper supervises both the script and the web server.
- **The dependency requires `sync-progress`, not just `bitcoind`.** A price computed from a partial chain is wrong, not late.
- **Nothing is cached.** The container's data dir is ephemeral by design and every run recomputes; don't add a results volume without deciding what a stale result means.
- **Default branch is `main`, not `master`.** Its CI workflows reference `main`; leave them.
