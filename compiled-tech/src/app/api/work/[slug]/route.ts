import { NextRequest, NextResponse } from "next/server";
import { getWorkProject } from "@/lib/work";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await getWorkProject(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (err) {
    console.error("Work project API error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}