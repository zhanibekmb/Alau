// Bank transfer details for PAYMENTS_MODE=transfer, read from .env so a phone number never lands
// in git. The reader sees them only after choosing a tariff while signed in.
//
//   TRANSFER_KASPI   where to send money: a phone number or card number, e.g. "+7 777 123 45 67"
//   TRANSFER_NAME    the recipient's name as Kaspi shows it, e.g. "Жанибек М."
//   TRANSFER_CONTACT where to send the receipt: a link (https://t.me/…, https://wa.me/…) or an email

export type TransferDetails = {
  account: string;
  recipient: string;
  /** Link to open: t.me, wa.me, or mailto: built from an email. */
  contactHref: string;
  /** What the reader sees for the contact. */
  contactLabel: string;
};

export function transferDetails(env: Record<string, string | undefined> = process.env): TransferDetails | null {
  const account = env.TRANSFER_KASPI?.trim();
  const recipient = env.TRANSFER_NAME?.trim();
  const contact = env.TRANSFER_CONTACT?.trim();
  if (!account || !recipient || !contact) return null;

  if (/^https:\/\//.test(contact)) {
    const label = contact.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");
    return { account, recipient, contactHref: contact, contactLabel: label };
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return { account, recipient, contactHref: `mailto:${contact}`, contactLabel: contact };
  }
  return null;
}
