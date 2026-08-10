import { NextResponse } from "next/server";
import { getServerSupabase, tenantId } from "@/lib/supabase";
import { validateAttachmentMeta } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("drawing");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a drawing file first." }, { status: 400 });
  const validation = validateAttachmentMeta({ name: file.name, size: file.size });
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });
  const supabase = getServerSupabase();
  if (!supabase || !tenantId) return NextResponse.json({ error: "Secure drawing storage is being connected." }, { status: 503 });
  const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(-120);
  const key = `${tenantId}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from("inquiry-attachments").upload(key, await file.arrayBuffer(), {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return NextResponse.json({ error: "The drawing could not be stored. Please send the enquiry without it or contact us directly." }, { status: 500 });
  const { data } = await supabase.storage.from("inquiry-attachments").createSignedUrl(key, 60 * 60 * 24 * 30);
  return NextResponse.json({ url: data?.signedUrl || key });
}
