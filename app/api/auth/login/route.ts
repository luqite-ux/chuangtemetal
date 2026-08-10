import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/server";

const SESSION_DAYS = 7;

function loginError(request: NextRequest, message: string) {
  const target = new URL("/admin/login", request.url);
  target.searchParams.set("error", message);
  return NextResponse.redirect(target, 303);
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const email = String(form?.get("email") || "").trim().toLowerCase();
  const password = String(form?.get("password") || "");
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim();

  if (!email || !password) return loginError(request, "Enter your email and password.");
  if (!tenantId || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return loginError(request, "The administration service is not configured.");
  }

  const supabase = createAdminClient();
  const { data: user, error } = await supabase
    .from("admin_users")
    .select("id,email,password_hash,is_active,tenant_id")
    .eq("email", email)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error || !user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
    return loginError(request, "Incorrect email or password.");
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const { error: sessionError } = await supabase.from("admin_user_sessions").insert({
    admin_user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "",
    user_agent: request.headers.get("user-agent") || "",
  });
  if (sessionError) return loginError(request, "Unable to create an administration session.");

  await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires: expiresAt,
    path: "/",
  };
  response.cookies.set(SESSION_COOKIE, token, options);
  response.cookies.set("hq_tenant_id", tenantId, options);
  return response;
}
