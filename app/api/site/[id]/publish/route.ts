import { auth } from "@clerk/nextjs/server";
import { publishSite } from "@/lib/data/sites";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

  const { id } = await params;
  try {
    const subdomain = await publishSite(userId, id);
    return NextResponse.json({ subdomain });
  } catch (e) {
    console.error("Publish failed:", e);
    return NextResponse.json({ error: "Publicarea a esuat" }, { status: 500 });
  }
}