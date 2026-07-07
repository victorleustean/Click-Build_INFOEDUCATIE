import { auth } from "@clerk/nextjs/server";
import { rollbackTo } from "@/lib/data/sites";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

  const { id } = await params;
  const { version } = await req.json();
  if (version === undefined || version === null)
    return NextResponse.json({ error: "version necesar" }, { status: 400 });

  try {
    const code = await rollbackTo(userId, id, version);
    return NextResponse.json({ code });
  } catch (e) {
    console.error("Rollback failed:", e);
    return NextResponse.json({ error: "Rollback esuat" }, { status: 500 });
  }
}