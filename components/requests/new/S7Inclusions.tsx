"use client";

import { Trash2 } from "lucide-react";
import { type InclusionRow } from "./types";
import { lbl, sel } from "./S1Context";
import { uid } from "./utils";
import { mockExtras } from "../../extras/mockExtras";
import { mockMeals } from "../../meals/mockMeals";

interface Props {
  entryFees: InclusionRow[]; setEntryFees: (v: InclusionRow[]) => void;
  mealInclusions: InclusionRow[]; setMealInclusions: (v: InclusionRow[]) => void;
  extras: InclusionRow[]; setExtras: (v: InclusionRow[]) => void;
  adults: number;
  nights: number;
  gelRate: number;
}

const feeItems = mockExtras.filter((e) => e.status === "Active" && e.serviceType === "Entrance Fee");
const activityItems = mockExtras.filter((e) => e.status === "Active" && e.serviceType !== "Entrance Fee");

export default function S7Inclusions(p: Props) {
  const addFee = (id: number) => {
    const item = mockExtras.find((e) => e.id === id);
    if (!item) return;
    const qty = item.calculateType === "Per Person" ? p.adults
      : item.calculateType === "Per Person Per Day" ? p.adults * p.nights : 1;
    const totalGel = qty * item.price;
    const label = item.calculateType === "Per Person" ? `${p.adults} pax × ₾${item.price}`
      : item.calculateType === "Per Person Per Day" ? `${p.adults} pax × ${p.nights} days × ₾${item.price}`
      : `₾${item.price}`;
    p.setEntryFees([...p.entryFees, { id: uid(), name: item.serviceName, calcLabel: label, totalGel }]);
  };

  const addMeal = (id: number) => {
    const item = mockMeals.find((m) => m.id === id);
    if (!item) return;
    const totalGel = p.adults * p.nights * item.pricePerPersonGel;
    const label = `${p.nights} days × ${p.adults} pax × ₾${item.pricePerPersonGel}`;
    p.setMealInclusions([...p.mealInclusions, { id: uid(), name: item.mealName, calcLabel: label, totalGel }]);
  };

  const addExtra = (id: number) => {
    const item = mockExtras.find((e) => e.id === id);
    if (!item) return;
    const qty = item.calculateType === "Per Person" ? p.adults
      : item.calculateType === "Per Person Per Day" ? p.adults * p.nights : 1;
    const totalGel = qty * item.price;
    const label = `${qty} × ₾${item.price}`;
    p.setExtras([...p.extras, { id: uid(), name: item.serviceName, calcLabel: label, totalGel }]);
  };

  const grandTotal = [...p.entryFees, ...p.mealInclusions, ...p.extras]
    .reduce((s, r) => s + r.totalGel, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <InclusionBlock
        title="Entry Fees"
        color="#FCD34D"
        rows={p.entryFees}
        onRemove={(id) => p.setEntryFees(p.entryFees.filter((r) => r.id !== id))}
        addLabel="+ Add Entry Fee"
        selectOptions={feeItems.map((e) => ({ id: e.id, label: `${e.serviceName} (${e.city})` }))}
        onAdd={addFee}
      />
      <InclusionBlock
        title="Meals"
        color="#34D399"
        rows={p.mealInclusions}
        onRemove={(id) => p.setMealInclusions(p.mealInclusions.filter((r) => r.id !== id))}
        addLabel="+ Add Meal"
        selectOptions={mockMeals.filter((m) => m.status === "Active").map((m) => ({ id: m.id, label: `${m.mealName} (${m.mealType})` }))}
        onAdd={addMeal}
      />
      <InclusionBlock
        title="Extras & Activities"
        color="#C084FC"
        rows={p.extras}
        onRemove={(id) => p.setExtras(p.extras.filter((r) => r.id !== id))}
        addLabel="+ Add Extra"
        selectOptions={activityItems.map((e) => ({ id: e.id, label: `${e.serviceName} (${e.city})` }))}
        onAdd={addExtra}
      />

      {grandTotal > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, paddingTop: 10, borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            Inclusions Total: <strong style={{ color: "#4ADE80", marginLeft: 4 }}>₾ {grandTotal.toLocaleString()}</strong>
          </span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            ≈ <strong style={{ color: "#4ADE80" }}>${(grandTotal / (p.gelRate || 2.72)).toFixed(2)}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

function InclusionBlock({ title, color, rows, onRemove, addLabel, selectOptions, onAdd }: {
  title: string; color: string;
  rows: InclusionRow[];
  onRemove: (id: string) => void;
  addLabel: string;
  selectOptions: { id: number; label: string }[];
  onAdd: (id: number) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ ...lbl, color }}>{title}</span>
      </div>

      {rows.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 100px 32px", gap: 8, padding: "5px 10px", marginBottom: 3 }}>
            {["Name", "Calculation", "Total GEL", ""].map((h) => (
              <span key={h} style={{ fontSize: 10, color: "#475569", fontWeight: 600, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1fr 200px 100px 32px", gap: 8, padding: "7px 10px", background: "#0F172A", borderRadius: 6, marginBottom: 3, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#E2E8F0" }}>{row.name}</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>{row.calcLabel}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#4ADE80" }}>₾ {row.totalGel.toLocaleString()}</span>
              <button type="button" onClick={() => onRemove(row.id)}
                style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", display: "flex", padding: 2, borderRadius: 4 }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select defaultValue="" onChange={(e) => { if (e.target.value) { onAdd(Number(e.target.value)); e.target.value = ""; } }}
          style={{ ...sel, background: "#0F172A", fontSize: 12, flex: 1 }}>
          <option value="">{addLabel}</option>
          {selectOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
