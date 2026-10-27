# OmniBot handoff (2026-10-27)

State of this project for whoever picks it up next. `OMNIBOT.md` is the setup guide; this file says
what was done, what is not, and what must not be changed. `CLAUDE.md` has the rules for edits.

## What this is

OmniBot is an Electron + Bun desktop app that runs persistent AI agents (Codex, Claude Code,
OpenCode and others) with a Cloudflare account service, a Signal relay for remote access,
Telegram/Slack/Discord, a web client and an Expo mobile app.

**License:** `LICENSE` (PolyForm Noncommercial 1.0.0) and `NOTICE` (Synthetify Labs copyright) are
the upstream author's and stay as they are. Use for clients or any other commercial purpose needs a
commercial license from Synthetify Labs (contact in `NOTICE`), or their written permission to
relicense.

**Model access:** a personal ChatGPT or Claude subscription must not be shared with clients (both
providers' terms forbid it). Client model access is planned as API keys held on the owner's server
and relayed to agents (not built).

## Where things are

| What | Where |
| --- | --- |
| Repository | This folder, on the owner's Desktop |
| Git remote | `origin` = `https://github.com/kaisuupgrades-ship-it/OmniBot.git` (private) |
| Windows installer | `dist\OmniBot-0.45.0-x64.exe` (built 2026-10-26 from `e8b7106`, before the remote desktop rename; do not ship it) |
| App data | `%APPDATA%\OmniBot`. `omnibot-setup-v2.json.bak` and `omnibot-central-auth-v1.bin.bak` are the owner's earlier setup and sign-in, set aside to test a first sign-in. Rename them back to restore. |
| Agent workspaces | `C:\Users\Jon Roh\OmniBot\Agents\` |
| Secrets (git-ignored, never commit or print) | `apps\auth-api\.env.self-hosted` (account service), `remote\.env.cloudflare` (Signal). All generated secrets are filled in; the `PASTE` lines are for the owner. |

## Work on this branch

1. Removed upstream-only files (community docs, review bots, release pipelines, signing, encrypted
   secrets, Firebase). Kept workflows run on `workflow_dispatch` only.
2. Renamed the old product name to `omnibot` everywhere (case kept per letter, 7 characters for 7),
   including file names, the package scope and the remote desktop helper names. Upstream account IDs
   are `REPLACE_WITH_YOUR_` placeholders, and the Telegram bot name and ID are placeholders.
3. Signal can use Cloudflare Realtime TURN (`remote/api/src/cloudflare-turn.ts`) and run in a
   Cloudflare Container (`remote/cloudflare/`, deploy with `scripts/deploy-signal-container.ts`).
   `deploy-auth-api.ts` no longer requires the OpenPanel keys.
4. After sign-in, first-run setup is skipped and new agents start on Codex (`src/renderer/src/AppView.tsx`).

## Remote desktop is off until the helper is rebuilt

The helper patches now use the OmniBot names, and `native-runtime.lock.json` pins a release of
`kaisuupgrades-ship-it/OmniBot` that does not exist yet. Run the "Remote desktop runtime" workflow,
then `bun scripts/pin-remote-desktop-runtime.ts` (see `OMNIBOT.md`). Build and ship the app only
after that.

## Running it today (local only)

The deployed backend does not exist yet. To use the installed app on this PC:

```sh
bun run --cwd apps/auth-api dev      # local account service on http://127.0.0.1:3100
```

Then start the app with `OMNIBOT_AUTH_API_URL=http://127.0.0.1:3100`. Sign-in codes show in the
app in local mode. If the local database is empty, run `bun run dev:prepare` once (its later
sample-data step may fail; the tables are created first). Codex uses the ChatGPT login in
`C:\Users\Jon Roh\.codex\auth.json`.

## Checks

```sh
OMNIBOT_SKIP_SKIA=1 bun install --frozen-lockfile
bun run typecheck
bun run lint            # 145 warnings existed before this work; 0 errors
bun run test:desktop    # 6 failures are Windows-only and also fail on the untouched copy:
                        # ui-foundation-check, omnibot-database (file mode, EBUSY), provider-runtime-failure-log
bun run test:api
bun run dist:win        # Windows installer in dist/ (needs the rebuilt remote desktop helper)
```

## Not done yet, in order

1. Commercial license from Synthetify Labs (before any client use).
2. Rebuild and pin the remote desktop helper (above).
3. Owner: buy a domain on Cloudflare; Workers Paid; Cloudflare Realtime TURN key; Resend sending
   domain and API key; Telegram bot via BotFather; Docker Desktop. Paste the secrets into the two
   `.env` files above.
4. Set the domain in `scripts/omnibot/brand.json`, run `bun scripts/omnibot/rebrand.ts`, rebuild.
5. Deploy the account service (`apps/auth-api`, see `docs/self-hosting.md` step 2 with
   `.env.self-hosted`), then Signal (`remote/cloudflare/README.md`). Neither is deployed or tested on
   Cloudflare yet. Fill `TELEGRAM_BOT_ID` and `TELEGRAM_BOT_USERNAME` in `.env.self-hosted`.
6. Model relay: API keys on the server for client agents (not built).
7. Linux build and an install script for Orgo machines via Orgo's bash API, signing each machine in
   with `SERVER_CLAIMS_ADMIN_TOKEN` claims (not built).
8. Update feed hosting, own iPhone/Android app builds (needs Apple and Google accounts), privacy
   policy and terms for the owner's company, monitoring and backups.

See `OMNIBOT.md` for every placeholder to fill in.
