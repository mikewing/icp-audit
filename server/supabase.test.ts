import { describe, expect, it, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Use vi.hoisted so mock factories are available before module initialisation
// ---------------------------------------------------------------------------
const { mockFrom } = vi.hoisted(() => {
  const mockFrom = vi.fn();
  return { mockFrom };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ from: mockFrom })),
}));

import { upsertCoach, insertAuditResult } from "./supabase";

// ---------------------------------------------------------------------------
// upsertCoach — uses .upsert().select().single()
// ---------------------------------------------------------------------------
describe("upsertCoach", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the id on a successful upsert (new coach)", async () => {
    mockFrom.mockReturnValueOnce({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: "new-uuid-456" },
            error: null,
          }),
        })),
      })),
    });

    const id = await upsertCoach({ email: "new@example.com", name: "New Coach" });
    expect(id).toBe("new-uuid-456");
  });

  it("returns the id on a successful upsert (existing coach)", async () => {
    mockFrom.mockReturnValueOnce({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: "existing-uuid-123" },
            error: null,
          }),
        })),
      })),
    });

    const id = await upsertCoach({ email: "jane@example.com", name: "Jane" });
    expect(id).toBe("existing-uuid-123");
  });

  it("throws when upsert returns an error", async () => {
    mockFrom.mockReturnValueOnce({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "unique constraint violation" },
          }),
        })),
      })),
    });

    await expect(
      upsertCoach({ email: "bad@example.com", name: "Bad" })
    ).rejects.toThrow("coaches upsert failed");
  });
});

// ---------------------------------------------------------------------------
// insertAuditResult
// ---------------------------------------------------------------------------
describe("insertAuditResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves without error on successful insert", async () => {
    mockFrom.mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({ error: null }),
    });

    await expect(
      insertAuditResult({
        coachId: "coach-uuid-789",
        psychographicProfile: "DELIVERABLE 1: YOUR DREAM CLIENT PROFILE\nMock content.",
        rawResponses: { q1: "VP of Sales", q2: "Grew ARR by $2M", _firstName: "Jane", _email: "jane@example.com" },
      })
    ).resolves.toBeUndefined();
  });

  it("stores psychographic_profile as JSON-wrapped string", async () => {
    let capturedInsertArg: Record<string, unknown> | null = null;

    mockFrom.mockReturnValueOnce({
      insert: vi.fn((arg: Record<string, unknown>) => {
        capturedInsertArg = arg;
        return Promise.resolve({ error: null });
      }),
    });

    await insertAuditResult({
      coachId: "coach-uuid-789",
      psychographicProfile: "DELIVERABLE 1...",
      rawResponses: { q1: "test" },
    });

    expect(capturedInsertArg).not.toBeNull();
    const profile = capturedInsertArg!.psychographic_profile as string;
    const parsed = JSON.parse(profile) as { output: string };
    expect(parsed.output).toBe("DELIVERABLE 1...");
  });

  it("throws when insert returns an error", async () => {
    mockFrom.mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({ error: { message: "insert failed" } }),
    });

    await expect(
      insertAuditResult({
        coachId: "coach-uuid-789",
        psychographicProfile: "DELIVERABLE 1...",
        rawResponses: { q1: "VP of Sales" },
      })
    ).rejects.toThrow("icp_audit_results insert failed");
  });
});
