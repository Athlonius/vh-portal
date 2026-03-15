"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { mockExtras, CALCULATE_TYPES, SERVICE_TYPES, type Extra, type ExtraCalculateType, type ExtraServiceType } from "./mockExtras";
import AddExtraModal from "./AddExtraModal";
import { useAuth } from "@/components/AuthContext";

const calcColors: Record<ExtraCalculateType, { bg: string; color: string }> = {
  "Per Person":         { bg: "#1E3A5F", color: "#60A5FA" },
  "Total":              { bg: "#2D1B4E", color: "#C084FC" },
  "Per Day":            { bg: "#0C2E36", color: "#22D3EE" },
  "Per Person Per Day": { bg: "#0D2E1A", color: "#34D399" },
};
const serviceColors: Record<ExtraServiceType, { bg: string; color: string }> = {
  "Entrance Fee": { bg: "#3B2A00", color: "#FCD34D" },
  "Activity":     { bg: "#1E3A5F", color: "#60A5FA" },
  "Service":      { bg: "#0D2E1A", color: "#4ADE80" },
  "Other":        { bg: "#1E293B", color: "#94A3B8" },
};

function Pill({ label, map }: { label: string; map: Record<string, { bg: string; color: string }> }) {
  const s = map[label] ?? { bg: "#1E293B", color: "#94A3B8" };
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{label}</span>;
}

function StatusDot({ status }: { status: string }) {
  const active = status === "Active";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: active ? "#4ADE80" : "#64748B" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#22C55E" : "#475569" }} />{status}
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

const CITY_OPTIONS = ["Tbilisi", "Batumi", "Gudauri", "Kazbegi", "Borjomi", "Kakheti", "Any"] as const;

export default function ExtrasPage() {
  const [extras, setExtras] = useState<Extra[]>(mockExtras);
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState("All");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [calcType, setCalcType] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const { isManager } = useAuth();

  const toggleCity = (c: string) => {
    if (c === "Any") {
      setSelectedCities([]);
      return;
    }
    setSelectedCities((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const filtered = useMemo(() => extras.filter((e) => {
    if (search && !e.serviceName.toLowerCase().includes(search.toLowerCase())) return false;
    if (serviceType !== "All" && e.serviceType !== serviceType) return false;
    if (selectedCities.length > 0 && !selectedCities.includes(e.city)) return false;
    if (calcType !== "All" && e.calculateType !== calcType) return false;
    return true;
  }), [extras, search, serviceType, selectedCities, calcType]);

  const hasFilters = search || serviceType !== "All" || selectedCities.length > 0 || calcType !== "All";

  const gelTotal = filtered.filter(e => e.currency === "GEL" && e.calculateType === "Per Person").reduce((s, e) => s + e.price, 0);

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Extras & Entry Fees</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>
            Manage entry fees, activities, and extras used in requests.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtn}><Plus size={15} strokeWidth={2.5} />Add Extra</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search service name..." style={{ ...fi, paddingLeft: 30, width: 220 }} />
        </div>
        <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={{ ...fi, cursor: "pointer", width: 150 }}>
          <option value="All">All Service Types</option>
          {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={calcType} onChange={(e) => setCalcType(e.target.value)} style={{ ...fi, cursor: "pointer", width: 170 }}>
          <option value="All">All Calculate Types</option>
          {CALCULATE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {hasFilters && (
          <button onClick={() => { setSearch(""); setServiceType("All"); setSelectedCities([]); setCalcType("All"); }}
            style={{ background: "none", border: "1px solid #475569", borderRadius: 8, color: "#94A3B8", fontSize: 12, padding: "7px 12px", cursor: "pointer", height: 36 }}>
            Clear
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B" }}>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* City checkboxes */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginRight: 4 }}>City:</span>
        {CITY_OPTIONS.map((c) => {
          const active = c === "Any" ? selectedCities.length === 0 : selectedCities.includes(c);
          return (
            <label key={c} style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", padding: "5px 12px", borderRadius: 20, border: `1px solid ${active ? "#3B82F6" : "#334155"}`, background: active ? "#1E3A5F" : "transparent", transition: "all 0.15s" }}>
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggleCity(c)}
                style={{ accentColor: "#3B82F6", width: 12, height: 12 }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: active ? "#60A5FA" : "#94A3B8" }}>{c}</span>
            </label>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Service Name", "City", "Price", "Currency", "Calculate Type", "Service Type", "Age From", "Age To", "Status", "Actions"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={11} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>No extras found.</td></tr>
                : filtered.map((e, i) => <ExtraRow key={e.id} e={e} i={i + 1} onDelete={(id) => setExtras((p) => p.filter((x) => x.id !== id))} canDelete={isManager} />)
              }
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ background: "#0F172A", borderTop: "2px solid #334155" }}>
                  <td colSpan={3} style={{ padding: "10px 14px", color: "#64748B", fontSize: 12, fontWeight: 600 }}>
                    {filtered.length} item{filtered.length !== 1 ? "s" : ""} shown
                  </td>
                  <td style={{ padding: "10px 14px", color: "#4ADE80", fontSize: 12, fontWeight: 700 }} colSpan={8}>
                    Per-person GEL total: ₾ {gelTotal}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {showModal && <AddExtraModal onClose={() => setShowModal(false)} onSave={(e) => setExtras((p) => [...p, { ...e, id: p.length + 1 }])} />}
    </div>
  );
}

function ExtraRow({ e, i, onDelete, canDelete }: { e: Extra; i: number; onDelete: (id: number) => void; canDelete?: boolean }) {
  const [hov, setHov] = useState(false);
  const priceDisplay = e.price === 0
    ? <span style={{ color: "#4ADE80", fontWeight: 700 }}>Free</span>
    : <span style={{ fontWeight: 700, color: "#F8FAFC" }}>{e.currency === "GEL" ? "₾" : "$"} {e.price.toLocaleString()}</span>;

  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={td}>{i}</td>
      <td style={{ ...td, fontWeight: 600, color: "#F8FAFC" }}>{e.serviceName}</td>
      <td style={{ ...td, color: "#94A3B8" }}>{e.city}</td>
      <td style={td}>{priceDisplay}</td>
      <td style={td}>
        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
          background: e.currency === "GEL" ? "#0D2E1A" : "#1E3A5F", color: e.currency === "GEL" ? "#4ADE80" : "#60A5FA" }}>
          {e.currency === "GEL" ? "₾ GEL" : "$ USD"}
        </span>
      </td>
      <td style={td}><Pill label={e.calculateType} map={calcColors} /></td>
      <td style={td}><Pill label={e.serviceType} map={serviceColors} /></td>
      <td style={{ ...td, textAlign: "center", color: "#94A3B8" }}>{e.ageFrom ?? "—"}</td>
      <td style={{ ...td, textAlign: "center", color: "#94A3B8" }}>{e.ageTo ?? "—"}</td>
      <td style={td}><StatusDot status={e.status} /></td>
      <td style={td}>
        <div style={{ display: "flex", gap: 4 }}>
          <IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn>
          {canDelete && <IBtn title="Delete" color="#F87171" onClick={() => onDelete(e.id)}><Trash2 size={14} /></IBtn>}
        </div>
      </td>
    </tr>
  );
}

const th: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const fi: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
