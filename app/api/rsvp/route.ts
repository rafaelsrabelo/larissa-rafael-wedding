import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBearerToken, verifyToken } from "@/lib/auth";

const MAX_ADULTS = 4;
const MAX_CHILDREN = 4;

/** GET: lista de confirmações — apenas admin */
export async function GET(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const list = await prisma.rsvp.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error("List RSVP error:", e);
    return NextResponse.json(
      { error: "Erro ao listar confirmações." },
      { status: 500 }
    );
  }
}

/** POST: confirmar presença — público */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const willAttend = body.willAttend === true || body.willAttend === "sim";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message =
      body.message != null ? String(body.message).trim() || null : null;
    const acceptedTerms = body.acceptedTerms === true;

    const extraAdultNames: string[] = Array.isArray(body.extraAdultNames)
      ? body.extraAdultNames
          .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
          .filter(Boolean)
      : [];
    const childNames: string[] = Array.isArray(body.childNames)
      ? body.childNames
          .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
          .filter(Boolean)
      : [];

    if (!fullName) {
      return NextResponse.json(
        { error: "Nome completo é obrigatório." },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 }
      );
    }
    if (!phone) {
      return NextResponse.json(
        { error: "Telefone é obrigatório." },
        { status: 400 }
      );
    }
    if (!acceptedTerms) {
      return NextResponse.json(
        { error: "É necessário aceitar os termos e a política de privacidade." },
        { status: 400 }
      );
    }

    const totalAdults = 1 + extraAdultNames.length;
    if (totalAdults > MAX_ADULTS) {
      return NextResponse.json(
        { error: `O limite de adultos é ${MAX_ADULTS}.` },
        { status: 400 }
      );
    }
    if (childNames.length > MAX_CHILDREN) {
      return NextResponse.json(
        { error: `O limite de crianças é ${MAX_CHILDREN}.` },
        { status: 400 }
      );
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        fullName,
        willAttend,
        extraAdultNames,
        childNames,
        email,
        phone,
        message,
        acceptedTerms,
      },
    });
    return NextResponse.json(rsvp);
  } catch (e) {
    console.error("Create RSVP error:", e);
    return NextResponse.json(
      { error: "Erro ao confirmar presença." },
      { status: 500 }
    );
  }
}
