import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBearerToken, verifyToken } from "@/lib/auth";

export async function GET() {
  const items = await prisma.giftItem.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description =
      body.description != null ? String(body.description).trim() : null;
    const price = typeof body.price === "number" ? body.price : Number(body.price);
    const imageUrl =
      body.imageUrl != null ? String(body.imageUrl).trim() || null : null;

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório." },
        { status: 400 }
      );
    }
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Preço deve ser um número não negativo." },
        { status: 400 }
      );
    }

    const item = await prisma.giftItem.create({
      data: { name, description, price, imageUrl },
    });
    return NextResponse.json(item);
  } catch (e) {
    console.error("Create gift error:", e);
    return NextResponse.json(
      { error: "Erro ao criar item." },
      { status: 500 }
    );
  }
}
