// Outgoing email (password reset). Uses Brevo's free plan (300 emails a day) through its HTTP API:
// no SMTP library, no domain needed. Set BREVO_API_KEY and MAIL_FROM in .env (see .env.example).
//
// Without a key, on your own computer the message is printed to the terminal instead, so the
// reset flow can be tried locally. On a server without a key the email is not sent and an error
// is logged.

export type Mail = { to: string; subject: string; text: string; html: string };

export function mailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.MAIL_FROM);
}

export async function sendMail(mail: Mail): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!key || !from) {
    if (process.env.NODE_ENV === "production") {
      console.error("[mail] BREVO_API_KEY or MAIL_FROM is not set: email was not sent.");
    } else {
      console.info(`[mail] (not sent, no BREVO_API_KEY) to ${mail.to}\n${mail.subject}\n${mail.text}`);
    }
    return;
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Alau", email: from },
      to: [{ email: mail.to }],
      subject: mail.subject,
      textContent: mail.text,
      htmlContent: mail.html,
    }),
  });
  if (!response.ok) {
    // The reader still sees "check your inbox"; the log says why nothing arrived.
    console.error(`[mail] Brevo refused the email: ${response.status} ${await response.text().catch(() => "")}`);
  }
}

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** The reset email in Kazakh. The link is valid for one hour (auth.ts). */
export function passwordResetMail(to: string, url: string): Mail {
  const subject = "Alau: құпиясөзді қалпына келтіру";
  const text = [
    "Сәлеметсіз бе!",
    "",
    "Alau аккаунтыңыздың құпиясөзін өзгерту үшін мына сілтемені ашыңыз (бір сағат жарамды):",
    url,
    "",
    "Егер сіз бұны сұрамасаңыз, хатты елемеңіз: құпиясөз өзгермейді.",
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#111">
<p>Сәлеметсіз бе!</p>
<p>Alau аккаунтыңыздың құпиясөзін өзгерту үшін батырманы басыңыз. Сілтеме бір сағат жарамды.</p>
<p><a href="${escape(url)}" style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:bold">Жаңа құпиясөз қою</a></p>
<p style="color:#6e6e73;font-size:14px">Егер сіз бұны сұрамасаңыз, хатты елемеңіз: құпиясөз өзгермейді.</p>
</div>`;
  return { to, subject, text, html };
}

/** "Confirm your email" in Kazakh. The link is valid for 24 hours (auth.ts). */
export function verificationMail(to: string, url: string): Mail {
  const subject = "Alau: email-ыңызды растаңыз";
  const text = [
    "Сәлеметсіз бе!",
    "",
    "Alau-да аккаунт ашқаныңыз үшін рақмет. Тіркелуді аяқтау үшін мына сілтемені ашыңыз (24 сағат жарамды):",
    url,
    "",
    "Егер сіз тіркелмесеңіз, хатты елемеңіз.",
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#111">
<p>Сәлеметсіз бе!</p>
<p>Alau-да аккаунт ашқаныңыз үшін рақмет. Тіркелуді аяқтау үшін батырманы басыңыз. Сілтеме 24 сағат жарамды.</p>
<p><a href="${escape(url)}" style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:bold">Email-ды растау</a></p>
<p style="color:#6e6e73;font-size:14px">Егер сіз тіркелмесеңіз, хатты елемеңіз.</p>
</div>`;
  return { to, subject, text, html };
}
