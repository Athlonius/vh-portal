import { FileText, BookOpen, Check } from "lucide-react";

interface CalcResult {
  accomsUsd: number; toursUsd: number; inclUsd: number;
  netCost: number; markupUsd: number; sellingPrice: number;
  margin: number; perPax: number;
}

interface Props {
  calc: CalcResult;
  onGenerateQuote: () => void;
  onSaveDraft: () => void;
  onConfirmBooking: () => void;
}

export default function FormFooter(p: Props) {
  const { calc } = p;
  const f = (n: number) => "$" + n.toFixed(2);
  const pct = (n: number) => n.toFixed(1) + "%";

  return (
    <div style={{
      position: "sticky", bottom: 0, zIndex: 50,
      background: "#0F172A", borderTop: "2px solid #334155",
      padding: "12px 32px",
      display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
    }}>
      {/* Breakdowns */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", flex: 1 }}>
        {[
          { label: "Hotels", value: f(calc.accomsUsd), color: "#60A5FA" },
          { label: "Tours", value: f(calc.toursUsd), color: "#FCD34D" },
          { label: "Inclusions", value: f(calc.inclUsd), color: "#C084FC" },
          { label: "Net Cost", value: f(calc.netCost), color: "#F8FAFC", bold: true },
          { label: "Markup", value: f(calc.markupUsd), color: "#FB923C" },
          { label: "Selling Price", value: f(calc.sellingPrice), color: "#4ADE80", bold: true },
          { label: "Margin", value: pct(calc.margin), color: "#34D399" },
          { label: "Per Pax", value: f(calc.perPax), color: "#A78BFA", bold: true },
        ].map(({ label, value, color, bold }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 15, fontWeight: bold ? 800 : 600, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button type="button" onClick={p.onSaveDraft}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 16px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <BookOpen size={14} /> Save Draft
        </button>
        <button type="button" onClick={p.onGenerateQuote}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 16px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <FileText size={14} /> Generate Quote
        </button>
        <button type="button" onClick={p.onConfirmBooking}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 16px", borderRadius: 8, border: "none", background: "#15803D", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Check size={14} /> Confirm Booking
        </button>
      </div>
    </div>
  );
}
