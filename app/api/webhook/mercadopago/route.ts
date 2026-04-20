import { NextResponse } from "next/server";
import crypto from "crypto";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/db";

function mapStatus(mpStatus: string | undefined): string {
  switch (mpStatus) {
    case "approved":
      return "paid";
    case "pending":
    case "in_process":
    case "authorized":
      return "pending";
    case "rejected":
    case "cancelled":
    case "refunded":
    case "charged_back":
      return "failed";
    default:
      return "pending";
  }
}

function verifySignature(request: Request, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => {
      const [k, v] = kv.split("=").map((s) => s.trim());
      return [k, v];
    })
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(v1, "hex")
    );
  } catch {
    return false;
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
    const queryId = url.searchParams.get("id") ?? url.searchParams.get("data.id");

    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      type?: string;
      data?: { id?: string };
    };

    const eventType = body.type ?? topic;
    const dataId = body.data?.id ?? queryId;

    if (eventType !== "payment" || !dataId) {
      return NextResponse.json({ received: true, ignored: true });
    }

    if (!verifySignature(request, String(dataId))) {
      console.error("Webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const payment = await new Payment(mpClient).get({ id: String(dataId) });

    const orderId = payment.external_reference;
    if (!orderId) {
      console.error("Webhook: payment without external_reference", payment.id);
      return NextResponse.json({ received: true });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: mapStatus(payment.status),
        mpPaymentId: payment.id ? String(payment.id) : null,
        ...(payment.payer?.email
          ? { customerEmail: payment.payer.email }
          : {}),
      },
    });

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook MP error:", e);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
