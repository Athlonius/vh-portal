"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil } from "lucide-react";
import { mockTours, mockRates, TOUR_TYPES, VEHICLE_TYPES, type Tour, type TourRate, type TourType } from "./mockTours";
import AddTourModal from "./AddTourModal";

function TypeBadge({ type }: { type: TourType }) {
  const map: Record<TourType, { bg: string; color: string }> = {
    Tour:     { bg: "#1E3A5F", color: "#60A5FA" },
    Transfer: { bg: "#0C2E36", color: "#22D3EE" },
    Disposal: { bg: "#2D1B4E", color: "#C084FC" },
  };
  const s = map[type];
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{type}</span>;
}

function StatusDot({ status }: { status: string }) {
  const active = status === "Active";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: active ? "#4ADE80" : "#64748B" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#22C55E" : "#475569" }} />{status}
    </span>
  );
}

function MarketBadge({ market }: { market: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    India: { bg: "#1E3A5F", color: "#60A5FA" },
    GCC:   { bg: "#2D1B4E", color: "#C084FC" },
    Both:  { bg: "#0D2E1A", color: "#4ADE80" },
  };
  const s = map[market] ?? map.Both;
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{market}</span>;
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

const th: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const fi: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
const sectionCard: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden", marginBottom: 32 };

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const [rates] = useState<TourRate[]>(mockRates);
  const [showModal, setShowModal] = useState(false);

  // Tour filters
  const [tourSearch, setTourSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | TourType>("All");

  // Rate filters
  const [rateTypeFilter, setRateTypeFilter] = useState<"All" | TourType>("All");
  const [rateTourFilter, setRateTourFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");

  const filteredTours = useMemo(() => tours.filter((t) => {
    if (tourSearch && !t.name.toLowerCase().includes(tourSearch.toLowerCase())) return false;
    if (typeFilter !== "All" && t.type !== typeFilter) return false;
    return true;
  }), [tours, tourSearch, typeFilter]);

  const filteredRates = useMemo(() => rates.filter((r) => {
    if (rateTypeFilter !== "All" && r.type !== rateTypeFilter) return false;
    if (rateTourFilter !== "All" && r.tourName !== rateTourFilter) return false;
    if (vehicleFilter !== "All" && r.vehicle !== vehicleFilter) return false;
    return true;
  }), [rates, rateTypeFilter, rateTourFilter, vehicleFilter]);

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Tours & Transfers</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>Manage service items used in the Request Tour Box.</p>
      </div>

      {/* ── TOURS SECTION ──────────────────────────────────────── */}
      <div style={sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #334155", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Tours</span>
            <div style={{ width: 1, height: 20, background: "#334155" }} />
            <div style={{ position: "relative" }}>
              <Search size={13} color="#64748B" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input value={tourSearch} onChange={(e) => setTourSearch(e.target.value)} placeholder="Search tour name..." style={{ ...fi, paddingLeft: 28, width: 200, height: 34, fontSize: 12 }} />
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} style={{ ...fi, cursor: "pointer", width: 130, height: 34, fontSize: 12 }}>
              <option value="All">All Types</option>
              {TOUR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={() => setShowModal(true)} style={{ ...addBtn, height: 34, fontSize: 12 }}><Plus size={13} />Add Tour</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Tour / Transfer Name", "Type", "From", "To", "Duration", "Status", "Edit"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTours.length === 0
                ? <tr><td colSpan={8} style={{ padding: "32px 0", textAlign: "center", color: "#475569" }}>No tours found.</td></tr>
                : filteredTours.map((t, i) => <TourRow key={t.id} t={t} i={i + 1} />)
              }
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filteredTours.length} of {tours.length} tours</span>
        </div>
      </div>

      {/* ── RATES SECTION ─────────────────────────────────────── */}
      <div style={sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #334155", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Rates</span>
            <div style={{ width: 1, height: 20, background: "#334155" }} />
            <select value={rateTypeFilter} onChange={(e) => setRateTypeFilter(e.target.value as typeof rateTypeFilter)} style={{ ...fi, cursor: "pointer", width: 130, height: 34, fontSize: 12 }}>
              <option value="All">All Types</option>
              {TOUR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={rateTourFilter} onChange={(e) => setRateTourFilter(e.target.value)} style={{ ...fi, cursor: "pointer", width: 220, height: 34, fontSize: 12 }}>
              <option value="All">All Tours / Transfers</option>
              {Array.from(new Set(rates.map((r) => r.tourName))).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} style={{ ...fi, cursor: "pointer", width: 130, height: 34, fontSize: 12 }}>
              <option value="All">All Vehicles</option>
              {VEHICLE_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <button onClick={() => {}} style={{ ...addBtn, height: 34, fontSize: 12, background: "#166534", border: "1px solid #15803D" }}>
            <Plus size={13} />Add Rate
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Tour / Transfer", "Type", "Vehicle", "Market", "High Season (GEL)", "Low Season (GEL)", "Status", "Edit"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRates.length === 0
                ? <tr><td colSpan={9} style={{ padding: "32px 0", textAlign: "center", color: "#475569" }}>No rates found.</td></tr>
                : filteredRates.map((r, i) => <RateRow key={r.id} r={r} i={i + 1} />)
              }
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filteredRates.length} of {rates.length} rates</span>
        </div>
      </div>

      {showModal && <AddTourModal onClose={() => setShowModal(false)} onSave={(t) => setTours((p) => [...p, { ...t, id: p.length + 1 }])} />}
    </div>
  );
}

function TourRow({ t, i }: { t: Tour; i: number }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={td}>{i}</td>
      <td style={td}>
        <div style={{ fontWeight: 600, color: "#F8FAFC" }}>{t.name}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{t.description.slice(0, 60)}{t.description.length > 60 ? "…" : ""}</div>
      </td>
      <td style={td}><TypeBadge type={t.type} /></td>
      <td style={{ ...td, color: "#94A3B8" }}>{t.fromCity}</td>
      <td style={{ ...td, color: "#94A3B8" }}>{t.toCity}</td>
      <td style={{ ...td, color: "#94A3B8", whiteSpace: "nowrap" }}>{t.duration}</td>
      <td style={td}><StatusDot status={t.status} /></td>
      <td style={td}><IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn></td>
    </tr>
  );
}

function RateRow({ r, i }: { r: TourRate; i: number }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={td}>{i}</td>
      <td style={{ ...td, color: "#60A5FA", fontWeight: 600 }}>{r.tourName}</td>
      <td style={td}><TypeBadge type={r.type} /></td>
      <td style={{ ...td, color: "#94A3B8" }}>{r.vehicle}</td>
      <td style={td}><MarketBadge market={r.market} /></td>
      <td style={{ ...td, fontWeight: 700, color: "#4ADE80" }}>₾ {r.highSeasonGel.toLocaleString()}</td>
      <td style={{ ...td, fontWeight: 700, color: "#FCD34D" }}>₾ {r.lowSeasonGel.toLocaleString()}</td>
      <td style={td}><StatusDot status={r.status} /></td>
      <td style={td}><IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn></td>
    </tr>
  );
}
