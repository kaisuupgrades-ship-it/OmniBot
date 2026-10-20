// Slug to guide body, on the same terms as the news bodies: eager, so the prose
// is in the server's HTML rather than arriving after hydration.

import type { ArticleBody } from "../body";
import { AgenticAIDefinition } from "./agentic-ai-definition";
import { OmniBot101 } from "./openbot-101";
import { OmniBotHostedServers } from "./openbot-hosted-servers";
import { OmniBotMarketplace } from "./openbot-marketplace";
import { WhatAreAIAgents } from "./what-are-ai-agents";
import { WtfIsOmniBot } from "./wtf-is-openbot";

export const GUIDE_BODIES: Readonly<Record<string, ArticleBody>> = {
  "agentic-ai-definition": AgenticAIDefinition,
  "what-are-ai-agents": WhatAreAIAgents,
  "openbot-101": OmniBot101,
  "openbot-hosted-servers": OmniBotHostedServers,
  "openbot-marketplace": OmniBotMarketplace,
  "wtf-is-openbot": WtfIsOmniBot,
};
