import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { validateInquiry } from "@/lib/validation";
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from "@/lib/inquiry-captcha";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const parsed = validateInquiry(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the required fields and email address." }, { status: 400 });
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const supabase = getServerSupabase();
  if (!tenantId || !supabase) return NextResponse.json({ error: "The enquiry service is being connected. Please contact us directly." }, { status: 503 });

  let captcha;
  try {
    const { store, tenantId: captchaTenantId, siteScope } = createSupabaseCaptchaContextFromEnv();
    captcha = await verifyCaptchaSubmission({
      secret: process.env.CAPTCHA_SECRET ?? "",
      store,
      tenantId: captchaTenantId,
      siteScope,
      scope: String(body?.captchaScope ?? ""),
      token: String(body?.captchaToken ?? ""),
      answer: String(body?.captchaAnswer ?? ""),
    });
  } catch {
    return NextResponse.json({ error: "The verification service is temporarily unavailable." }, { status: 503 });
  }
  if (!captcha.ok) return NextResponse.json({ error: "The verification code is invalid or expired. Please try the new image." }, { status: 400 });

  const data = parsed.data;
  const details = [data.message, data.product && `Product: ${data.product}`, data.dimensions && `Dimensions: ${data.dimensions}`, data.material && `Material: ${data.material}`, data.quantity && `Quantity: ${data.quantity}`, data.applicationTemperature && `Temperature: ${data.applicationTemperature}`, data.attachmentUrl && `Drawing: ${data.attachmentUrl}`].filter(Boolean).join("\n\n");
  const { error } = await supabase.from("inquiries").insert({ tenant_id: tenantId, name: data.name, email: data.email, phone: data.phone || null, company: data.company || null, subject: data.subject || (data.source === "rfq" ? "Website RFQ" : "Website enquiry"), message: details });
  if (error) return NextResponse.json({ error: "Your request could not be recorded. Please try again or contact us directly." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
