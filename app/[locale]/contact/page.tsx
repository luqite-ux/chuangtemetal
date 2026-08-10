import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/page-hero";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact", description: "Contact ChuangTe Metal to discuss custom heat-resistant steel castings.", alternates: { canonical: "/en/contact" } };
export default function ContactPage() { return <><PageHero eyebrow="Contact" title="Start with the operating condition." description="Tell us what the fixture needs to carry, where it works and what your drawing requires." /><section className="section"><div className="shell contact-layout"><div className="contact-cards"><div><Phone /><span>Phone</span><a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>{SITE_CONFIG.phone}</a></div><div><Mail /><span>Email</span><a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></div><div><MapPin /><span>Address</span><p>{SITE_CONFIG.address}</p></div></div><InquiryForm /></div></section></>; }
