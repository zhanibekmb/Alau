// Where a guest pressed "sign up", so /admin/paywall can show which moment brings accounts
// (design "Регистрация как награда, а не стена", step 4). Few values on purpose: there are
// only a handful of readers yet; split "other" once strangers arrive.
//
//   click ─▶ sessionStorage + ?from= in the return address
//   return page (Toaster) ─▶ ?from= back into sessionStorage, removed from the address
//   first sync after sign-in ─▶ signupSource ─▶ paywall_events.source of this user's signup row

export const SIGNUP_SOURCES = ["chapter_end", "gift_paywall", "other"] as const;
export type SignupSource = (typeof SIGNUP_SOURCES)[number];

const KEY = "alau-signup-source";
export const SOURCE_PARAM = "from";

export function parseSignupSource(value: unknown): SignupSource | null {
  return typeof value === "string" && (SIGNUP_SOURCES as readonly string[]).includes(value) ? (value as SignupSource) : null;
}

/** Adds ?from=<source> to a same-site path, keeping its own query and hash. */
export function withSource(path: string, source: SignupSource): string {
  const [beforeHash, hash = ""] = path.split("#");
  const joiner = beforeHash.includes("?") ? "&" : "?";
  return `${beforeHash}${joiner}${SOURCE_PARAM}=${source}${hash ? `#${hash}` : ""}`;
}

export function rememberSignupSource(source: SignupSource): void {
  try {
    window.sessionStorage.setItem(KEY, source);
  } catch {
    // Storage blocked: the sign-up is counted as unknown.
  }
}

export function readSignupSource(): SignupSource | null {
  try {
    return parseSignupSource(window.sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function clearSignupSource(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
