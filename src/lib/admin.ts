// Admin role from the ADMIN_EMAILS variable (docs/paywall-plan.md, D11): a comma-separated
// list of emails. No roles table and no screen to manage roles.

export function parseAdminEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.includes("@")),
  );
}

export function isAdminEmail(email: string, raw: string | undefined = process.env.ADMIN_EMAILS): boolean {
  return parseAdminEmails(raw).has(email.trim().toLowerCase());
}
