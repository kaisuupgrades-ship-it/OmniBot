// Re-pins native-runtime.lock.json after a remote desktop patch changes: each patch's sha256, then
// the input digest and release tag that depend on them. The release itself must then be rebuilt
// with the "Remote desktop runtime" workflow and pinned with scripts/pin-remote-desktop-runtime.ts,
// which cannot do this step: it loads the lock only when the digest is already current. Until the
// pin, releaseArtifacts keep the old build checksums.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createOmniBotLogger } from "@omnibot/logging";
import {
  createRemoteDesktopInputDigest,
  createRemoteDesktopReleaseTag,
  nativeRuntimeLockSchema,
} from "../native-runtime-lock";

const RELEASE_REPOSITORY = "kaisuupgrades-ship-it/OmniBot";

const path = resolve(import.meta.dirname, "../../native-runtime.lock.json");
const text = await readFile(path, "utf8");
const lock = nativeRuntimeLockSchema.parse(JSON.parse(text));
let next = text;
for (const runtime of [lock.remoteDesktop.sunshine, lock.remoteDesktop.moonlightWeb]) {
  const digest = createHash("sha256")
    .update(await readFile(resolve(import.meta.dirname, "../..", runtime.patch.path)))
    .digest("hex");
  next = next.replace(runtime.patch.sha256, digest);
  runtime.patch.sha256 = digest;
}
const release = lock.remoteDesktop.artifactRelease;
if (release) {
  const inputDigest = createRemoteDesktopInputDigest(lock);
  next = next
    .replace(`"repository": "${release.repository}"`, `"repository": "${RELEASE_REPOSITORY}"`)
    .replace(`"tag": "${release.tag}"`, `"tag": "${createRemoteDesktopReleaseTag(inputDigest)}"`)
    .replace(`"inputDigest": "${release.inputDigest}"`, `"inputDigest": "${inputDigest}"`);
}
await writeFile(path, next);
createOmniBotLogger("fix-lock").info("native-runtime.lock.json re-pinned.");
