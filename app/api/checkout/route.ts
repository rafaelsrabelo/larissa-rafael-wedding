import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
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
    const totalAmount = items.reduce((sum, i) => sum + i.price, 0);

    const order = await prisma.order.create({
      data: {
        mpPreferenceId: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        customerName: customerName.trim(),
        customerEmail: customerEmail?.trim() || null,
        totalAmount,
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

    const preference = await new Preference(mpClient).create({
      body: {
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          ...(item.description ? { description: item.description } : {}),
          ...(item.imageUrl ? { picture_url: item.imageUrl } : {}),
          quantity: 1,
          unit_price: item.price,
          currency_id: "BRL",
        })),
        ...(customerEmail?.trim()
          ? { payer: { email: customerEmail.trim() } }
          : {}),
        back_urls: {
          success: `${origin}/carrinho/sucesso`,
          failure: `${origin}/carrinho`,
          pending: `${origin}/carrinho/sucesso`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: `${origin}/api/webhook/mercadopago`,
        metadata: {
          customer_name: customerName.trim(),
          gift_item_ids: items.map((i) => i.id).join(","),
        },
      },
    });

    if (!preference.id || !preference.init_point) {
      throw new Error("Falha ao criar preferência de pagamento.");
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preference.id },
    });

    return NextResponse.json({ url: preference.init_point });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
