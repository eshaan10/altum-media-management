/**
 * Notification email for contact-form submissions (sent to Dom via Resend).
 * Utilitarian on purpose: one click to reply, the person and their message first,
 * metadata after. Table layout + inline styles only, since email clients strip
 * <style> blocks and classes and many don't support flexbox or pre-wrap.
 */

export type Inquiry = { name: string; email: string; business: string; message: string };

const NAVY = "#0B1B33";
const STEEL = "#1E5A8C";
const MUTED = "#5B7291";
const RULE = "#E3EAF1";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Escaped, with line breaks kept (as <br>, since pre-wrap isn't reliable in email). */
const multiline = (s: string) => escapeHtml(s).replace(/\r?\n/g, "<br>");

export function renderContactEmail({ name, email, business, message }: Inquiry) {
  const subject = `New inquiry from ${name}${business ? ` (${business})` : ""}`;
  const firstName = name.split(/\s+/)[0];
  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    `Re: Your inquiry to Altum Media Management`,
  )}`;
  // Inbox preview line: the start of their message.
  const preheader = message.replace(/\s+/g, " ").slice(0, 110);

  const metaRow = (label: string, value: string) => `
              <tr>
                <td style="padding:6px 16px 6px 0;width:84px;vertical-align:top;font:600 11px/18px ${FONT};letter-spacing:0.08em;text-transform:uppercase;color:${MUTED}">${label}</td>
                <td style="padding:6px 0;vertical-align:top;font:400 14px/20px ${FONT};color:${NAVY}">${value}</td>
              </tr>`;

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#ffffff">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#ffffff">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff">
    <tr>
      <td align="center" style="padding:32px 20px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">

          <!-- LOGO SLOT: a logo could go here later, above the reply button, e.g.
               <tr><td style="padding:0 0 28px"><img src="https://<site>/brand/altum-wordmark.png" width="116" height="22" alt="Altum"></td></tr> -->

          <!-- 1. One-click reply (opens a new email to the submitter). -->
          <tr>
            <td style="padding:0 0 32px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${STEEL}" style="border-radius:7px">
                    <a href="${escapeHtml(mailto)}" style="display:inline-block;padding:12px 22px;font:600 15px/20px ${FONT};color:#ffffff;text-decoration:none;border-radius:7px">Reply to ${escapeHtml(firstName)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Who, and what they said: the main content. -->
          <tr>
            <td style="padding:0 0 6px;font:600 11px/16px ${FONT};letter-spacing:0.1em;text-transform:uppercase;color:${STEEL}">New inquiry</td>
          </tr>
          <tr>
            <td style="padding:0 0 18px;font:700 24px/30px ${FONT};letter-spacing:-0.01em;color:${NAVY}">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:0 0 32px;font:400 16px/26px ${FONT};color:${NAVY}">${multiline(message)}</td>
          </tr>

          <!-- 3. Secondary details. -->
          <tr>
            <td style="border-top:1px solid ${RULE};padding:18px 0 0">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">${metaRow(
                "Email",
                `<a href="${escapeHtml(mailto)}" style="color:${STEEL};text-decoration:underline">${escapeHtml(email)}</a>`,
              )}${metaRow("Business", business ? escapeHtml(business) : `<span style="color:${MUTED}">Not given</span>`)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 0 0;font:400 12px/18px ${FONT};color:${MUTED}">
              Sent from the contact form on altummediamanagement.com. Replying to this email also reaches ${escapeHtml(firstName)}.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Reply to ${name}: ${email}`,
    "",
    `NEW INQUIRY — ${name}`,
    "",
    message,
    "",
    "—",
    `Email:    ${email}`,
    `Business: ${business || "Not given"}`,
  ].join("\n");

  return { subject, html, text };
}
