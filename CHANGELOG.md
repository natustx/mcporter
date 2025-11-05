# Changelog

## [Unreleased]

- Added non-blocking `mcporter list` output with per-server status and parallel discovery.
- Introduced `mcporter auth <server>` helper (and library API support) so OAuth flows don’t hang list calls.
- Set the default list timeout to 30 s (configurable via `MCPORTER_LIST_TIMEOUT`).
- Tuned runtime connection handling to avoid launching OAuth flows when auto-authorization is disabled and to reuse cached clients safely.
- Added `mcporter auth <server> --reset` to wipe cached credentials before rerunning OAuth.

## [0.1.0]

- Initial release.
