import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await prisma.order.update({
        where: { stripeSessionId: session.id },
        data: {
          status: "paid",
          stripePaymentId: session.payment_intent as string | null,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
        },
      });
    } catch (e) {
      console.error("Webhook: error updating order:", e);
    }
  }

  return NextResponse.json({ received: true });
}
