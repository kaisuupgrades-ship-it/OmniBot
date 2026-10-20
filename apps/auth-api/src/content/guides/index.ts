// Slug to guide body, on the same terms as the news bodies: eager, so the prose
// is in the server's HTML rather than arriving after hydration.

import type { ArticleBody } from "../body";
import { AgenticAIDefinition } from "./agentic-ai-definition";
import { OmniBot101 } from "./omnibot-101";
import { OmniBotHostedServers } from "./omnibot-hosted-servers";
import { OmniBotMarketplace } from "./omnibot-marketplace";
import { WhatAreAIAgents } from "./what-are-ai-agents";
import { WtfIsOmniBot } from "./wtf-is-omnibot";

export const GUIDE_BODIES: Readonly<Record<string, ArticleBody>> = {
  "agentic-ai-definition": AgenticAIDefinition,
  "what-are-ai-agents": WhatAreAIAgents,
  "omnibot-101": OmniBot101,
  "omnibot-hosted-servers": OmniBotHostedServers,
  "omnibot-marketplace": OmniBotMarketplace,
  "wtf-is-omnibot": WtfIsOmniBot,
};
