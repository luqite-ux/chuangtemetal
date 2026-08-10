import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function failure(request: NextRequest, message: string) {
  const url = new URL("/admin", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const roleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

  if (!email || !password) return failure(request, "Enter your email and password.");
  if (!url || !roleKey || !tenantId) return failure(request, "The administration service is not configured.");

  const client = createClient(url, roleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: user, error } = await client
    .from("admin_users")
    .select("id,email,password_hash,is_active,tenant_id")
    .eq("email", email)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error || !user?.is_active || !(await bcrypt.compare(password, user.password_hash))) {
    return failure(request, "Incorrect email or password.");
  }

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 7 * 86_400_000);
  const session = await client.from("admin_user_sessions").insert({
    admin_user_id: user.id,
    token,
    expires_at: expires.toISOString(),
    ip: request.headers.get("x-forwarded-for") || "",
    user_agent: request.headers.get("user-agent") || "",
  });
  if (session.error) return failure(request, "Unable to create an administration session.");

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.globle-trade.com";
  const response = NextResponse.redirect(
    new URL(`/auth/handoff?token=${encodeURIComponent(token)}`, adminUrl),
    303,
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires,
    path: "/",
  };
  response.cookies.set("hq_admin_session", token, options);
  response.cookies.set("hq_tenant_id", tenantId, options);
  return response;
}
