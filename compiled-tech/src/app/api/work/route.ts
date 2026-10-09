import { NextRequest, NextResponse } from "next/server";
import { getWorkProjects, getWorkCategories, getFeaturedWorkProjects } from "@/lib/work";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    if (featured) {
      const projects = await getFeaturedWorkProjects(limit);
      return NextResponse.json({ projects });
    }

    const [projects, categories] = await Promise.all([
      getWorkProjects(category),
      getWorkCategories(),
    ]);

    return NextResponse.json({ projects, categories });
  } catch (err) {
    console.error("Work API error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}