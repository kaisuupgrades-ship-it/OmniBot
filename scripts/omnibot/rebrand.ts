/**
 * Rebrands this fork. It replaces the upstream product name, link scheme, app id, domains and
 * release addresses with the values in `brand.json`, in file contents and in file names.
 *
 *   bun scripts/omnibot/rebrand.ts            apply
 *   bun scripts/omnibot/rebrand.ts --dry-run  show what would change
 *
 * Run it again after you merge upstream changes: new upstream text gets the same replacements.
 * To change a value later (for example your real domain), edit `brand.json` and run it again. The
 * script keeps the values it applied last in `applied.json` and replaces those too.
 *
 * It does not change:
 * - LICENSE, NOTICE and the release notes. The license requires the notices to stay.
 * - Internal identifiers that users do not see: the `@openbot/*` packages, `--openbot-*` CSS
 *   tokens, `OPENBOT_*` environment variables, `openbot-app://` and the other private schemes,
 *   and the `openbot` tool server that agents call.
 * - Upstream downloads that the build needs: the pinned remote desktop runtime and the provider
 *   runtime blocklist.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { isDynamicRecord, isString } from "@openbot/contracts/runtime-values";

interface Brand {
  name: string;
  scheme: string;
  domain: string;
  sitesDomain: string;
  updatesUrl: string;
  repositoryUrl: string;
  containerImage: string;
}

const UPSTREAM: Brand = {
  name: "OpenBot",
  scheme: "openbot",
  domain: "openbot.run",
  sitesDomain: "openbot.site",
  updatesUrl: "https://github.com/nightly-labs/openbot/releases/latest/download",
  repositoryUrl: "https://github.com/nightly-labs/openbot",
  containerImage: "ghcr.io/nightly-labs/openbot",
};

const ROOT = resolve(import.meta.dirname, "../..");
const BRAND_FILE = join(import.meta.dirname, "brand.json");
const APPLIED_FILE = join(import.meta.dirname, "applied.json");

/** Paths that keep their upstream text. */
const EXCLUDED: readonly RegExp[] = [
  /^LICENSE$/u,
  /^NOTICE$/u,
  /(^|\/)CHANGELOG\.md$/u,
  /(^|\/)changelog\.d\//u,
  /^bun\.lock$/u,
  /(^|\/)\.env\.(production|dev)$/u,
  /^scripts\/omnibot\//u,
  /^OMNIBOT\.md$/u,
  /^vendor\//u,
  /^native-runtime\.lock\.json$/u,
  /^scripts\/[^/]*remote-desktop-runtime[^/]*$/u,
  /^scripts\/host-manager-macos\.ts$/u,
];

/** Rules that skip some paths. `"scheme:"` is also a performance mark prefix in this script. */
const RULE_EXCLUDED = new Map<string, readonly RegExp[]>([
  ["scheme-colon", [/^scripts\/dev-automation\/render-metrics\.ts$/u]],
]);

interface Rule {
  id: string;
  from: string | RegExp;
  to: string;
}

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//u, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

/** The replacements from one brand to another. The order matters: longer addresses go first. */
function rules(from: Brand, to: Brand, upstream: boolean): Rule[] {
  const list: Rule[] = [];
  const add = (id: string, source: string | RegExp, target: string) => {
    if (typeof source === "string" && source === target) return;
    list.push({ id, from: source, to: target });
  };
  if (upstream) {
    // Upstream release and install addresses that are not the update feed itself.
    add("releases", "https://github.com/nightly-labs/openbot/releases", to.updatesUrl);
    add("releases-bare", "github.com/nightly-labs/openbot/releases", stripScheme(to.updatesUrl));
    add(
      "raw-scripts",
      "https://raw.githubusercontent.com/nightly-labs/openbot/main/scripts/",
      `${to.updatesUrl}/scripts/`,
    );
    add(
      "raw-docker",
      "https://raw.githubusercontent.com/nightly-labs/openbot/main/docker/",
      `${to.updatesUrl}/docker/`,
    );
  }
  // The update feed comes first because the upstream feed starts with the release address.
  list.unshift(
    ...(from.updatesUrl === to.updatesUrl ? [] : [{ id: "updates", from: from.updatesUrl, to: to.updatesUrl }]),
  );
  add("container", from.containerImage, to.containerImage);
  add("repository", from.repositoryUrl, to.repositoryUrl);
  add("sites-domain", from.sitesDomain, to.sitesDomain);
  add("domain", from.domain, to.domain);
  if (from.scheme !== to.scheme) {
    add("scheme-url", `${from.scheme}://`, `${to.scheme}://`);
    add("scheme-colon", `"${from.scheme}:"`, `"${to.scheme}:"`);
    add(
      "scheme-register",
      `setAsDefaultProtocolClient("${from.scheme}")`,
      `setAsDefaultProtocolClient("${to.scheme}")`,
    );
    add("scheme-windows", `Classes\\${from.scheme}`, `Classes\\${to.scheme}`);
    add("scheme-linux", `x-scheme-handler/${from.scheme}`, `x-scheme-handler/${to.scheme}`);
    add("scheme-expo", `"scheme": "${from.scheme}"`, `"scheme": "${to.scheme}"`);
    add("scheme-builder", new RegExp(`(schemes:\\r?\\n\\s+- )${escapeRegExp(from.scheme)}\\b`, "gu"), `$1${to.scheme}`);
    // The app id `app.<scheme>.desktop` and the Linux desktop entry `<scheme>.desktop`.
    add("app-id", `${from.scheme}.desktop`, `${to.scheme}.desktop`);
  }
  add("name", from.name, to.name);
  return list;
}

