import { NextRequest, NextResponse } from "next/server";
import { getBlogPost } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("Blog post API error:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}