"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Copy, Trash2, Upload, AlertTriangle } from "lucide-react";
import { mockTours, mockRates, TOUR_TYPES, VEHICLE_TYPES, type Tour, type TourRate, type TourType } from "./mockTours";
import AddTourModal from "./AddTourModal";
import { useAuth } from "@/components/AuthContext";

function MarketBadge({ market }: { market: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    India: { bg: "#1E3A5F", color: "#60A5FA" },
    GCC:   { bg: "#2D1B4E", color: "#C084FC" },
    Both:  { bg: "#0D2E1A", color: "#4ADE80" },
  };
  const s = map[market] ?? map.Both;
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{market}</span>;
}

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

function IBtn({ children, title, color, onClick }: { children: React.ReactNode; title: string; color: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#0F172A" : "none", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", color: h ? color : "#475569", display: "flex", alignItems: "center", transition: "color 0.15s, background 0.15s" }}>
      {children}
    </button>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel, confirmColor }: {
  message: string; onConfirm: () => void; onCancel: () => void;
  confirmLabel?: string; confirmColor?: string;
}) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 14, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
          <span style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }}><AlertTriangle size={20} /></span>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>Confirm Action</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94A3B8" }}>{message}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: confirmColor ?? "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{confirmLabel ?? "Delete"}</button>
        </div>
      </div>
    </div>
  );
}

