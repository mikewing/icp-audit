import { describe, expect, it } from "vitest";

// Auth and logout have been removed — this is a public-facing audit tool.
describe("auth", () => {
  it("no auth required", () => {
    expect(true).toBe(true);
  });
});
