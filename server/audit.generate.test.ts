import { describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Mock @anthropic-ai/sdk before importing the router
// ---------------------------------------------------------------------------
vi.mock("@anthropic-ai/sdk", () => {
  const mockCreate = vi.fn().mockResolvedValue({
    id: "mock-id",
    type: "message",
    role: "assistant",
    content: [
      {
        type: "text",
        text: "DELIVERABLE 1: YOUR DREAM CLIENT PROFILE\nMock profile content.\n\nDELIVERABLE 2: YOUR ANTI-ICP PROFILE\nMock anti-icp content.\n\nDELIVERABLE 3: YOUR MESSAGING MIRROR\nMock messaging content.\n\nWHAT THIS MEANS FOR YOU, Jane\nMock upsell content.",
      },
    ],
    model: "claude-sonnet-4-5",
    stop_reason: "end_turn",
    usage: { input_tokens: 100, output_tokens: 200 },
  });

  return {
    default: vi.fn().mockImplementation(() => ({
      messages: { create: mockCreate },
    })),
  };
});

// Mock Supabase writes so they don't fail in tests
vi.mock("./supabase", () => ({
  upsertCoach: vi.fn().mockResolvedValue("mock-coach-uuid"),
  insertAuditResult: vi.fn().mockResolvedValue(undefined),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const MOCK_ANSWERS: Record<string, string> = {
  q1: "VP of Sales at a B2B SaaS company",
  q2: "Closed $2M in new ARR in 6 months",
  q3: "Showed up prepared, did the work between sessions",
  q4: "Referral from a peer, triggered by a missed quota",
  q5: "Revenue doubles, team morale improves",
  q6: "8 clients, rates from $3k to $8k/month",
  q7: "$8k/month, believed the market wouldn't pay more",
  q8: "$1.5k, told myself it was a foot in the door",
  q9: "Operators who move fast and want results",
  q10: "People who want validation, not change",
  q11: "Client ghosted after month 2",
  q12: "Aspiring coaches who can't afford me",
  q13: "Anyone who needs convincing to invest in themselves",
  q14: "Price, timing, need to think about it",
  q15: "I help leaders see the system problem behind the people problem",
  q16: "I coach leaders to build high-performing teams",
  q17: "Why is my team still underperforming after all I've done",
  q18: "They think it's a hiring problem",
  q19: "Tried a team offsite, read leadership books, hired an HR consultant",
  q20: "One case study from someone in their exact situation",
  q21: "LinkedIn, leadership forums, executive peer groups",
  q22: "When a peer says 'you need to talk to my coach'",
  q23: "Team hitting targets without me micromanaging every deal",
};

describe("audit.generate", () => {
  it("returns output and firstName on success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.audit.generate({
      answers: MOCK_ANSWERS,
      firstName: "Jane",
      email: "jane@example.com",
    });

    expect(result.firstName).toBe("Jane");
    expect(result.email).toBe("jane@example.com");
    expect(typeof result.output).toBe("string");
    expect(result.output.length).toBeGreaterThan(0);
  });

  it("rejects invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.audit.generate({
        answers: MOCK_ANSWERS,
        firstName: "Jane",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });

  it("rejects empty firstName", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.audit.generate({
        answers: MOCK_ANSWERS,
        firstName: "",
        email: "jane@example.com",
      })
    ).rejects.toThrow();
  });
});
