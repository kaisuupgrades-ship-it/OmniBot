# CLAUDE.md

Read `AGENTS.md` first; its rules apply. Then `HANDOFF.md` (state) and `OMNIBOT.md` (setup).

## Name rule: zero traces of the old product name

The old product name (the 7-letter word that `omnibot` replaced) must not appear in any tracked
file contents, file names or directory names. Check with:

    git grep -il "open""bot" -- ':!LICENSE' ':!NOTICE'

It must return nothing. **Exceptions: `LICENSE` and `NOTICE`.** They are the upstream author's
license and copyright notice and stay word for word (see Licensing).

Commit messages of the upstream history contain the old name. That is expected. Do not rewrite
history unless the owner asks.

## Substitutions are 7 characters for 7

The old name maps to `omnibot`, `OmniBot`, `OMNIBOT` letter by letter, case kept per letter. Line
lengths never change, so `.patch` hunk headers stay valid. Keep this property for any new
substitution.

## Remote desktop helper

- `native-runtime.lock.json` is content-addressed. `remoteDesktop.artifactRelease.inputDigest`
  hashes the recipe, which includes each `patch.path` and `patch.sha256`; the tag is
  `remote-desktop-runtime-<inputDigest>`. Renaming or editing a patch invalidates the release.
- After a patch change, run `bun scripts/omnibot/fix-lock.ts` (patch checksums, digest, tag).
- The helper binaries have the route, env var and message-source names compiled in
  (`/api/omnibot/*`, `OMNIBOT_REMOTE_SETUP`, `OMNIBOT_SECURITY_TESTS`, `omnibot-moonlight`).
  Changing them in TypeScript alone breaks remote desktop. Rebuild with the "Remote desktop runtime"
  workflow, then `bun scripts/pin-remote-desktop-runtime.ts`.
- Never ship an app build between a helper-name change and the helper rebuild. App and helper move
  together.
- The pinned release in `kaisuupgrades-ship-it/OmniBot` may not exist yet. That is expected until
  the workflow runs.

## Settled

- Package manager: `bun` (`bun@1.4.2`), Node 24. Not npm.
- `*.omnibot.example.com` URLs are intentional placeholders until the owner sets a domain in
  `scripts/omnibot/brand.json`. Do not replace them with a real domain.
- The `upstream` remote points at a third-party repository. Do not push to it.
- Do not add files (CLA, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY) unless asked.

## Licensing

`LICENSE` is PolyForm Noncommercial 1.0.0 and `NOTICE` holds the Synthetify Labs copyright. Keep
both, every `license` field, and the `Required Notice:` lines as they are. Do not relicense files
or remove the copyright notice unless the owner has a written copyright assignment or relicensing
permission from Synthetify Labs.
