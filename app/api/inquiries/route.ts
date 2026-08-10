import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { validateInquiry } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = validateInquiry(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the required fields and email address." }, { status: 400 });
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const supabase = getServerSupabase();
  if (!tenantId || !supabase) return NextResponse.json({ error: "The enquiry service is being connected. Please contact us directly." }, { status: 503 });
  const data = parsed.data;
  const details = [data.message, data.product && `Product: ${data.product}`, data.dimensions && `Dimensions: ${data.dimensions}`, data.material && `Material: ${data.material}`, data.quantity && `Quantity: ${data.quantity}`, data.applicationTemperature && `Temperature: ${data.applicationTemperature}`].filter(Boolean).join("\n\n");
  const { error } = await supabase.from("inquiries").insert({ tenant_id: tenantId, name: data.name, email: data.email, phone: data.phone || null, company: data.company || null, subject: data.subject || (data.source === "rfq" ? "Website RFQ" : "Website enquiry"), message: details });
  if (error) return NextResponse.json({ error: "Your request could not be recorded. Please try again or contact us directly." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
