"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, Copy, AlertTriangle } from "lucide-react";
import { mockPartners, type Partner, type Market } from "./mockPartners";
import AddPartnerModal from "./AddPartnerModal";
import { useAuth } from "@/components/AuthContext";

function MarketBadge({ market }: { market: Market }) {
  const map: Record<Market, { bg: string; color: string; emoji: string }> = {
    India: { bg: "#1E3A5F", color: "#60A5FA", emoji: "🇮🇳" },
    GCC:   { bg: "#2D1B4E", color: "#C084FC", emoji: "🌙" },
    Other: { bg: "#1E293B", color: "#94A3B8", emoji: "🌐" },
  };
  const s = map[market] ?? map.Other;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
      {s.emoji} {market}
    </span>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#FBBF24", letterSpacing: 1, fontSize: 13 }}>
      {"★".repeat(rating)}<span style={{ color: "#334155" }}>{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    Active:   { bg: "#0D2E1A", color: "#4ADE80" },
    Inactive: { bg: "#1E293B", color: "#64748B" },
    Prospect: { bg: "#3B2A00", color: "#FCD34D" },
  };
  const s = styles[status] ?? styles.Inactive;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />{status}
    </span>
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

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [search, setSearch] = useState("");
  const [agentNameFilter, setAgentNameFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [marketFilter, setMarketFilter] = useState<"All" | Market>("All");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [duplicateConfirmId, setDuplicateConfirmId] = useState<number | null>(null);
  const { isManager } = useAuth();

  const filtered = useMemo(() => partners.filter((p) => {
    if (search && !p.companyName.toLowerCase().includes(search.toLowerCase())) return false;
    if (agentNameFilter && !p.agents.some((a) => a.name.toLowerCase().includes(agentNameFilter.toLowerCase()))) return false;
    if (countryFilter && !p.country.toLowerCase().includes(countryFilter.toLowerCase())) return false;
    if (marketFilter !== "All" && p.market !== marketFilter) return false;
    if (phoneFilter && !p.telephone.toLowerCase().includes(phoneFilter.toLowerCase())) return false;
    return true;
  }), [partners, search, agentNameFilter, countryFilter, marketFilter, phoneFilter]);

  const addPartner = (data: Omit<Partner, "id">) =>
    setPartners((prev) => [...prev, { ...data, id: Date.now() }]);

  const partnerToDelete = partners.find((p) => p.id === deleteConfirmId);
  const partnerToDuplicate = partners.find((p) => p.id === duplicateConfirmId);

  const hasFilters = search || agentNameFilter || countryFilter || marketFilter !== "All" || phoneFilter;
  const clearFilters = () => { setSearch(""); setAgentNameFilter(""); setCountryFilter(""); setMarketFilter("All"); setPhoneFilter(""); };

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Partners</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>Manage, review, and add new partners for your team.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtn}><Plus size={15} strokeWidth={2.5} /> Add New Partner</button>
      </div>

      {/* Filters */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "14px 16px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        <FLabel label="Company Name">
          <div style={{ position: "relative" }}>
            <Search size={13} color="#64748B" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ ...fi, paddingLeft: 28, width: 180 }} />
          </div>
        </FLabel>
        <FLabel label="Agent Name">
          <input value={agentNameFilter} onChange={(e) => setAgentNameFilter(e.target.value)} placeholder="Agent name..." style={{ ...fi, width: 150 }} />
        </FLabel>
        <FLabel label="Country">
          <input value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} placeholder="Country..." style={{ ...fi, width: 130 }} />
        </FLabel>
        <FLabel label="Market">
          <select value={marketFilter} onChange={(e) => setMarketFilter(e.target.value as typeof marketFilter)} style={{ ...fi, cursor: "pointer", width: 120 }}>
            <option value="All">All</option>
            <option value="India">India</option>
            <option value="GCC">GCC</option>
            <option value="Other">Other</option>
          </select>
        </FLabel>
        <FLabel label="Phone">
          <input value={phoneFilter} onChange={(e) => setPhoneFilter(e.target.value)} placeholder="+91 / +971..." style={{ ...fi, width: 140 }} />
        </FLabel>
        {hasFilters && (
          <button onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid #475569", borderRadius: 8, color: "#94A3B8", fontSize: 12, padding: "7px 12px", cursor: "pointer", height: 36, alignSelf: "flex-end" }}>
            Clear
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B", alignSelf: "center" }}>
          {filtered.length} partner{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Company Name", "Agents", "Country", "Market", "Status", "Rating", "Email", "Telephone", "Actions"].map((col) => (
                  <th key={col} style={thStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>No partners found.</td></tr>
              ) : (
                filtered.map((p, i) => (
                  <PartnerRow
                    key={p.id} partner={p} index={i + 1}
                    onDelete={(id) => setDeleteConfirmId(id)}
                    onDuplicate={(id) => setDuplicateConfirmId(id)}
                    canDelete={isManager}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filtered.length} of {partners.length} partners shown</span>
        </div>
      </div>

      {showModal && <AddPartnerModal onClose={() => setShowModal(false)} onSave={addPartner} nextId={partners.length + 1} />}

      {deleteConfirmId !== null && (
        <ConfirmDialog
          message={`Delete partner "${partnerToDelete?.companyName}"? This action cannot be undone.`}
          onConfirm={() => { setPartners((p) => p.filter((x) => x.id !== deleteConfirmId)); setDeleteConfirmId(null); }}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}

      {duplicateConfirmId !== null && (
        <ConfirmDialog
          message={`Duplicate partner "${partnerToDuplicate?.companyName}"?`}
          onConfirm={() => {
            const orig = partners.find((p) => p.id === duplicateConfirmId);
            if (orig) {
              setPartners((prev) => [...prev, { ...orig, id: Date.now(), companyName: orig.companyName + " (Copy)", registrationNumber: orig.registrationNumber + "-C" }]);
            }
            setDuplicateConfirmId(null);
          }}
          onCancel={() => setDuplicateConfirmId(null)}
          confirmLabel="Duplicate"
          confirmColor="#7C3AED"
        />
      )}
    </div>
  );
}

function PartnerRow({ partner: p, index, onDelete, onDuplicate, canDelete }: {
  partner: Partner; index: number;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  canDelete?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={tdStyle}>{index}</td>
      <td style={tdStyle}>
        <div style={{ fontWeight: 600, color: "#F8FAFC" }}>{p.companyName}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{p.registrationNumber}</div>
      </td>
      <td style={tdStyle}>
        {p.agents.map((a, i) => (
          <div key={i} style={{ color: i === 0 ? "#E2E8F0" : "#94A3B8", fontSize: i === 0 ? 13 : 11 }}>{a.name}</div>
        ))}
      </td>
      <td style={{ ...tdStyle, color: "#94A3B8" }}>{p.city}, {p.country}</td>
      <td style={tdStyle}><MarketBadge market={p.market} /></td>
      <td style={tdStyle}><StatusBadge status={p.partnershipStatus} /></td>
      <td style={tdStyle}><RatingStars rating={p.rating} /></td>
      <td style={{ ...tdStyle, color: "#60A5FA" }}>{p.email}</td>
      <td style={{ ...tdStyle, color: "#94A3B8", whiteSpace: "nowrap" }}>{p.telephone}</td>
      <td style={tdStyle}>
        <div style={{ display: "flex", gap: 4 }}>
          <IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn>
          <IBtn title="Duplicate" color="#A78BFA" onClick={() => onDuplicate(p.id)}><Copy size={14} /></IBtn>
          {canDelete && <IBtn title="Delete" color="#F87171" onClick={() => onDelete(p.id)}><Trash2 size={14} /></IBtn>}
        </div>
      </td>
    </tr>
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

function FLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      {children}
    </label>
  );
}

const thStyle: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "13px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const fi: React.CSSProperties = { background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
