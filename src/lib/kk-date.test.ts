import { describe, expect, it } from "vitest";
import { daysLeft, formatKkDate, remainingText } from "./kk-date";

// Local-time dates, so the tests do not depend on the computer's time zone.
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);

describe("formatKkDate", () => {
  it("writes day, month name and year", () => {
    expect(formatKkDate(at(2026, 12, 9))).toBe("9 желтоқсан 2026");
    expect(formatKkDate(at(2027, 1, 1))).toBe("1 қаңтар 2027");
    expect(formatKkDate(at(2026, 4, 30), { year: false })).toBe("30 сәуір");
  });
});

describe("remaining time", () => {
  const now = at(2026, 11, 9, 12);

  it("counts whole days, rounded up", () => {
    expect(daysLeft(at(2026, 12, 9, 12), now)).toBe(30);
    expect(daysLeft(at(2026, 11, 11, 13), now)).toBe(3);
    expect(daysLeft(at(2026, 11, 1), now)).toBe(0);
  });

  it("says today, tomorrow, or how many days", () => {
    expect(remainingText(at(2026, 11, 9, 18), now)).toBe("Бүгін аяқталады");
    expect(remainingText(at(2026, 11, 10, 9), now)).toBe("Ертең аяқталады");
    expect(remainingText(at(2026, 12, 9, 12), now)).toBe("30 күн қалды");
    expect(remainingText(at(2026, 11, 9, 11), now)).toBe("Аяқталды");
  });
});
