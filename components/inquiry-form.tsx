"use client";

import { useState } from "react";
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field";

type FormStatus = { type: "idle" | "pending" | "success" | "error"; message: string };

export function InquiryForm({ mode = "contact" }: { mode?: "contact" | "rfq" }) {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const drawing = formData.get("drawing");
    formData.delete("drawing");
    const data = Object.fromEntries(formData.entries());
    setStatus({ type: "pending", message: "Submitting your request…" });
    try {
      let attachmentUrl = "";
      if (drawing instanceof File && drawing.size > 0) {
        const upload = new FormData();
        upload.set("drawing", drawing);
        const uploadResponse = await fetch("/api/rfq-attachments", { method: "POST", body: upload });
        const uploadBody = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadBody.error || "The drawing could not be uploaded.");
        attachmentUrl = uploadBody.url;
      }
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: mode, ...(attachmentUrl ? { attachmentUrl } : {}) }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to submit your request.");
      form.reset();
      setCaptchaRefreshKey((key) => key + 1);
      setStatus({ type: "success", message: "Thank you. Your request has been recorded." });
    } catch (error) {
      setCaptchaRefreshKey((key) => key + 1);
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to submit your request." });
    }
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label><span>Name *</span><input name="name" required minLength={2} autoComplete="name" /></label>
        <label><span>Business email *</span><input name="email" type="email" required autoComplete="email" /></label>
        <label><span>Company</span><input name="company" autoComplete="organization" /></label>
        <label><span>Phone</span><input name="phone" autoComplete="tel" /></label>
        {mode === "rfq" && <>
          <label><span>Target product</span><select name="product" defaultValue=""><option value="">Select a product</option><option>Heat-Resistant Steel Charge Tray</option><option>Heat-Resistant Steel Charge Rack</option></select></label>
          <label><span>Dimensions</span><input name="dimensions" placeholder="Drawing reference or dimensions" /></label>
          <label><span>Material</span><input name="material" placeholder="If already specified" /></label>
          <label><span>Quantity</span><input name="quantity" placeholder="MOQ starts from 2 pieces" /></label>
          <label><span>Application temperature</span><input name="applicationTemperature" placeholder="Operating range" /></label>
          <label className="form-wide"><span>Drawing file</span><input name="drawing" type="file" accept=".pdf,.dwg,.dxf,.step,.stp,.zip" /></label>
        </>}
        <label className="form-wide"><span>Subject</span><input name="subject" placeholder={mode === "rfq" ? "Project or drawing reference" : "How can we help?"} /></label>
        <label className="form-wide"><span>Project details *</span><textarea name="message" required minLength={8} rows={6} placeholder="Tell us about the furnace, load, working temperature and technical requirements." /></label>
      </div>
      <InquiryCaptchaField refreshKey={captchaRefreshKey} />
      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={status.type === "pending"}>{status.type === "pending" ? "Submitting…" : mode === "rfq" ? "Submit RFQ" : "Send enquiry"}</button>
        <p className={`form-status ${status.type}`} role="status">{status.message}</p>
      </div>
    </form>
  );
}
