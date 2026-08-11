import { redirect } from "next/navigation";
import { getTenantLocaleConfig } from "@/lib/tenant-config";

export const revalidate = 60;

export default async function RootPage() {
  const config = await getTenantLocaleConfig();
  redirect(`/${config.defaultLocale}`);
}
