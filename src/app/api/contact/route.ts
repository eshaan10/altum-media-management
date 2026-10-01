import { Resend } from "resend";
import { renderContactEmail } from "@/lib/contact-email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't retry.
  if (clean(body.company_website, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const business = clean(body.business, 200);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return Response.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return Response.json(
      { error: "The form is temporarily unavailable. Please email us directly." },
      { status: 500 },
    );
  }

  const to = (process.env.CONTACT_TO_EMAIL ?? "dmclaughlin@altummediamanagement.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL ?? "Altum Media Management <onboarding@resend.dev>";

  const { subject, html, text } = renderContactEmail({ name, email, business, message });

  const { data, error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Contact form: Resend error", error);
    return Response.json(
      { error: "We couldn't send your message. Please try again or email us directly." },
      { status: 502 },
    );
  }

  console.info("Contact form: sent", data?.id);
  return Response.json({ ok: true });
}
