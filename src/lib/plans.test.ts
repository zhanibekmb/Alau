import { describe, expect, it } from "vitest";
import { PREMIUM_PLANS, findPremiumPlan, premiumExpiresAt } from "./plans";

describe("premium plans", () => {
  it("match the pricing table", () => {
    expect(PREMIUM_PLANS.map((p) => [p.kind, p.priceTenge, p.days])).toEqual([
      ["premium_monthly", 1490, 30],
      ["premium_annual", 11900, 365],
    ]);
  });

  it("end exactly the plan's number of days later", () => {
    const start = new Date("2026-11-08T12:00:00Z");
    expect(premiumExpiresAt(findPremiumPlan("premium_monthly")!, start).toISOString()).toBe("2026-12-08T12:00:00.000Z");
  });

  it("do not include a single book or unknown kinds", () => {
    expect(findPremiumPlan("single_book")).toBeUndefined();
    expect(findPremiumPlan("premium_forever")).toBeUndefined();
  });
});
