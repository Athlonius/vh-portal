import { type CalcType, type MarkupType } from "./types";
import { inp, sel, lbl } from "./S1Context";

interface Props {
  calcType: CalcType; setCalcType: (v: CalcType) => void;
  markupType: MarkupType; setMarkupType: (v: MarkupType) => void;
  markupValue: number; setMarkupValue: (v: number) => void;
  gelRate: number; setGelRate: (v: number) => void;
}

const MARKUP_TYPES: MarkupType[] = ["Per Pax", "Total", "Percent"];

export default function S2Commercial(p: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Calc type toggle */}
      <div>
        <p style={{ ...lbl, marginBottom: 8 }}>Calculation Type</p>
        <div style={{ display: "flex", gap: 8 }}>
          {(["Per Pax", "Total"] as CalcType[]).map((t) => (
            <button key={t} type="button" onClick={() => p.setCalcType(t)}
              style={{
                padding: "7px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: p.calcType === t ? "none" : "1px solid #334155",
                background: p.calcType === t ? "#1E3A5F" : "transparent",
                color: p.calcType === t ? "#60A5FA" : "#64748B",
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={lbl}>Markup Type</span>
          <select value={p.markupType} onChange={(e) => p.setMarkupType(e.target.value as MarkupType)} style={sel}>
            {MARKUP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={lbl}>
            Markup Value {p.markupType === "Percent" ? "(%)" : "(USD)"}
          </span>
          <input type="number" min="0" step="0.01" value={p.markupValue}
            onChange={(e) => p.setMarkupValue(parseFloat(e.target.value) || 0)} style={inp} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={lbl}>GEL / USD Rate</span>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#64748B", pointerEvents: "none" }}>
              1$ =
            </span>
            <input type="number" min="0" step="0.01" value={p.gelRate}
              onChange={(e) => p.setGelRate(parseFloat(e.target.value) || 2.72)}
              style={{ ...inp, paddingLeft: 38 }} />
          </div>
        </label>
      </div>
    </div>
  );
}
