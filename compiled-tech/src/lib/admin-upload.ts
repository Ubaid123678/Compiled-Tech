export async function uploadAdminImage(file: File, folder: "blogs" | "projects") {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const result = await response.json();

  if (!response.ok) throw new Error(result.error || "Image upload failed");
  return result.url as string;
}