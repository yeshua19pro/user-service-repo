import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });
  }

  const backend = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${backend}/users/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ detail: "Error al obtener perfil" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
