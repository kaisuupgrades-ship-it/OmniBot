// Deploys Signal to a Cloudflare Container (remote/cloudflare). Run it with the secrets in the
// environment, for example:
//
//   bunx dotenvx run -f remote/.env.cloudflare -- bun scripts/deploy-signal-container.ts
//
// It needs Docker running (Wrangler builds the image) and `wrangler login`.
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createOmniBotLogger, toLogValue } from "@omnibot/logging";

const logger = createOmniBotLogger("deploy-signal-container");

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const workerRoot = join(projectRoot, "remote", "cloudflare");
const wranglerExecutable = join(
  projectRoot,
  "node_modules",
  ".bin",
  `wrangler${process.platform === "win32" ? ".exe" : ""}`,
);

const REQUIRED = [
  "REMOTE_SESSION_SECRET",
  "REMOTE_AUTH_WEBHOOK_SECRET",
  "CLOUDFLARE_TURN_KEY_ID",
  "CLOUDFLARE_TURN_API_TOKEN",
];
/** Each set is all or none. */
const OPTIONAL_SETS = [["TELEGRAM_BOT_TOKENS", "TELEGRAM_WEBHOOK_SECRET"], ["REMOTE_METRICS_TOKEN"]];

async function main(): Promise<void> {
  const secrets: Record<string, string> = {};
  for (const name of REQUIRED) secrets[name] = requiredValue(name);
  for (const set of OPTIONAL_SETS) {
    const present = set.filter((name) => optionalValue(name) !== null);
    if (present.length === 0) {
      logger.info(`${set.join(", ")} not set. That part of Signal stays off.`);
      continue;
    }
    if (present.length !== set.length) throw new Error(`Set all of ${set.join(", ")}, or none.`);
    for (const name of set) secrets[name] = requiredValue(name);
  }

  // The first deploy creates the Worker. The secrets then make a new version, and the last deploy
  // restarts the container so Signal starts with them. Nothing connects before the first request.
  await run(["deploy"], "Signal Worker deployment");
  await run(["secret", "bulk"], "Signal secrets", JSON.stringify(secrets));
  await run(["deploy"], "Signal container rollout");
  logger.info("Signal is deployed. Check it with: curl -fsS https://signal.<your domain>/health/ready");
}

function optionalValue(name: string): string | null {
  const text = process.env[name]?.trim();
  if (!text) return null;
  if (text.startsWith("encrypted:")) throw new Error(`${name} is not decrypted.`);
  return text;
}

function requiredValue(name: string): string {
  const text = optionalValue(name);
  if (text === null) throw new Error(`${name} is missing from the environment.`);
  return text;
}

function run(args: string[], label: string, input?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const environment = { ...process.env };
    // Wrangler uses the `wrangler login` session. The secrets reach it only through stdin.
    delete environment.CLOUDFLARE_API_TOKEN;
    for (const name of [...REQUIRED, ...OPTIONAL_SETS.flat()]) delete environment[name];
    const child = spawn(wranglerExecutable, args, {
      cwd: workerRoot,
      env: environment,
      shell: false,
      stdio: [input === undefined ? "inherit" : "pipe", "inherit", "inherit"],
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} failed with ${signal ? `signal ${signal}` : `code ${code ?? 1}`}.`));
    });
    if (input !== undefined) child.stdin?.end(input);
  });
}

void main().catch((error) => {
  logger.error("Signal deployment failed.", toLogValue(error));
  process.exitCode = 1;
});