function CheckboxPills({ label, options, selected, onToggle }: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{label}:</span>
      {["All", ...options].map((opt) => {
        const active = opt === "All" ? selected.length === 0 : selected.includes(opt);
        return (
          <label key={opt} style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer", padding: "3px 10px", borderRadius: 20, border: `1px solid ${active ? "#3B82F6" : "#334155"}`, background: active ? "#1E3A5F" : "transparent", transition: "all 0.15s" }}>
            <input
              type="checkbox"
              checked={active}
              onChange={() => opt === "All" ? (selected.length > 0 && options.forEach(o => selected.includes(o) && onToggle(o))) : onToggle(opt)}
              style={{ accentColor: "#3B82F6", width: 11, height: 11 }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: active ? "#60A5FA" : "#94A3B8" }}>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

const th: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const fi: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
const sectionCard: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden", marginBottom: 32 };

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const [rates, setRates] = useState<TourRate[]>(mockRates);
  const [showModal, setShowModal] = useState(false);
  const { isManager } = useAuth();

  // Tour filters
  const [tourSearch, setTourSearch] = useState("");

  // Rate filters — checkbox multi-select
  const [selectedRateTypes, setSelectedRateTypes] = useState<string[]>([]);
  const [rateTourFilter, setRateTourFilter] = useState("All");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  // Confirm dialogs
  const [deleteRateConfirmId, setDeleteRateConfirmId] = useState<number | null>(null);
  const [duplicateRateConfirmId, setDuplicateRateConfirmId] = useState<number | null>(null);
  const [deleteTourConfirmId, setDeleteTourConfirmId] = useState<number | null>(null);
  const [duplicateTourConfirmId, setDuplicateTourConfirmId] = useState<number | null>(null);

  const toggleRateType = (v: string) =>
    setSelectedRateTypes((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const toggleVehicle = (v: string) =>
    setSelectedVehicles((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const filteredTours = useMemo(() => tours.filter((t) => {
    if (tourSearch && !t.name.toLowerCase().includes(tourSearch.toLowerCase())) return false;
    return true;
  }), [tours, tourSearch]);

  const filteredRates = useMemo(() => rates.filter((r) => {
    if (selectedRateTypes.length > 0 && !selectedRateTypes.includes(r.type)) return false;
    if (rateTourFilter !== "All" && r.tourName !== rateTourFilter) return false;
    if (selectedVehicles.length > 0 && !selectedVehicles.includes(r.vehicle)) return false;
    return true;
  }), [rates, selectedRateTypes, rateTourFilter, selectedVehicles]);

  const rateToDelete = rates.find((r) => r.id === deleteRateConfirmId);
  const rateToDuplicate = rates.find((r) => r.id === duplicateRateConfirmId);
  const tourToDelete = tours.find((t) => t.id === deleteTourConfirmId);
  const tourToDuplicate = tours.find((t) => t.id === duplicateTourConfirmId);

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
          </div>
          <button onClick={() => setShowModal(true)} style={{ ...addBtn, height: 34, fontSize: 12 }}><Plus size={13} />Add Tour</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Tour / Transfer Name", "From", "To", "Actions"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTours.length === 0
                ? <tr><td colSpan={5} style={{ padding: "32px 0", textAlign: "center", color: "#475569" }}>No tours found.</td></tr>
                : filteredTours.map((t, i) => (
                  <TourRow
                    key={t.id} t={t} i={i + 1}
                    onDuplicate={() => setDuplicateTourConfirmId(t.id)}
                    onDelete={() => setDeleteTourConfirmId(t.id)}
                    canDelete={isManager}
                  />
                ))
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
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Rates</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "#14532D", border: "1px solid #166534", borderRadius: 8, color: "#4ADE80", fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: "pointer", height: 34, display: "flex", alignItems: "center", gap: 6 }}>
                <Upload size={13} strokeWidth={2.5} /> Upload Rates
              </button>
              <button onClick={() => {}} style={{ ...addBtn, height: 34, fontSize: 12, background: "#166534", border: "1px solid #15803D" }}>
                <Plus size={13} />Add Rate
              </button>
            </div>
          </div>

          {/* Checkbox filters */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <CheckboxPills
              label="Type"
              options={TOUR_TYPES as unknown as string[]}
              selected={selectedRateTypes}
              onToggle={toggleRateType}
            />
            <div style={{ width: 1, height: 24, background: "#334155" }} />
            <CheckboxPills
              label="Vehicle"
              options={VEHICLE_TYPES as unknown as string[]}
              selected={selectedVehicles}
              onToggle={toggleVehicle}
            />
            <div style={{ width: 1, height: 24, background: "#334155" }} />
            <select value={rateTourFilter} onChange={(e) => setRateTourFilter(e.target.value)} style={{ ...fi, cursor: "pointer", width: 220, height: 32, fontSize: 12 }}>
              <option value="All">All Tours / Transfers</option>
              {Array.from(new Set(rates.map((r) => r.tourName))).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Tour / Transfer", "Type", "Vehicle", "Market", "High Season (GEL)", "Low Season (GEL)", "Status", "Actions"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRates.length === 0
                ? <tr><td colSpan={9} style={{ padding: "32px 0", textAlign: "center", color: "#475569" }}>No rates found.</td></tr>
                : filteredRates.map((r, i) => (
                  <RateRow
                    key={r.id} r={r} i={i + 1}
                    onDuplicate={() => setDuplicateRateConfirmId(r.id)}
                    onDelete={() => setDeleteRateConfirmId(r.id)}
                    canDelete={isManager}
                  />
                ))
              }
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filteredRates.length} of {rates.length} rates</span>
        </div>
      </div>

      {showModal && <AddTourModal onClose={() => setShowModal(false)} onSave={(t) => setTours((p) => [...p, { ...t, id: p.length + 1 }])} />}

      {/* Tour confirm dialogs */}
      {deleteTourConfirmId !== null && (
        <ConfirmDialog
          message={`Delete tour "${tourToDelete?.name}"? This action cannot be undone.`}
          onConfirm={() => { setTours((p) => p.filter((x) => x.id !== deleteTourConfirmId)); setDeleteTourConfirmId(null); }}
          onCancel={() => setDeleteTourConfirmId(null)}
        />
      )}
      {duplicateTourConfirmId !== null && (
        <ConfirmDialog
          message={`Duplicate tour "${tourToDuplicate?.name}"?`}
          onConfirm={() => {
            const orig = tours.find((t) => t.id === duplicateTourConfirmId);
            if (orig) setTours((p) => [...p, { ...orig, id: Date.now(), name: orig.name + " (Copy)" }]);
            setDuplicateTourConfirmId(null);
          }}
          onCancel={() => setDuplicateTourConfirmId(null)}
          confirmLabel="Duplicate"
          confirmColor="#7C3AED"
        />
      )}

      {/* Rate confirm dialogs */}
      {deleteRateConfirmId !== null && (
        <ConfirmDialog
          message={`Delete rate for "${rateToDelete?.tourName}"? This action cannot be undone.`}
          onConfirm={() => { setRates((p) => p.filter((x) => x.id !== deleteRateConfirmId)); setDeleteRateConfirmId(null); }}
          onCancel={() => setDeleteRateConfirmId(null)}
        />
      )}
      {duplicateRateConfirmId !== null && (
        <ConfirmDialog
          message={`Duplicate rate for "${rateToDuplicate?.tourName}"?`}
          onConfirm={() => {
            const orig = rates.find((r) => r.id === duplicateRateConfirmId);
            if (orig) setRates((p) => [...p, { ...orig, id: Date.now() }]);
            setDuplicateRateConfirmId(null);
          }}
          onCancel={() => setDuplicateRateConfirmId(null)}
          confirmLabel="Duplicate"
          confirmColor="#7C3AED"
        />
      )}
    </div>
  );
}

function TourRow({ t, i, onDuplicate, onDelete, canDelete }: { t: Tour; i: number; onDuplicate: () => void; onDelete: () => void; canDelete?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={td}>{i}</td>
      <td style={td}>
        <div style={{ fontWeight: 600, color: "#F8FAFC" }}>{t.name}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{t.description.slice(0, 60)}{t.description.length > 60 ? "…" : ""}</div>
      </td>
      <td style={{ ...td, color: "#94A3B8" }}>{t.fromCity}</td>
      <td style={{ ...td, color: "#94A3B8" }}>{t.toCity}</td>
      <td style={td}>
        <div style={{ display: "flex", gap: 4 }}>
          <IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn>
          <IBtn title="Duplicate" color="#A78BFA" onClick={onDuplicate}><Copy size={14} /></IBtn>
          {canDelete && <IBtn title="Delete" color="#F87171" onClick={onDelete}><Trash2 size={14} /></IBtn>}
        </div>
      </td>
    </tr>
  );
}

function RateRow({ r, i, onDuplicate, onDelete, canDelete }: { r: TourRate; i: number; onDuplicate: () => void; onDelete: () => void; canDelete?: boolean }) {
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
      <td style={td}>
        <div style={{ display: "flex", gap: 4 }}>
          <IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn>
          <IBtn title="Duplicate" color="#A78BFA" onClick={onDuplicate}><Copy size={14} /></IBtn>
          {canDelete && <IBtn title="Delete" color="#F87171" onClick={onDelete}><Trash2 size={14} /></IBtn>}
        </div>
      </td>
    </tr>
  );
}
