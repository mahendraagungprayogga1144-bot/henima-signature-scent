import nodemailer from "nodemailer";

type SendEmailResult = { ok: true } | { ok: false; error: string };

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
}): Promise<SendEmailResult> {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!from) return { ok: false, error: "EMAIL_FROM/SMTP_USER missing" };

  const transport = getTransport();
  if (!transport) return { ok: false, error: "SMTP not configured" };

  try {
    await transport.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

