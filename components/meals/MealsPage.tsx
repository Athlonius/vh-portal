"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, Upload, AlertTriangle } from "lucide-react";
import { mockMeals, MEAL_MARKETS, MEAL_TYPES, type Meal } from "./mockMeals";
import AddMealModal from "./AddMealModal";

const marketStyle: Record<string, { bg: string; color: string }> = {
  India: { bg: "#1E3A5F", color: "#60A5FA" },
  GCC:   { bg: "#2D1B4E", color: "#C084FC" },
  All:   { bg: "#0D2E1A", color: "#4ADE80" },
};
const mealTypeStyle: Record<string, { bg: string; color: string }> = {
  Breakfast: { bg: "#3B2A00", color: "#FCD34D" },
  Lunch:     { bg: "#0C2E36", color: "#22D3EE" },
  Dinner:    { bg: "#2D1B4E", color: "#C084FC" },
  Brunch:    { bg: "#1E3A5F", color: "#60A5FA" },
};

function Pill({ label, map }: { label: string; map: Record<string, { bg: string; color: string }> }) {
  const s = map[label] ?? { bg: "#1E293B", color: "#94A3B8" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      {label === "India" ? "🇮🇳 " : label === "GCC" ? "🌙 " : label === "All" ? "🌍 " : ""}{label}
    </span>
  );
}

function IBtn({ children, title, color, onClick }: { children: React.ReactNode; title: string; color: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#0F172A" : "none", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", color: h ? color : "#475569", display: "flex", alignItems: "center", transition: "color 0.15s, background 0.15s" }}>
      {children}
    </button>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 14, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
          <span style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }}><AlertTriangle size={20} /></span>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>Confirm Delete</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94A3B8" }}>{message}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState("All");
  const [mealType, setMealType] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filtered = useMemo(() => meals.filter((m) => {
    if (search && !m.mealName.toLowerCase().includes(search.toLowerCase()) && !m.restaurantName.toLowerCase().includes(search.toLowerCase())) return false;
    if (market !== "All" && m.market !== market) return false;
    if (mealType !== "All" && m.mealType !== mealType) return false;
    return true;
  }), [meals, search, market, mealType]);

  const hasFilters = search || market !== "All" || mealType !== "All";
  const avgPrice = filtered.length ? Math.round(filtered.reduce((s, m) => s + m.pricePerPerson, 0) / filtered.length) : 0;

  const mealToDelete = meals.find((m) => m.id === deleteConfirmId);

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Meals</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>Manage meal options used in request inclusions.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...uploadBtn }}>
            <Upload size={14} strokeWidth={2.5} /> Upload Meals
          </button>
          <button onClick={() => setShowModal(true)} style={addBtn}><Plus size={15} strokeWidth={2.5} />Add Meal</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search meal or restaurant..." style={{ ...fi, paddingLeft: 30, width: 240 }} />
        </div>
        <select value={market} onChange={(e) => setMarket(e.target.value)} style={{ ...fi, cursor: "pointer", width: 140 }}>
          <option value="All">All Markets</option>
          {MEAL_MARKETS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={mealType} onChange={(e) => setMealType(e.target.value)} style={{ ...fi, cursor: "pointer", width: 140 }}>
          <option value="All">All Meal Types</option>
          {MEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {hasFilters && (
          <button onClick={() => { setSearch(""); setMarket("All"); setMealType("All"); }}
            style={{ background: "none", border: "1px solid #475569", borderRadius: 8, color: "#94A3B8", fontSize: 12, padding: "7px 12px", cursor: "pointer", height: 36 }}>
            Clear
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B" }}>{filtered.length} meal{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Summary strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Showing", value: `${filtered.length} meals`, color: "#60A5FA" },
          { label: "Avg Price / Person", value: `₾ ${avgPrice}`, color: "#4ADE80" },
          { label: "Active", value: `${filtered.filter(m => m.status === "Active").length}`, color: "#34D399" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "10px 18px", display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Restaurant Name", "Meal Name", "Market", "Meal Type", "Min Pax", "Max Pax", "Price / Person", "Status", "Actions"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={10} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>No meals found.</td></tr>
                : filtered.map((m, i) => (
                  <MealRow key={m.id} m={m} i={i + 1} onDelete={(id) => setDeleteConfirmId(id)} />
                ))
              }
            </tbody>
            {filtered.length > 1 && (
              <tfoot>
                <tr style={{ background: "#0F172A", borderTop: "2px solid #334155" }}>
                  <td colSpan={7} style={{ padding: "10px 14px", color: "#64748B", fontSize: 12, fontWeight: 600 }}>
                    {filtered.length} meals shown
                  </td>
                  <td style={{ padding: "10px 14px", color: "#4ADE80", fontSize: 12, fontWeight: 700 }}>
                    Avg ₾ {avgPrice} / person
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {showModal && <AddMealModal onClose={() => setShowModal(false)} onSave={(m) => setMeals((p) => [...p, { ...m, id: p.length + 1 }])} />}
      {deleteConfirmId !== null && (
        <ConfirmDialog
          message={`Delete meal "${mealToDelete?.mealName}"? This action cannot be undone.`}
          onConfirm={() => { setMeals((p) => p.filter((x) => x.id !== deleteConfirmId)); setDeleteConfirmId(null); }}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}

function MealRow({ m, i, onDelete }: { m: Meal; i: number; onDelete: (id: number) => void }) {
  const [hov, setHov] = useState(false);
  const priceDisplay = m.currency === "GEL"
    ? <span style={{ fontWeight: 700, color: "#4ADE80" }}>₾ {m.pricePerPerson}</span>
    : <span style={{ fontWeight: 700, color: "#60A5FA" }}>$ {m.pricePerPerson}</span>;

  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={td}>{i}</td>
      <td style={{ ...td, color: "#94A3B8" }}>{m.restaurantName}</td>
      <td style={{ ...td, fontWeight: 600, color: "#F8FAFC" }}>{m.mealName}</td>
      <td style={td}><Pill label={m.market} map={marketStyle} /></td>
      <td style={td}><Pill label={m.mealType} map={mealTypeStyle} /></td>
      <td style={{ ...td, textAlign: "center", color: "#94A3B8" }}>{m.minPax}</td>
      <td style={{ ...td, textAlign: "center", color: "#94A3B8" }}>{m.maxPax}</td>
      <td style={td}>{priceDisplay}</td>
      <td style={td}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: m.status === "Active" ? "#4ADE80" : "#64748B" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.status === "Active" ? "#22C55E" : "#475569" }} />{m.status}
        </span>
      </td>
      <td style={td}>
        <div style={{ display: "flex", gap: 4 }}>
          <IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn>
          <IBtn title="Delete" color="#F87171" onClick={() => onDelete(m.id)}><Trash2 size={14} /></IBtn>
        </div>
      </td>
    </tr>
  );
}

const th: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const fi: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
const uploadBtn: React.CSSProperties = { background: "#14532D", border: "1px solid #166534", borderRadius: 8, color: "#4ADE80", fontSize: 13, fontWeight: 600, padding: "8px 16px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
