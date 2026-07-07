import { auth } from "@clerk/nextjs/server";
import { listVersions } from "@/lib/data/sites";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

  const { id } = await params;
  try {
    const result = await listVersions(userId, id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Nu am putut incarca versiunile" }, { status: 404 });
  }
}