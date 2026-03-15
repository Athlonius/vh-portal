"use client";

import { useState } from "react";
import { MEAL_MARKETS, MEAL_TYPES, type Meal, type MealMarket, type MealType, type MealStatus } from "./mockMeals";
import { Overlay, ModalHeader, Section, Field, ModalFooter, inp } from "../drivers/AddDriverModal";

interface Props { onClose: () => void; onSave: (m: Omit<Meal, "id">) => void; }

const marketColors: Record<MealMarket, { bg: string; color: string }> = {
  India: { bg: "#1E3A5F", color: "#60A5FA" },
  GCC:   { bg: "#2D1B4E", color: "#C084FC" },
  All:   { bg: "#0D2E1A", color: "#4ADE80" },
};

export default function AddMealModal({ onClose, onSave }: Props) {
  const [f, setF] = useState({
    mealName: "", market: "All" as MealMarket,
    mealType: "Lunch" as MealType,
    minPax: "2", maxPax: "30",
    pricePerPersonGel: "", status: "Active" as MealStatus,
  });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Add Meal" sub="Add a new meal option for request inclusions." onClose={onClose} />
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({
          mealName: f.mealName, market: f.market, mealType: f.mealType,
          minPax: parseInt(f.minPax) || 1, maxPax: parseInt(f.maxPax) || 99,
          pricePerPersonGel: parseFloat(f.pricePerPersonGel) || 0,
          status: f.status,
        });
        onClose();
      }} style={{ padding: 24 }}>
        <Section label="Meal Details">
          <Field label="Meal Name" required full>
            <input required value={f.mealName} onChange={(e) => set("mealName", e.target.value)} style={inp} placeholder="e.g. Indian Restaurant – Set Lunch" />
          </Field>

          <Field label="Market" full>
            <div style={{ display: "flex", gap: 8 }}>
              {MEAL_MARKETS.map((m) => {
                const s = marketColors[m];
                const active = f.market === m;
                return (
                  <button key={m} type="button" onClick={() => set("market", m)} style={{
                    flex: 1, padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    border: active ? "none" : "1px solid #334155",
                    background: active ? s.bg : "transparent",
                    color: active ? s.color : "#64748B",
                  }}>
                    {m === "India" ? "🇮🇳 " : m === "GCC" ? "🌙 " : "🌍 "}{m}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Meal Type" required>
            <select value={f.mealType} onChange={(e) => set("mealType", e.target.value as MealType)} style={{ ...inp, cursor: "pointer" }}>
              {MEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Price per Person (GEL)" required>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: 13, pointerEvents: "none" }}>₾</span>
              <input required type="number" min="0" step="0.01" value={f.pricePerPersonGel} onChange={(e) => set("pricePerPersonGel", e.target.value)}
                style={{ ...inp, paddingLeft: 26 }} placeholder="0.00" />
            </div>
          </Field>
        </Section>

        <Section label="Pax Range">
          <Field label="Min Pax">
            <input type="number" min="1" value={f.minPax} onChange={(e) => set("minPax", e.target.value)} style={inp} />
          </Field>
          <Field label="Max Pax">
            <input type="number" min="1" value={f.maxPax} onChange={(e) => set("maxPax", e.target.value)} style={inp} />
          </Field>
        </Section>

        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Status:</span>
          {(["Active", "Inactive"] as MealStatus[]).map((s) => (
            <button key={s} type="button" onClick={() => set("status", s)} style={{
              padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: f.status === s ? "none" : "1px solid #334155",
              background: f.status === s ? (s === "Active" ? "#0D2E1A" : "#3B0F0F") : "transparent",
              color: f.status === s ? (s === "Active" ? "#4ADE80" : "#F87171") : "#64748B",
            }}>{s}</button>
          ))}
        </div>

        <ModalFooter onClose={onClose} label="Save Meal" />
      </form>
    </Overlay>
  );
}
