import { describe, expect, it } from "vitest";
import { validateAttachmentMeta, validateInquiry } from "@/lib/validation";

describe("inquiry validation", () => {
  it("accepts a complete contact inquiry", () => {
    const result = validateInquiry({
      name: "Alex Smith",
      email: "alex@example.com",
      company: "Example Industries",
      phone: "+1 555 0100",
      subject: "Charge tray request",
      message: "Please review the attached operating conditions.",
      source: "contact",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email and tenant injection", () => {
    const result = validateInquiry({
      name: "Alex",
      email: "not-an-email",
      message: "Need a tray",
      source: "contact",
      tenant_id: "attacker-controlled",
    });
    expect(result.success).toBe(false);
  });
});

describe("RFQ attachment validation", () => {
  it("accepts supported engineering drawing extensions", () => {
    for (const name of ["drawing.pdf", "part.dwg", "part.dxf", "model.step", "model.stp", "files.zip"]) {
      expect(validateAttachmentMeta({ name, size: 1024 }).success).toBe(true);
    }
  });

  it("rejects executables and oversized files", () => {
    expect(validateAttachmentMeta({ name: "payload.exe", size: 1024 }).success).toBe(false);
    expect(validateAttachmentMeta({ name: "drawing.pdf", size: 21 * 1024 * 1024 }).success).toBe(false);
  });
});
