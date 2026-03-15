"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { type FormState } from "./types";
import { fmtDate, nightsBetween } from "./utils";

interface Props {
  form: FormState;
  sellingPrice: number;
  onClose: () => void;
}

export default function QuoteModal({ form, sellingPrice, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const nights = nightsBetween(form.dateFrom, form.dateTo);

  const hotelLines = form.hotels
    .filter((h) => h.hotelName)
    .map((h) => {
      const roomStr = h.rooms.map((r) => `${r.count}× ${r.type}`).join(", ");
      return `${fmtDate(h.checkIn)} – ${fmtDate(h.checkOut)}: ${h.hotelName} — ${roomStr} (${h.mealPlan})`;
    })
    .join("\n");

  const itineraryLines = form.tourRows
    .filter((r) => r.tourName && !r.isSameDay)
    .map((r) => `${fmtDate(r.date)}: ${r.tourName}`)
    .join("\n");

  const primaryVehicle = form.tourRows.find((r) => r.vehicleType)?.vehicleType ?? "Private vehicle";
  const primaryLang = form.tourRows.find((r) => r.driverLang)?.driverLang ?? "English";

  const entryFeeStr = form.entryFees.map((e) => e.name).join(", ") || "N/A";
  const extrasList = form.extras.map((e) => `• ${e.name}`).join("\n");
  const mealsList = form.mealInclusions.map((m) => `• ${m.name}`).join("\n");

  const hasGuide = form.tourRows.some((r) => r.guideType !== "Not Included");
  const guideStr = form.tourRows.find((r) => r.guideType !== "Not Included")?.guideType ?? "";

  const quoteText = `Request №: ${form.requestNumber}

Kindly see offer for your enquiry:

🏨 Accommodation:
${hotelLines || "(No hotels added)"}

🗺️ Short Itinerary:
${itineraryLines || "(No tours added)"}

✅ Inclusions:
• ${nights} Night${nights !== 1 ? "s" : ""} accommodation on ${form.mealPlan}
• Entrance fees: ${entryFeeStr}
• All transfers: ${primaryVehicle} with ${primaryLang} speaking driver${hasGuide ? `\n• Guide: ${guideStr}` : ""}${mealsList ? `\n${mealsList}` : ""}${extrasList ? `\n${extrasList}` : ""}

💰 Total Amount: ${sellingPrice.toFixed(0)} USD (${(sellingPrice * (form.gelRate || 2.72)).toFixed(0)} GEL)

────────────────────────────────
DEAR PARTNER, PLEASE BE INFORMED THAT THE ABOVE OFFER IS SUBJECT TO AVAILABILITY AND FINAL CONFIRMATION. PRICES MAY VARY SUBJECT TO EXCHANGE RATE FLUCTUATIONS AT TIME OF PAYMENT.

Kind regards,
${form.createdBy}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #334155" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>Generated Quote</h2>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748B" }}>Copy and share with your partner via email or WhatsApp.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4, borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Quote text */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <pre style={{
            background: "#0F172A", border: "1px solid #334155", borderRadius: 10,
            padding: "16px 18px", fontSize: 12.5, lineHeight: 1.7, color: "#E2E8F0",
            whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace",
            margin: 0,
          }}>
            {quoteText}
          </pre>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #334155", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>
            Close
          </button>
          <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", background: copied ? "#15803D" : "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy to Clipboard</>}
          </button>
        </div>
      </div>
    </div>
  );
}
