import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

type CartItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};

type CheckoutBody = {
  items: CartItem[];
  customerName: string;
  customerEmail: string;
};

export async function POST(request: Request) {
  try {
    const { items, customerName, customerEmail } =
      (await request.json()) as CheckoutBody;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio." },
        { status: 400 }
      );
    }

    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: "Nome é obrigatório." },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "brl",
      // Adicione "pix" após ativar no Dashboard do Stripe
      payment_method_types: ["card"],
      ...(customerEmail?.trim() ? { customer_email: customerEmail.trim() } : {}),
      line_items: items.map((item) => ({
        price_data: {
          currency: "brl",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
            ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
          },
        },
        quantity: 1,
      })),
      payment_method_options: {
        card: {
          installments: { enabled: true },
        },
      },
      success_url: `${origin}/carrinho/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrinho`,
      metadata: {
        customerName: customerName.trim(),
        giftItemIds: items.map((i) => i.id).join(","),
      },
    });

    // Criar Order como pending com dados do cliente
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail?.trim() || null,
        totalAmount: items.reduce((sum, i) => sum + i.price, 0),
        status: "pending",
        items: {
          create: items.map((item) => ({
            giftItemId: item.id,
            name: item.name,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
