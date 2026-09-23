// Per-million-token USD prices. These drift as providers update pricing —
// verify against the official pages before trusting this for real budgeting.
export type ModelPricing = {
  id: string;
  label: string;
  provider: "OpenAI" | "Anthropic" | "Google";
  encoding: "cl100k_base" | "o200k_base" | "estimate";
  inputPerMillion: number;
  outputPerMillion: number;
  pricingUrl: string;
};

export const PRICING_AS_OF = "2026-01";

export const MODELS: ModelPricing[] = [
  {
    id: "gpt-4o",
    label: "GPT-4o",
    provider: "OpenAI",
    encoding: "o200k_base",
    inputPerMillion: 2.5,
    outputPerMillion: 10,
    pricingUrl: "https://openai.com/api/pricing/",
  },
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    provider: "OpenAI",
    encoding: "o200k_base",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    pricingUrl: "https://openai.com/api/pricing/",
  },
  {
    id: "gpt-4-turbo",
    label: "GPT-4 Turbo",
    provider: "OpenAI",
    encoding: "cl100k_base",
    inputPerMillion: 10,
    outputPerMillion: 30,
    pricingUrl: "https://openai.com/api/pricing/",
  },
  {
    id: "claude-sonnet",
    label: "Claude Sonnet",
    provider: "Anthropic",
    encoding: "estimate",
    inputPerMillion: 3,
    outputPerMillion: 15,
    pricingUrl: "https://www.anthropic.com/pricing",
  },
  {
    id: "claude-haiku",
    label: "Claude Haiku",
    provider: "Anthropic",
    encoding: "estimate",
    inputPerMillion: 1,
    outputPerMillion: 5,
    pricingUrl: "https://www.anthropic.com/pricing",
  },
  {
    id: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    provider: "Google",
    encoding: "estimate",
    inputPerMillion: 1.25,
    outputPerMillion: 5,
    pricingUrl: "https://ai.google.dev/pricing",
  },
];
