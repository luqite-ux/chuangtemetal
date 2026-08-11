"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buildLocalePath, DEFAULT_LOCALE } from "@/lib/i18n";

type LocaleLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
  children: ReactNode;
  href: string;
};

export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || DEFAULT_LOCALE;
  return <Link href={buildLocalePath(locale, href)} {...props}>{children}</Link>;
}
