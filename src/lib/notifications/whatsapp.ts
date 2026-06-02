import type { Order } from "@/lib/types";
import { buildWhatsAppUrl, formatOrderStatusMessage } from "@/lib/whatsapp";

type SendWhatsAppResult =
  | { ok: true }
  | { ok: false; fallbackUrl: string; error: string };

function getConfig() {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const from = process.env.WHATSAPP_FROM;
  return { apiUrl, apiToken, from };
}

export async function sendWhatsAppMessage(params: {
  toPhone: string;
  message: string;
}): Promise<SendWhatsAppResult> {
  const fallbackUrl = buildWhatsAppUrl(params.toPhone, params.message);
  const { apiUrl, apiToken, from } = getConfig();

  if (!apiUrl || !apiToken) {
    return { ok: false, fallbackUrl, error: "WhatsApp API not configured" };
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        from,
        to: params.toPhone,
        message: params.message,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        fallbackUrl,
        error: `WhatsApp API failed: ${res.status} ${text}`.trim(),
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      fallbackUrl,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export async function notifyResellerStatusChange(params: {
  order: Order;
  newStatus: Order["status"];
  note?: string;
}) {
  const message = formatOrderStatusMessage(params.order, params.newStatus, params.note);
  return sendWhatsAppMessage({ toPhone: params.order.resellerPhone, message });
}

