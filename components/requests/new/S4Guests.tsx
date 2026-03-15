"use client";

import { inp, lbl } from "./S1Context";

interface Props {
  adults: number; setAdults: (v: number) => void;
  numChildren: number; setChildren: (v: number) => void;
  childAges: (number | "")[]; setChildAges: (v: (number | "")[]) => void;
  cwb: number; setCwb: (v: number) => void;
  cnb: number; setCnb: (v: number) => void;
}

export default function S4Guests(p: Props) {
  const cwbCnbMismatch = p.numChildren > 0 && (p.cwb + p.cnb) !== p.numChildren;
  const agesIncomplete = p.numChildren > 0 && p.childAges.some((a) => a === "");

  const handleChildrenChange = (val: number) => {
    const n = Math.max(0, val);
    p.setChildren(n);
    const newAges: (number | "")[] = Array.from({ length: n }, (_, i) => p.childAges[i] ?? "");
    p.setChildAges(newAges);
  };

  const setAge = (i: number, v: string) => {
    const ages = [...p.childAges];
    ages[i] = v === "" ? "" : Math.min(17, Math.max(0, parseInt(v) || 0));
    p.setChildAges(ages);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Adults", val: p.adults, set: (n: number) => p.setAdults(Math.max(1, n)), min: 1 },
          { label: "Children", val: p.numChildren, set: handleChildrenChange, min: 0 },
          { label: "CWB (Child With Bed)", val: p.cwb, set: (n: number) => p.setCwb(Math.max(0, n)), min: 0 },
          { label: "CNB (Child No Bed)", val: p.cnb, set: (n: number) => p.setCnb(Math.max(0, n)), min: 0 },
        ].map(({ label, val, set, min }) => (
          <label key={label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={lbl}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <button type="button" onClick={() => set(val - 1)} disabled={val <= min}
                style={spinBtn(val <= min)}>−</button>
              <input type="number" value={val} min={min}
                onChange={(e) => set(parseInt(e.target.value) || 0)}
                style={{ ...inp, textAlign: "center", borderRadius: 0, width: "100%", borderLeft: "none", borderRight: "none" }} />
              <button type="button" onClick={() => set(val + 1)} style={spinBtn(false)}>+</button>
            </div>
          </label>
        ))}
      </div>

      {/* Child ages */}
      {p.numChildren > 0 && (
        <div>
          <p style={{ ...lbl, marginBottom: 10 }}>Child Ages</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {p.childAges.map((age, i) => (
              <label key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: "#64748B" }}>Child {i + 1}</span>
                <input type="number" min="0" max="17" value={age}
                  onChange={(e) => setAge(i, e.target.value)} placeholder="Age"
                  style={{ ...inp, width: 70, textAlign: "center", borderColor: age === "" ? "#EF4444" : "#334155" }} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Validations */}
      {cwbCnbMismatch && (
        <div style={errBox}>
          ⚠ CWB + CNB ({p.cwb + p.cnb}) does not equal total children ({p.numChildren}). Please adjust.
        </div>
      )}
      {agesIncomplete && !cwbCnbMismatch && (
        <div style={{ ...errBox, background: "#3B1A0A", borderColor: "#92400E", color: "#FB923C" }}>
          ⚠ Please fill in all child ages before proceeding.
        </div>
      )}

      {/* Summary */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Total Pax", value: p.adults + p.numChildren, color: "#60A5FA" },
          { label: "Adults", value: p.adults, color: "#4ADE80" },
          ...(p.numChildren > 0 ? [
            { label: "Children", value: p.numChildren, color: "#FCD34D" },
            { label: "CWB", value: p.cwb, color: "#C084FC" },
            { label: "CNB", value: p.cnb, color: "#94A3B8" },
          ] : []),
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: "6px 14px", background: "#0F172A", borderRadius: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>{label}:</span>
            <span style={{ fontSize: 15, fontWeight: 700, color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const spinBtn = (disabled: boolean): React.CSSProperties => ({
  width: 32, flexShrink: 0, height: 36, background: disabled ? "#0F172A" : "#1E293B",
  border: "1px solid #334155", color: disabled ? "#334155" : "#94A3B8",
  fontSize: 16, cursor: disabled ? "default" : "pointer",
  borderRadius: disabled ? 0 : 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  paddingBottom: 2,
});
const errBox: React.CSSProperties = {
  padding: "10px 14px", background: "#3B0F0F", border: "1px solid #7F1D1D",
  borderRadius: 8, color: "#F87171", fontSize: 12, fontWeight: 500,
};
