import { existsSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { Pool } from "pg";
import { findEdition } from "../src/lib/catalog";

// The money path of the demo paywall, end to end (docs/paywall-plan.md, decision E3B).
// Lake Bakaly B1 is free up to chapter 6. Chapter 7 is the sign-up gift (GIFT_CHAPTERS): any
// account reads it. Chapter 8 is the first paid one.

const BOOK = "secret-of-lake-bakaly-b1";
const WORK = "secret-of-lake-bakaly";
const PASSWORD = "e2e-reader-password-2108";

/** A fresh reader per test, removed again by global-teardown.ts. */
const newEmail = () => `e2e+${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.kz`;

/** Stands in for clicking the link in the confirmation email (the test cannot read the inbox). */
async function confirmEmail(email: string) {
  if (existsSync(".env")) process.loadEnvFile(".env");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(`UPDATE "user" SET email_verified = true WHERE email = $1`, [email]);
  } finally {
    await pool.end();
  }
}

/** Every guest view gets a known anonymous id, so teardown can find and delete it. */
async function useTestAnonId(page: Page) {
  const anonId = `e2e-anon-${Date.now()}`;
  await page.addInitScript((id) => window.localStorage.setItem("alau-anon-id", id), anonId);
}

/** First page of a chapter, from the same catalog the server uses, so the test survives text edits. */
function firstPageOf(n: number): number {
  const chapter = findEdition(BOOK)?.info.chapters.find((c) => c.n === n);
  if (!chapter) throw new Error(`${BOOK} has no chapter ${n}`);
  return chapter.firstPage;
}
const GIFT = 7;
const PAID = 8;

test("a guest reaches the paywall, signs up, buys the book in demo mode and reads on", async ({ page }) => {
  await useTestAnonId(page);
  const paidPage = firstPageOf(PAID);

  await page.goto(`/read/${BOOK}?page=${paidPage}`);

  // Guest: first the free gift chapter for an account, then all three tariffs.
  await expect(page.getByRole("heading", { name: `${GIFT}-тарау — сізге сыйлық` })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.getByRole("button", { name: "Тіркеліп, тариф таңдау" }).click();

  // Sign-up asks to confirm the email; after that, signing in returns to the first page of chapter 8.
  await expect(page).toHaveURL(/\/login\?mode=sign-up/);
  const email = newEmail();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Құпиясөз").fill(PASSWORD);
  await page.getByRole("button", { name: "Аккаунт ашу" }).click();
  await expect(page.getByRole("heading", { name: "Поштаңызды тексеріңіз" })).toBeVisible();
  await confirmEmail(email);
  await page.getByRole("button", { name: "Басқа email-мен кіру" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Құпиясөз").fill(PASSWORD);
  await page.getByRole("button", { name: "Кіру", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/read/${BOOK}\\?page=${paidPage}(&|$)`));

  // Signed in: choose this book and buy it.
  await page.getByRole("radio", { name: /Осы кітап/ }).click();
  await page.getByRole("button", { name: /Таңдау · 490/ }).click();

  const interestMessage = page.getByText("Төлем жақында ашылады", { exact: false });
  const chapterHeading = page.getByRole("heading", { name: new RegExp(`^Chapter ${PAID}:`) });
  await expect(chapterHeading.or(interestMessage)).toBeVisible();
  expect(await interestMessage.isVisible(), "the dev server must run with PAYMENTS_MODE=demo").toBe(false);
  await expect(chapterHeading).toBeVisible();
});

test("a paid chapter cached in the browser stays closed without access", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "server behaviour, one browser size is enough");
  await useTestAnonId(page);
  const api = page.request;
  // A real browser sends Origin; Better Auth refuses cookie-carrying POSTs without it (CSRF protection).
  const json = (data: object) => ({ data, headers: { "content-type": "application/json", origin: "http://localhost:3000" } });

  const email = newEmail();
  expect((await api.post("/api/auth/sign-up/email", json({ email, password: PASSWORD, name: "e2e" }))).status()).toBe(200);
  await confirmEmail(email);
  expect((await api.post("/api/auth/sign-in/email", json({ email, password: PASSWORD }))).status()).toBe(200);
  const choice = await api.post("/api/paywall/choice", json({ plan: "single_book", work: WORK, slug: BOOK, chapter: PAID, anonId: `e2e-anon-${Date.now()}` }));
  expect(choice.status()).toBe(200);
  expect(await choice.json(), "the dev server must run with PAYMENTS_MODE=demo").toMatchObject({ unlocked: true });

  const owned = await api.get(`/api/books/${BOOK}/chapters/${PAID}`);
  expect(owned.status()).toBe(200);
  const etag = owned.headers()["etag"];
  expect(etag).toBeTruthy();
  expect((await api.get(`/api/books/${BOOK}/chapters/${PAID}`, { headers: { "if-none-match": etag } })).status()).toBe(304);

  expect((await api.post("/api/auth/sign-out", json({}))).status()).toBe(200);

  // Same cached copy, no access: the server must refuse, not answer 304.
  expect((await api.get(`/api/books/${BOOK}/chapters/${PAID}`, { headers: { "if-none-match": etag } })).status()).toBe(401);

  // And the reader shows the paywall (gift first, for a guest) instead of the chapter.
  await page.goto(`/read/${BOOK}?page=${firstPageOf(PAID)}`);
  await expect(page.getByRole("heading", { name: `${GIFT}-тарау — сізге сыйлық` })).toBeVisible();
});
