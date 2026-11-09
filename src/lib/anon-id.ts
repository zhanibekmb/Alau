const KEY = "alau-anon-id";

/**
 * A random id kept in this browser, so a guest's paywall views can be counted and later linked
 * to their account (plan decision E1B). Null when storage is blocked (private mode, settings).
 */
export function getAnonId(): string | null {
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}
