// Pure helpers for the sign-in screen, shared by server pages and the browser.

/** Reader-facing Kazakh text for a Better Auth error. */
export function authErrorMessage(error: { code?: string; status?: number } | null | undefined): string {
  if (error?.status === 429) return "Тым көп әрекет. Бір минуттан кейін қайталаңыз.";
  switch (error?.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Email немесе құпиясөз қате.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "Бұл email тіркелген. Кіріңіз.";
    case "PASSWORD_TOO_SHORT":
      return "Құпиясөз кемінде 8 таңба болсын.";
    case "PASSWORD_TOO_LONG":
      return "Құпиясөз тым ұзын.";
    case "INVALID_EMAIL":
      return "Email дұрыс емес.";
    case "INVALID_TOKEN":
    case "TOKEN_EXPIRED":
      return "Сілтеменің мерзімі өтіп кеткен немесе ол қате. Жаңа сілтеме сұраңыз.";
    default:
      return "Бір нәрсе дұрыс болмады. Қайталап көріңіз.";
  }
}

/** Only same-site paths are allowed after sign-in, so a link cannot send readers to another site. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return "/library";
  return next;
}
