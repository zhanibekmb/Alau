// What "Buy" does (docs/paywall-plan.md, decision D6). There are no real payments yet.
//
//   demo      the purchase is granted at once. For your own computer, to click through the flow.
//   interest  the choice is recorded and the reader is told payment opens soon. For the public site.
//
// Anything other than exactly "demo" means interest, so a missing or mistyped setting on a
// server can never hand out free access.

export type PaymentsMode = "demo" | "interest";

export function paymentsMode(value: string | undefined): PaymentsMode {
  return value === "demo" ? "demo" : "interest";
}

let warned = false;

/** The mode for this server process, with one warning in the log if the setting looks wrong. */
export function currentPaymentsMode(): PaymentsMode {
  const value = process.env.PAYMENTS_MODE;
  if (!warned && value !== "demo" && value !== "interest") {
    warned = true;
    console.warn(`[payments] PAYMENTS_MODE is ${value === undefined ? "not set" : `"${value}"`}; using "interest" (nothing is unlocked).`);
  }
  return paymentsMode(value);
}
