import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBearerToken, verifyToken } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getBearerToken(request);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 }
      );
    }
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Apenas pedidos pendentes podem ser excluídos." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 }
      );
    }
    console.error("Delete order error:", e);
    return NextResponse.json(
      { error: "Erro ao excluir pedido." },
      { status: 500 }
    );
  }
}
