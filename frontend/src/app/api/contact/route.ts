import { NextResponse } from "next/server";
import { submitContact } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 });
  }
  const ok = await submitContact({
    name: String(body.name),
    email: String(body.email),
    company: String(body.company ?? ""),
    message: String(body.message),
  });
  if (!ok) {
    return NextResponse.json(
      { error: "Falha ao enviar mensagem" },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
