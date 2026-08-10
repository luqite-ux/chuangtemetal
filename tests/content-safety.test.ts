import { describe, expect, it } from "vitest";
import { assertNoProhibitedCopy, PROHIBITED_PROMISE_TERMS } from "@/lib/content-safety";

describe("public copy safety", () => {
  it("defines the complete prohibited promise list", () => {
    expect(PROHIBITED_PROMISE_TERMS).toEqual([
      "质保",
      "保修",
      "质量保证",
      "warranty",
      "warranties",
      "guarantee",
      "guaranteed",
    ]);
  });

  it("rejects prohibited promises regardless of case", () => {
    expect(() => assertNoProhibitedCopy("A neutral technical statement.")).not.toThrow();
    expect(() => assertNoProhibitedCopy("Quality GUARANTEED.")).toThrow(/guaranteed/i);
  });
});
