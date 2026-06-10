import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBearerToken, verifyToken } from "@/lib/auth";

async function requireAuth(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return null;
  return payload;
}

/** DELETE: excluir confirmação — apenas admin */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.rsvp.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json(
        { error: "Confirmação não encontrada." },
        { status: 404 }
      );
    }
    console.error("Delete RSVP error:", e);
    return NextResponse.json(
      { error: "Erro ao excluir confirmação." },
      { status: 500 }
    );
  }
}
