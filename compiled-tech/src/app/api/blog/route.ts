import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, getBlogCategories } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const [posts, categories] = await Promise.all([
      getBlogPosts(category),
      getBlogCategories(),
    ]);

    return NextResponse.json({ posts, categories });
  } catch (err) {
    console.error("Blog API error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}