function applyRules(path: string, text: string, list: readonly Rule[], counts: Map<string, number>): string {
  let result = text;
  for (const rule of list) {
    if (RULE_EXCLUDED.get(rule.id)?.some((pattern) => pattern.test(path))) continue;
    if (typeof rule.from === "string") {
      const parts = result.split(rule.from);
      if (parts.length > 1) {
        counts.set(rule.id, (counts.get(rule.id) ?? 0) + parts.length - 1);
        result = parts.join(rule.to);
      }
    } else {
      const pattern = rule.from;
      const matches = result.match(pattern);
      if (matches) {
        counts.set(rule.id, (counts.get(rule.id) ?? 0) + matches.length);
        result = result.replace(pattern, rule.to);
      }
    }
  }
  return result;
}

function readBrand(file: string): Brand {
  const value = JSON.parse(readFileSync(file, "utf8"));
  if (!isDynamicRecord(value)) throw new Error(`${file} is not a JSON object.`);
  const field = (key: keyof Brand): string => {
    const text = value[key];
    if (!isString(text) || text.trim() === "") throw new Error(`${file}: "${key}" must be a text value.`);
    return text.trim();
  };
  const brand: Brand = {
    name: field("name"),
    scheme: field("scheme"),
    domain: field("domain"),
    sitesDomain: field("sitesDomain"),
    updatesUrl: field("updatesUrl"),
    repositoryUrl: field("repositoryUrl"),
    containerImage: field("containerImage"),
  };
  if (!/^[a-z][a-z0-9+.-]*$/u.test(brand.scheme)) throw new Error(`${file}: "scheme" must be a lowercase URL scheme.`);
  for (const key of ["updatesUrl", "repositoryUrl"] as const) {
    if (!brand[key].startsWith("https://") || brand[key].endsWith("/"))
      throw new Error(`${file}: "${key}" must start with https:// and must not end with a slash.`);
  }
  if (brand.name.includes(UPSTREAM.name) || brand.scheme === UPSTREAM.scheme)
    throw new Error(`${file}: the new name and scheme must differ from the upstream ones.`);
  return brand;
}

function trackedFiles(): string[] {
  const listed = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  if (listed.status !== 0) throw new Error(`git ls-files failed: ${listed.stderr}`);
  return [...new Set(listed.stdout.split("\0").filter(Boolean))];
}

function isText(buffer: Buffer): boolean {
  return !buffer.subarray(0, 8_000).includes(0);
}

function main(): void {
  const dryRun = process.argv.includes("--dry-run");
  const target = readBrand(BRAND_FILE);
  const applied = existsSync(APPLIED_FILE) ? readBrand(APPLIED_FILE) : null;
  const passes: Rule[][] = [];
  // Values from a previous run first, then upstream text from a merge.
  if (applied) passes.push(rules(applied, target, false));
  passes.push(rules(UPSTREAM, target, true));

  const counts = new Map<string, number>();
  const changed: string[] = [];
  const renames: [string, string][] = [];
  for (const path of trackedFiles()) {
    if (EXCLUDED.some((pattern) => pattern.test(path))) continue;
    const absolute = join(ROOT, path);
    // A submodule or a link to a folder is listed as one path.
    if (!existsSync(absolute) || !statSync(absolute).isFile()) continue;
    const buffer = readFileSync(absolute);
    if (buffer.length <= 5 * 1024 * 1024 && isText(buffer)) {
      const text = buffer.toString("utf8");
      const next = passes.reduce((current, list) => applyRules(path, current, list, counts), text);
      if (next !== text) {
        changed.push(path);
        if (!dryRun) writeFileSync(absolute, next);
      }
    }
    const nextPath = passes.reduce((current, list) => applyRules(path, current, list, new Map()), path);
    if (nextPath !== path) renames.push([path, nextPath]);
  }

  for (const [from, to] of renames) {
    if (dryRun) continue;
    mkdirSync(dirname(join(ROOT, to)), { recursive: true });
    const moved = spawnSync("git", ["mv", "--", from, to], { cwd: ROOT, encoding: "utf8" });
    if (moved.status !== 0) renameSync(join(ROOT, from), join(ROOT, to));
  }

  if (!dryRun) writeFileSync(APPLIED_FILE, `${JSON.stringify(target, null, 2)}\n`);

  const lines = [
    dryRun ? "Dry run. Nothing was written." : "Rebrand applied.",
    `Files with changed text: ${changed.length}`,
    `Renamed files: ${renames.length}`,
    ...renames.map(([from, to]) => `  ${from} -> ${to}`),
    "Replacements by rule:",
    ...[...counts].sort((left, right) => right[1] - left[1]).map(([id, count]) => `  ${id}: ${count}`),
  ];
  // The script does not use the repository logger: the rebrand renames its exports.
  process.stdout.write(`${lines.join("\n")}\n`);
}

main();
