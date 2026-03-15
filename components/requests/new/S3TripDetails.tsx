import { type MealPlan } from "./types";
import { inp, lbl } from "./S1Context";
import { nightsBetween } from "./utils";

interface Props {
  dateFrom: string; setDateFrom: (v: string) => void;
  dateTo: string; setDateTo: (v: string) => void;
  mealPlan: MealPlan; setMealPlan: (v: MealPlan) => void;
}

const MEAL_PLANS: MealPlan[] = ["RO", "BB", "HB", "FB"];
const MEAL_LABELS: Record<MealPlan, string> = {
  RO: "RO – Room Only", BB: "BB – Bed & Breakfast",
  HB: "HB – Half Board", FB: "FB – Full Board",
};

export default function S3TripDetails(p: Props) {
  const nights = nightsBetween(p.dateFrom, p.dateTo);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 1fr", gap: 14, alignItems: "end" }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={lbl}>Date From</span>
        <input type="date" value={p.dateFrom} min={today}
          onChange={(e) => p.setDateFrom(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={lbl}>Date To</span>
        <input type="date" value={p.dateTo} min={p.dateFrom || today}
          onChange={(e) => p.setDateTo(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={lbl}>Nights</span>
        <div style={{ ...inp, background: "#0F172A", color: nights > 0 ? "#60A5FA" : "#475569", fontWeight: 700, cursor: "default" }}>
          {nights > 0 ? nights : "—"}
        </div>
      </div>
      <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={lbl}>Meal Plan</span>
        <select value={p.mealPlan} onChange={(e) => p.setMealPlan(e.target.value as MealPlan)}
          style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "8px 12px", outline: "none", width: "100%", cursor: "pointer" }}>
          {MEAL_PLANS.map((m) => <option key={m} value={m}>{MEAL_LABELS[m]}</option>)}
        </select>
      </label>
    </div>
  );
}
