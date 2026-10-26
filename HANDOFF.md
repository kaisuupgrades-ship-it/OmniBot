# OmniBot handoff (2026-10-26)

State of this project for whoever picks it up next. `OMNIBOT.md` is the setup guide; this file says
what was done, what is not, and what must not be changed.

## What this is

OmniBot is a renamed fork of OpenBot (Synthetify Labs), an Electron + Bun desktop app that runs
persistent AI agents (Codex, Claude Code, OpenCode and others) with a Cloudflare account service,
a Signal relay for remote access, Telegram/Slack/Discord, a web client and an Expo mobile app.

**License: PolyForm Noncommercial 1.0.0.** Use for clients or any commercial purpose needs a
commercial license from Synthetify Labs (licenses@openbot.run). Keep `LICENSE`, `NOTICE` and every
`Required Notice:` line as they are. The owner plans to offer this to clients; the license must be
in place before that.

**Model access:** a personal ChatGPT or Claude subscription must not be shared with clients (both
providers' terms forbid it). Client model access is planned as API keys held on the owner's server
and relayed to agents (not built).

## Where things are

| What | Where |
| --- | --- |
| Repository | `C:\Users\Jon Roh\Desktop\openbot-whitelabel` |
| Branch | `remove-openbot` (6 commits on top of `omnibot`; not pushed) |
| Git remote | `origin` = `https://github.com/kaisuupgrades-ship-it/OmniBot.git` (private, empty). Nothing pushed yet. |
| Windows installer | `dist\OmniBot-0.45.0-x64.exe` (built 2026-10-26 14:41 from `e8b7106`) |
| Installed app | `C:\Users\Jon Roh\AppData\Local\Programs\openbot\OmniBot.exe` |
| App data | `%APPDATA%\OmniBot`. `omnibot-setup-v2.json.bak` and `omnibot-central-auth-v1.bin.bak` are the owner's earlier setup and sign-in, set aside to test a first sign-in. Rename them back to restore. |
| Agent workspaces | `C:\Users\Jon Roh\OmniBot\Agents\` |
| Secrets (git-ignored, never commit or print) | `apps\auth-api\.env.self-hosted` (account service), `remote\.env.cloudflare` (Signal). All generated secrets are filled in; the `PASTE` lines are for the owner. |
| Original copy (untouched) | `C:\Users\Jon Roh\OpenBot\Agents\agent-b23b8fa6-...\openbot-whitelabel` |

## Commits on `remove-openbot`

1. `5bb87ea` Remove OpenBot-only files (community docs, review bots, release pipelines, signing,
   upstream encrypted secrets, Firebase). Kept workflows run on `workflow_dispatch` only.
2. `7dd97bb` Rename every `openbot` name to `omnibot` (case kept per letter) in contents and file
   names; clear upstream account IDs into `REPLACE_WITH_YOUR_` placeholders.
3. `8710801` Restore the remote desktop helper's own file and build target names.
4. `f6f5bf7` Replace the upstream Telegram bot name and ID with placeholders.
5. `4682df6` Signal can use Cloudflare Realtime TURN (`remote/api/src/cloudflare-turn.ts`) and run
   in a Cloudflare Container (`remote/cloudflare/`, deploy with `scripts/deploy-signal-container.ts`).
   `deploy-auth-api.ts` no longer requires the OpenPanel keys.
6. `e8b7106` After sign-in, skip first-run setup and preselect Codex (`src/renderer/src/AppView.tsx`).

## Names that must keep "openbot"

The prebuilt remote desktop helper (Sunshine and Moonlight Web, downloaded from the upstream GitHub
release pinned in `native-runtime.lock.json`) has these compiled in: `/api/openbot/*`,
`openbot-moonlight`, `OPENBOT_REMOTE_SETUP`, `OPENBOT_SECURITY_TESTS`, `openbot-setup-test`,
`*-openbot.patch`, `*-openbot-source.tar.gz`. Leave them and `vendor/remote-desktop/patches/` as
they are unless the helper is rebuilt.

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
bun run dist:win        # Windows installer in dist/
```

## Not done yet, in order

1. Commercial license from Synthetify Labs (before any client use).
2. Owner: buy a domain on Cloudflare; Workers Paid; Cloudflare Realtime TURN key; Resend sending
   domain and API key; Telegram bot via BotFather; Docker Desktop. Paste the secrets into the two
   `.env` files above.
3. Set the domain in `scripts/omnibot/brand.json`, run `bun scripts/omnibot/rebrand.ts`, rebuild.
4. Deploy the account service (`apps/auth-api`, see `docs/self-hosting.md` step 2 with
   `.env.self-hosted`), then Signal (`remote/cloudflare/README.md`). Neither is deployed or tested on
   Cloudflare yet. Fill `TELEGRAM_BOT_ID` and `TELEGRAM_BOT_USERNAME` in `.env.self-hosted`.
5. Model relay: API keys on the server for client agents (not built).
6. Linux build and an install script for Orgo machines via Orgo's bash API, signing each machine in
   with `SERVER_CLAIMS_ADMIN_TOKEN` claims (not built).
7. Update feed hosting, own iPhone/Android app builds (needs Apple and Google accounts), privacy
   policy and terms for the owner's company, monitoring and backups.

See `OMNIBOT.md` for every placeholder to fill in.
