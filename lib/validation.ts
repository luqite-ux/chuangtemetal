import { z } from "zod";

const inquirySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.email(),
    company: z.string().trim().max(160).optional().default(""),
    phone: z.string().trim().max(80).optional().default(""),
    subject: z.string().trim().max(180).optional().default(""),
    message: z.string().trim().min(8).max(5000),
    source: z.enum(["contact", "rfq"]),
    product: z.string().trim().max(180).optional().default(""),
    dimensions: z.string().trim().max(300).optional().default(""),
    material: z.string().trim().max(300).optional().default(""),
    quantity: z.string().trim().max(120).optional().default(""),
    applicationTemperature: z.string().trim().max(120).optional().default(""),
    attachmentUrl: z.url().optional(),
  })
  .strict();

export type InquiryInput = z.input<typeof inquirySchema>;
export type ValidInquiry = z.output<typeof inquirySchema>;

export function validateInquiry(value: unknown) {
  return inquirySchema.safeParse(value);
}

const ALLOWED_DRAWING_EXTENSIONS = new Set(["pdf", "dwg", "dxf", "step", "stp", "zip"]);
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;

export function validateAttachmentMeta(value: { name: string; size: number }) {
  const extension = value.name.split(".").pop()?.toLocaleLowerCase("en") ?? "";
  if (!ALLOWED_DRAWING_EXTENSIONS.has(extension)) {
    return { success: false as const, error: "Unsupported drawing file type." };
  }
  if (!Number.isFinite(value.size) || value.size <= 0 || value.size > MAX_ATTACHMENT_BYTES) {
    return { success: false as const, error: "Drawing files must be 20 MB or smaller." };
  }
  return { success: true as const, data: { extension, maxBytes: MAX_ATTACHMENT_BYTES } };
}
