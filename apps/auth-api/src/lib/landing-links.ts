export const EXTERNAL_LINK_REL = "noopener noreferrer";

/** The installer each platform's download button starts: Apple silicon on macOS, x64 elsewhere. */
export const OMNIBOT_DOWNLOAD_LINKS = {
  macos: "/download/macos/latest",
  windows: "/download/windows/latest",
  linux: "/download/linux/latest",
} as const;

/** The other installer of a platform that ships two architectures. Windows ships x64 only. */
export const OMNIBOT_ALTERNATE_DOWNLOAD_LINKS = {
  macos: "/download/macos/latest?arch=x64",
  linux: "/download/linux/latest?arch=arm64",
} as const;

/** The pages that describe each installer: requirements, install steps and known limits. */
export const OMNIBOT_DOWNLOAD_PAGE_LINKS = {
  hub: "/download",
  macos: "/download/macos",
  windows: "/download/windows",
  linux: "/download/linux",
  ios: "/download/ios",
  android: "/download/android",
} as const;

export const OMNIBOT_LINKS = {
  /** The contact form page. */
  contact: "/contact",
  /** A Redirect Rule in the omnibot.example.com Cloudflare zone sends this to your X account. */
  x: "https://x.omnibot.example.com",
  /** A Redirect Rule in the omnibot.example.com Cloudflare zone sends this to the current Discord invite. */
  discord: "https://discord.omnibot.example.com",
  download: "#download",
  news: "/news",
  guides: "/guides",
  plugins: "/plugins",
  changelog: "/changelog",
  releases: "https://updates.omnibot.example.com",
  repository: "https://omnibot.example.com/source",
  license: "https://omnibot.example.com/source/blob/main/LICENSE",
  privacy: "https://omnibot.example.com/source/blob/main/PRIVACY.md",
  documentation: "https://omnibot.example.com/source#readme",
  troubleshooting: "https://omnibot.example.com/source/blob/main/docs/TROUBLESHOOTING.md",
  /** GitHub Pages hosts the status page, so it stays up when Cloudflare does not. */
  status: "https://status.omnibot.example.com",
  selfHostedServer: "https://omnibot.example.com/source/blob/main/docs/self-hosted-server.md",
  architecture: "https://omnibot.example.com/source#architecture",
  codex: "https://learn.chatgpt.com/docs/app-server",
  claude: "https://code.claude.com/docs/en/overview",
  anthropicAgents: "https://www.anthropic.com/engineering/building-effective-agents",
} as const;

/**
 * One entry in a footer column. An internal entry carries a route, not a string,
 * so the footer can render it as a client navigation. It also fixes a link that
 * only worked on one page: "#download" on its own finds nothing on /news, because
 * there is no download section there for it to scroll to.
 */
export type FooterLink =
  | { readonly label: string; readonly external: true; readonly href: string }
  | {
      readonly label: string;
      readonly external: false;
      readonly to:
        | "/"
        | "/download"
        | "/news"
        | "/guides"
        | "/plugins"
        | "/changelog"
        | "/compare"
        | "/providers"
        | "/teams"
        | "/contact";
      readonly hash?: string;
    }
  | {
      readonly label: string;
      readonly external: false;
      readonly to: "/compare/$slug" | "/providers/$slug";
      readonly slug: string;
    };

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Download", external: false, to: "/download" },
      { label: "News", external: false, to: "/news" },
      { label: "Guides", external: false, to: "/guides" },
      { label: "Plugins", external: false, to: "/plugins" },
      { label: "Changelog", external: false, to: "/changelog" },
      { label: "Teams", external: false, to: "/teams" },
      { label: "Contact", external: false, to: "/contact" },
      { label: "Source code", external: true, href: OMNIBOT_LINKS.repository },
      { label: "License", external: true, href: OMNIBOT_LINKS.license },
      { label: "Privacy", external: true, href: OMNIBOT_LINKS.privacy },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", external: true, href: OMNIBOT_LINKS.documentation },
      { label: "Troubleshooting", external: true, href: OMNIBOT_LINKS.troubleshooting },
      { label: "Status", external: true, href: OMNIBOT_LINKS.status },
      { label: "Self-hosted server", external: true, href: OMNIBOT_LINKS.selfHostedServer },
      { label: "Architecture", external: true, href: OMNIBOT_LINKS.architecture },
      { label: "Codex", external: true, href: OMNIBOT_LINKS.codex },
      { label: "Claude Code", external: true, href: OMNIBOT_LINKS.claude },
      { label: "Discord", external: true, href: OMNIBOT_LINKS.discord },
    ],
  },
  {
    title: "Providers",
    links: [
      { label: "Claude Code", external: false, to: "/providers/$slug", slug: "claude-code" },
      { label: "Codex", external: false, to: "/providers/$slug", slug: "codex" },
      { label: "Gemini", external: false, to: "/providers/$slug", slug: "gemini" },
      { label: "Grok", external: false, to: "/providers/$slug", slug: "grok" },
      { label: "Cursor", external: false, to: "/providers/$slug", slug: "cursor" },
      { label: "OpenCode", external: false, to: "/providers/$slug", slug: "opencode" },
      { label: "Cline", external: false, to: "/providers/$slug", slug: "cline" },
      { label: "Ollama and LM Studio", external: false, to: "/providers/$slug", slug: "local-models" },
      { label: "All providers", external: false, to: "/providers" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "OmniBot vs Instinct", external: false, to: "/compare/$slug", slug: "instinct" },
      { label: "OmniBot vs ChatGPT dots", external: false, to: "/compare/$slug", slug: "chatgpt-dots" },
      { label: "OmniBot vs Grok Bot", external: false, to: "/compare/$slug", slug: "grok-bot" },
      { label: "OmniBot vs Muse", external: false, to: "/compare/$slug", slug: "muse" },
      { label: "OmniBot vs Hermes Agent", external: false, to: "/compare/$slug", slug: "hermes-agent" },
      { label: "OmniBot vs OpenClaw", external: false, to: "/compare/$slug", slug: "openclaw" },
      { label: "OmniBot vs Manus", external: false, to: "/compare/$slug", slug: "manus" },
      { label: "OmniBot vs Claude Cowork", external: false, to: "/compare/$slug", slug: "claude-cowork" },
      { label: "OmniBot vs Devin", external: false, to: "/compare/$slug", slug: "devin" },
      { label: "Best AI agent apps", external: false, to: "/compare/$slug", slug: "best-ai-agent-apps" },
      { label: "All comparisons", external: false, to: "/compare" },
    ],
  },
];
