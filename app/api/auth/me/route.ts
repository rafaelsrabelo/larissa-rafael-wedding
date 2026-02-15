import { NextResponse } from "next/server";
import { getBearerToken, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });
  }

  return NextResponse.json({
    user: { id: payload.sub, email: payload.email },
  });
}
