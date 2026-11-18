# Discovery tracker

[Issue #53](https://github.com/steel-dev/leaderboard/issues/53) is a rolling tracker.
Keep it open across sweeps. It is not an implementation issue.

## Current status

On September 27, 2026, the repository has no `ENABLE_DISCOVERY` variable.
Scheduled discovery is therefore disabled. This change does not enable it.
The September 4 digest links results shipped in pull requests #50, #51, and #52.
All three merged that day. Unchecked boxes do not mean those results are absent.
They represent the manual verification requested by that digest.

## Run a sweep

1. Check the required secrets in `.github/workflows/discover-results.yml`.
2. To run once, dispatch **Discovery Sweep** with the benchmark slugs and lookback window.
3. To enable recurring sweeps, set the repository variable `ENABLE_DISCOVERY` to `true`.
4. Inspect the run artifacts and proposed pull requests.
5. Verify each score against its source before merging.
6. Record merged, rejected, or deferred proposals in the tracker.

The scheduler checks on Mondays and dispatches on even ISO weeks.
A year boundary can create a 21-day gap; the default lookback covers it.
Set `ENABLE_DISCOVERY` to `false` or remove it to stop scheduled sweeps.
Manual dispatch of **Discovery Sweep** remains available.

## Notifications

Successful sweeps append a digest to the open issue labeled `discovery`.
The notifier creates that tracker if none exists.
A week marker prevents duplicate digests for the same ISO week.
Failures use separate issues labeled `discovery-alert`.
An intentionally disabled scheduler must not create a failure alert.

Notification jobs do not check out the repository.
They set `GH_REPO` explicitly so GitHub CLI commands target the correct repository.
Tracker creation reads the URL returned by `gh issue create`.
That command does not support `--json` or `--jq`.

## Decision for review

Keep scheduled discovery disabled until a maintainer selects the budget and cadence.
Use manual sweeps for a specific benchmark when needed.
Record that decision in issue #53.

## Validation of workflow changes

Local checks cover existing, missing, and duplicate tracker digests; quiet runs;
runs with proposed changes; and candidates blocked before a pull request opens.
The checks execute notification shell steps with a mock GitHub CLI.
They also check repository context, shell syntax, and each scheduler result state.
No paid sweep or live notification is triggered by those checks.
