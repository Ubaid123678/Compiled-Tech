import { authorizeAdminMutation } from "@/lib/admin-session";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const folders = new Set(["blogs", "projects"]);

export async function POST(request: Request) {
  const denied = await authorizeAdminMutation(request);
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder"));
  if (!(file instanceof File) || !folders.has(folder)) {
    return NextResponse.json({ error: "A valid image and folder are required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Images must be under 10 MB" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const bucket = "admin-media";
  await admin.storage.createBucket(bucket, { public: true });
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await admin.storage.from(bucket).upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("Admin operation failed", error);
    return NextResponse.json({ error: "Could not complete this operation" }, { status: 500 });
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
