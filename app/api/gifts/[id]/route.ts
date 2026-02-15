import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBearerToken, verifyToken } from "@/lib/auth";

async function requireAuth(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return null;
  return payload;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.giftItem.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const description =
      body.description !== undefined
        ? (body.description == null ? null : String(body.description).trim())
        : undefined;
    const price =
      body.price !== undefined
        ? (typeof body.price === "number" ? body.price : Number(body.price))
        : undefined;
    const imageUrl =
      body.imageUrl !== undefined
        ? (body.imageUrl == null ? null : String(body.imageUrl).trim())
        : undefined;

    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "Nome não pode ser vazio." },
        { status: 400 }
      );
    }
    if (
      price !== undefined &&
      (Number.isNaN(price) || price < 0)
    ) {
      return NextResponse.json(
        { error: "Preço deve ser um número não negativo." },
        { status: 400 }
      );
    }

    const item = await prisma.giftItem.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });
    return NextResponse.json(item);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json(
        { error: "Item não encontrado." },
        { status: 404 }
      );
    }
    console.error("Update gift error:", e);
    return NextResponse.json(
      { error: "Erro ao atualizar item." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.giftItem.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json(
        { error: "Item não encontrado." },
        { status: 404 }
      );
    }
    console.error("Delete gift error:", e);
    return NextResponse.json(
      { error: "Erro ao excluir item." },
      { status: 500 }
    );
  }
}
