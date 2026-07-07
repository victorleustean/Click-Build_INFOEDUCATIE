import { auth } from "@clerk/nextjs/server";
import { listSites } from "@/lib/data/sites";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

  const sites = await listSites(userId);
  return NextResponse.json({ sites });
}