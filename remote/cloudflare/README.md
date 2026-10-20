# Signal on Cloudflare

This runs Signal (`remote/api`) in a Cloudflare Container at `signal.<domain>`, with Cloudflare
Realtime TURN in place of coturn, so the relay needs no server of its own. The Docker Compose setup
in `remote/compose.yaml` still works for a server you run yourself.

## How it works

- `src/index.ts` is a Worker. It passes every request, WebSockets included, to one container that
  runs the `remote/api` image. Signal keeps its sockets in memory, so there is one instance only.
- Cloudflare ends TLS. The Worker passes the client address as `X-Forwarded-For`.
- Signal gets TURN credentials from Cloudflare (`CLOUDFLARE_TURN_KEY_ID`, `CLOUDFLARE_TURN_API_TOKEN`)
  and renews them every 30 minutes. See `remote/api/src/cloudflare-turn.ts`.
- The open sockets of the hosts keep the container running. Cloudflare can still restart it, for
  example on a host update. Every host and client then reconnects by itself, and Telegram sends the
  updates of that gap again.

## Cost

Containers need the Workers Paid plan ($5/month). One `lite` instance (256 MiB) that runs all month
uses more memory than the plan includes, about $2/month more. The one Durable Object in front of it
stays within the plan's included duration. TURN is free up to 1,000 GB a month. If Signal runs out of
memory, set `instance_type` to `basic` (1 GiB, about $7/month more).

## Deploy

1. Install Docker Desktop and start it. Wrangler builds the image with it.
2. Run `bunx wrangler login` once.
3. Fill in the PASTE lines of `remote/.env.cloudflare`.
4. Deploy the account service first (`apps/auth-api`), so Signal can read its keys.
5. Deploy Signal:

   ```sh
   bunx dotenvx run -f remote/.env.cloudflare -- bun scripts/deploy-signal-container.ts
   ```

6. Check it:

   ```sh
   curl -fsS https://signal.<domain>/health/ready
   ```

With `TELEGRAM_WEBHOOK_ORIGIN` (a var in `wrangler.jsonc`), Signal points the bot's webhook at
itself when it starts.
