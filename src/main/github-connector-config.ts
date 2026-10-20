// The GitHub App that the built-in GitHub connection signs in to.
//
// `bun scripts/create-github-app.ts` creates the app and prints its Client ID. A Client ID is
// public: device flow and refresh need nothing else, and the client secret never ships.

/** Your GitHub App. Put its Client ID here once you create it. With no Client ID, the connection is not offered. */
const GITHUB_APP_CLIENT_ID = "";
const GITHUB_APP_SLUG = "omnibotgit";

export interface GitHubAppConfig {
  clientId: string;
  slug: string;
}

/** The configured app, or null. `OMNIBOT_GITHUB_CLIENT_ID` and `OMNIBOT_GITHUB_APP_SLUG` override it. */
export function githubAppConfig(env: NodeJS.ProcessEnv = process.env): GitHubAppConfig | null {
  const clientId = env.OMNIBOT_GITHUB_CLIENT_ID?.trim() || GITHUB_APP_CLIENT_ID;
  const slug = env.OMNIBOT_GITHUB_APP_SLUG?.trim() || GITHUB_APP_SLUG;
  if (!/^[A-Za-z0-9.]+$/u.test(clientId) || !/^[a-z0-9-]+$/u.test(slug)) return null;
  return { clientId, slug };
}
