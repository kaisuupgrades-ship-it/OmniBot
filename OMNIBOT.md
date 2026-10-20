# OmniBot

OmniBot is a local-first desktop workspace for persistent AI agents. This file is the setup guide
for this copy: brand values, building the app, and the accounts you need of your own.

License: PolyForm Noncommercial 1.0.0. `LICENSE` and `NOTICE` keep their text, and every copy you
hand out must include them.

## Brand settings

`scripts/omnibot/brand.json` holds every brand value:

| Key | Now | Use |
| --- | --- | --- |
| `name` | `OmniBot` | The product name in the app, the installer and the web pages. |
| `scheme` | `omnibot` | The `omnibot://` link scheme. |
| `domain` | `omnibot.example.com` | The base domain: `api.`, `signal.`, `turn.` and the web pages. |
| `sitesDomain` | `omnibot-sites.example.com` | Hosted sites, as `<name>.<sitesDomain>`. |
| `updatesUrl` | `https://updates.omnibot.example.com` | The auto-update feed and the install scripts. |
| `repositoryUrl` | `https://omnibot.example.com/source` | Links to the source code. |
| `containerImage` | `registry.omnibot.example.com/omnibot` | The Docker image for headless hosts. |

The values are under `example.com`, which nobody can own, so the app cannot reach a stranger's
server by mistake. To use your own domain, change the values in `brand.json`, then run:

```sh
bun scripts/omnibot/rebrand.ts --dry-run   # see what changes
bun scripts/omnibot/rebrand.ts             # apply
```

The script replaces the values in `applied.json` (what the app uses now) and then saves
`brand.json` as the new `applied.json`. Changing `domain`, `updatesUrl` and the other addresses is
safe. Changing `name` also renames code names that contain `OmniBot`, so run `bun run check`
afterwards.

## Placeholders to fill in

Search for `REPLACE_WITH_YOUR_` to find each one.

| Where | What |
| --- | --- |
| `apps/auth-api/wrangler.jsonc` | Your D1 database IDs (`wrangler d1 create`) and, for the GitHub connector, your GitHub App's Client ID. |
| `src/main/github-connector-config.ts` | Your GitHub App's Client ID. Empty means the GitHub connection is not offered. |
| `apps/mobile/app.json` | Your Expo account and EAS project ID. |
| `apps/auth-api/src/lib/analytics.ts` | An OpenPanel client ID, only if you turn analytics on. |
| `apps/slack-app/`, `docs/messaging.md`, `remote/.env.example`, `scripts/dev-slack-tunnels.ts` | Your Slack app and workspace IDs. |
| `apps/auth-api/src/lib/site-metadata.ts`, `apps/mobile/.../support-settings-screen.tsx` | Your X account. The links go to `x.omnibot.example.com` until then. |

## Logo and icons

`bun scripts/omnibot/make-icons.ts` draws the placeholder mark and writes all app and web icons.
To use your own artwork, replace these files:

- `build/icon-{production,dev,preview}.png` and `-macos-safe-area.png` (1600 × 1600)
- `build/icon-*.ico`, `build/icon.ico`, `build/icon-production.icns`, `build/icon.svg`
- `build/logo-colors/*` (one icon for each logo color the user can pick)
- `src/renderer/src/assets/omnibot-logo-*.png`
- `apps/auth-api/public/` icons

The logo that the app draws comes from `packages/brand/src/app-logo-shape.ts` and `logo.css`.
The brand colors are `--omnibot-logo-*` and `--omnibot-accent*` in `packages/brand/src/tokens.css`.
These still show the old artwork: `apps/auth-api/public/omnibot-social.png`,
`build/dmg-background*.png` (macOS only), the iPhone and Android app icons in `apps/mobile/assets`,
and the screenshots in the website's news and guide articles.

## Build the Windows app

```sh
OMNIBOT_SKIP_SKIA=1 bun install --frozen-lockfile
bun run dist:win
```

The installer is in `dist/`. It is not code signed, so Windows SmartScreen warns on the first run.

The app asks you to sign in before you can use it, and sign-in needs your account service. Until
you deploy it (next section), a built app stays on "Connecting to OmniBot". To try the app before
that, run `bun run dev`: it starts a local account service and the app together.

## Run your own servers

Do the steps in [docs/self-hosting.md](docs/self-hosting.md), with your own domain:

1. **Domain on Cloudflare.** Add your domain to a free Cloudflare account.
2. **Account service (Cloudflare Worker).** In `apps/auth-api/wrangler.jsonc`, set `database_id` to
   the ID that `wrangler d1 create` prints, and set the SMTP values. Then deploy.
3. **Signal and TURN (your Linux VPS).** Copy `remote/.env.example` to `remote/.env.self-hosted`,
   fill it in, and start it with Docker Compose.

After `brand.json` has your domain, the app uses your servers by default. You do not have to set
`OMNIBOT_AUTH_API_URL` or `OMNIBOT_REMOTE_SIGNAL_URL`.

Features that need accounts of your own before they work:

- **Slack, Discord and Telegram:** make your own bot apps and give their secrets to Signal and the
  Worker (see `docs/messaging.md` and `remote/README.md`).
- **GitHub connector:** register your own GitHub App (`bun scripts/create-github-app.ts`), then set
  its Client ID in `src/main/github-connector-config.ts` and `GITHUB_APP_CLIENT_ID` in
  `wrangler.jsonc`.
- **Paid hosted servers:** off (`HOSTED_SERVERS_ENABLED` is `"false"`). They need a boat.dev and
  Stripe account.
- **iPhone and Android apps:** need your own Apple developer account, Expo project, Firebase
  project (`apps/mobile/google-services.json`) and push keys.

## Remote desktop helper

Remote desktop uses a prebuilt helper (Sunshine and Moonlight Web, built from the patches in
`vendor/remote-desktop/patches/`). The helper was compiled with its own names built in, so these
keep their original spelling: the `/api/openbot/*` routes, the `openbot-moonlight` message source,
the `OPENBOT_REMOTE_SETUP` environment variable, the `OPENBOT_SECURITY_TESTS` build flag and the
patch file names. `native-runtime.lock.json` pins the helper download, by SHA-256, to the GitHub
release of the original project, so `bun run dist:win` downloads it from there when
`build/remote-desktop-runtime/` does not have it yet. Renaming them means rebuilding the helper with the "Remote desktop runtime" workflow
and publishing it from your own repository.

## GitHub Actions

The workflows in `.github/workflows/` (CI, Computer Use driver, remote desktop runtime) run only
when started by hand, so pushes to a private repository spend no Actions minutes.
