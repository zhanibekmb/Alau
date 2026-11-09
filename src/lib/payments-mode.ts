// What "Buy" does (docs/paywall-plan.md, decision D6). There are no real payments yet.
//
//   demo      the purchase is granted at once. For your own computer, to click through the flow.
//   interest  the choice is recorded and the reader is told payment opens soon. For the public site.
//   transfer  the choice is recorded and the reader sees how to pay by bank transfer
//             (TRANSFER_* in .env); an admin then gives access on /admin/paywall.
//
// Anything other than exactly "demo" or "transfer" means interest, so a missing or mistyped
// setting on a server can never hand out free access. Only "demo" ever grants access by itself.

export type PaymentsMode = "demo" | "interest" | "transfer";

export function paymentsMode(value: string | undefined): PaymentsMode {
  return value === "demo" || value === "transfer" ? value : "interest";
}

let warned = false;

/** The mode for this server process, with one warning in the log if the setting looks wrong. */
export function currentPaymentsMode(): PaymentsMode {
  const value = process.env.PAYMENTS_MODE;
  if (!warned && value !== "demo" && value !== "interest" && value !== "transfer") {
    warned = true;
    console.warn(`[payments] PAYMENTS_MODE is ${value === undefined ? "not set" : `"${value}"`}; using "interest" (nothing is unlocked).`);
  }
  return paymentsMode(value);
}
