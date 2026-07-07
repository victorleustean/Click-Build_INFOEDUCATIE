import { auth } from "@clerk/nextjs/server";
import { getSite } from "@/lib/data/sites";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

  const { id } = await params;  
  const site = await getSite(userId, id);

  if (!site) return NextResponse.json({ error: "Site negasit" }, { status: 404 });

  return NextResponse.json({ site });
}