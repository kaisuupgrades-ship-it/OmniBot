# OmniBot fork

OmniBot is a personal, noncommercial rebrand of [OpenBot](https://github.com/nightly-labs/openbot)
by Synthetify Labs. It is used under the PolyForm Noncommercial License 1.0.0 (see `LICENSE`).

**License rules that still apply:**

- Use it only for noncommercial purposes. For commercial use, get a license from
  licenses@openbot.run first.
- When you give a copy to someone, include `LICENSE` and the `Required Notice:` lines. `NOTICE`
  keeps the third-party credits. The rebrand script never changes these files.
- The license gives no right to the OpenBot name or logo. Do not present OmniBot as OpenBot.

## What is different from OpenBot

| Area | Change |
| --- | --- |
| Name, scheme, app id | `OmniBot`, `omnibot://` links, `app.omnibot.desktop`. It installs next to OpenBot and keeps its own data in `%APPDATA%\OmniBot` and `~/OmniBot`. |
| Servers | The defaults point at your own servers (see `scripts/omnibot/brand.json`). |
| Paid license | The commercial license, its seat limits and its purchase screens are removed. A server with no paid plan has no small member or site limit. |
| Analytics | Off. The app sends no product analytics or error reports. |
| Updates | The feed is `updatesUrl` in `brand.json`, a generic electron-updater feed. |
| Logo | A placeholder mark (blue, two ring eyes). |

## Brand settings

`scripts/omnibot/brand.json` holds every brand value:

| Key | Default | Use |
| --- | --- | --- |
| `name` | `OmniBot` | The product name in the app, the installer and the web pages. |
| `scheme` | `omnibot` | The `omnibot://` link scheme. |
| `domain` | `omnibot.example.com` | The base domain: `api.`, `signal.`, `turn.` and the web pages. |
| `sitesDomain` | `omnibot-sites.example.com` | Hosted sites, as `<name>.<sitesDomain>`. |
| `updatesUrl` | `https://updates.omnibot.example.com` | The auto-update feed and the install scripts. |
| `repositoryUrl` | `https://omnibot.example.com/source` | Links to the source code. |
| `containerImage` | `registry.omnibot.example.com/omnibot` | The Docker image for headless hosts. |

The defaults are under `example.com`, which nobody can own, so the app cannot reach a stranger's
server by mistake. Change them to your own values, then run:

```sh
bun scripts/omnibot/rebrand.ts --dry-run   # see what changes
bun scripts/omnibot/rebrand.ts             # apply
```

The script also replaces the values it applied last (`applied.json`), so you can run it again
after each change and after each upstream merge.

## Logo and icons

`bun scripts/omnibot/make-icons.ts` draws the placeholder mark and writes all app and web icons.
To use your own artwork, replace these files:

- `build/icon-{production,dev,preview}.png` and `-macos-safe-area.png` (1600 × 1600)
- `build/icon-*.ico`, `build/icon.ico`, `build/icon-production.icns`, `build/icon.svg`
- `build/logo-colors/*` (one icon for each logo color the user can pick)
- `src/renderer/src/assets/openbot-logo-*.png`
- `apps/auth-api/public/` icons

The logo that the app draws comes from `packages/brand/src/app-logo-shape.ts` and `logo.css`.
The brand colors are `--openbot-logo-*` and `--openbot-accent*` in `packages/brand/src/tokens.css`.
These are not replaced yet: `apps/auth-api/public/openbot-social.png`, `build/dmg-background*.png`
(macOS only) and the iPhone and Android app icons in `apps/mobile/assets`.

## Build the Windows app

```sh
bun install --frozen-lockfile
bun run dist:win
```

The installer is in `dist/`. It is not code signed, so Windows SmartScreen warns on the first run.

## Run your own servers

Do the steps in [docs/self-hosting.md](docs/self-hosting.md), with your own domain:

1. **Domain on Cloudflare.** Add your domain to a free Cloudflare account.
2. **Account service (Cloudflare Worker).** In `apps/auth-api/wrangler.jsonc`, set `database_id` to
   the ID that `wrangler d1 create` prints, and set the SMTP values. Then deploy.
3. **Signal and TURN (your Linux VPS).** Copy `remote/.env.example` to `remote/.env.self-hosted`,
   fill it in, and start it with Docker Compose.

After `brand.json` has your domain, the app uses your servers by default. You do not have to set
`OPENBOT_AUTH_API_URL` or `OPENBOT_REMOTE_SIGNAL_URL`.

Features that need accounts of your own before they work:

- **Slack, Discord and Telegram:** make your own bot apps and give their secrets to Signal and the
  Worker (see `docs/messaging.md` and `remote/README.md`).
- **GitHub connector:** register your own GitHub App (`scripts/github-app/manifest.json`), then set
  `GITHUB_APP_CLIENT_ID` in `wrangler.jsonc` and `OPENBOT_GITHUB_CLIENT_ID` /
  `OPENBOT_GITHUB_APP_SLUG` for the app.
- **Paid hosted servers:** off (`HOSTED_SERVERS_ENABLED` is `"false"`). They need a boat.dev and
  Stripe account.
- **iPhone app:** needs your own Apple developer account, bundle id and push keys.

## Things that still use upstream addresses

- The provider runtime blocklist (`raw.githubusercontent.com/nightly-labs/openbot/...`). It only
  blocks broken agent runtime versions.
- The pinned remote desktop runtime download in `native-runtime.lock.json`.
- The GitHub workflows in `.github/`. They are OpenBot's release and review pipelines. Delete or
  change them before you push this fork to GitHub.
