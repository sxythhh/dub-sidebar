import {
  streamText,
  stepCountIs,
  type UIMessage,
  convertToModelMessages,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { Index } from "@upstash/vector";
import { z } from "zod";

export const maxDuration = 30;

function getVectorIndex() {
  return new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });
}

const SYSTEM_PROMPT = `You are the Content Rewards support assistant. You help brands and creators with questions about the platform.

Guidelines:
- Be concise, friendly, and direct. Match the user's tone.
- Always search the docs before answering product questions. Use the searchDocs tool.
- If you find relevant docs, answer based on them. Cite the source naturally (e.g. "According to our docs on payouts...").
- If docs don't cover the question, say so honestly and suggest they contact support.
- For account-specific issues (payments stuck, submissions missing, bugs), suggest escalating to a human via the support form.
- Never make up features, pricing, or policies. Only state what's in the docs.
- You can answer general questions about how the platform works without searching if you're confident from prior context in the conversation.
- If the user asks to speak to a human, talk to someone, or wants to escalate, respond warmly and tell them to click the "Need a human? Talk to our team" button below the chat. Do not try to block or discourage them — just acknowledge and point them to the button.

Content Rewards is a platform connecting brands with creators for content distribution. Brands pay per view (CPM model). Creators earn by posting videos on TikTok, YouTube, Instagram, and X.`;

const searchDocsSchema = z.object({
  query: z.string().describe("The search query — use natural language"),
  docType: z
    .enum(["general", "brands", "creators", "all"])
    .default("all")
    .describe(
      "Filter by doc type. Use 'brands' for brand-specific questions, 'creators' for creator questions, or 'all' for general searches."
    ),
});

async function searchDocs({ query, docType }: z.infer<typeof searchDocsSchema>) {
  const filter =
    docType === "all" ? undefined : `docType = '${docType}'`;

  const results = await getVectorIndex().query({
    data: query,
    topK: 5,
    includeData: true,
    includeMetadata: true,
    filter,
  });

  if (!results.length) {
    return { found: false, results: [] };
  }

  return {
    found: true,
    results: results.map((r) => ({
      score: r.score,
      content: r.data,
      metadata: r.metadata,
    })),
  };
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      searchDocs: {
        description:
          "Search the Content Rewards documentation and help articles. Use this to find answers about how the platform works, campaigns, payouts, submissions, trust scores, account setup, etc.",
        inputSchema: searchDocsSchema,
        execute: searchDocs,
      },
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
