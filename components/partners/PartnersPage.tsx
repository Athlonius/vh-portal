"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { mockPartners, type Partner } from "./mockPartners";
import AddPartnerModal from "./AddPartnerModal";

function MarketBadge({ market }: { market: "India" | "GCC" }) {
  const isIndia = market === "India";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: isIndia ? "#1E3A5F" : "#2D1B4E",
      color: isIndia ? "#60A5FA" : "#C084FC" }}>
      {isIndia ? "🇮🇳" : "🌙"} {market}
    </span>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#FBBF24", letterSpacing: 1, fontSize: 13 }}>
      {"★".repeat(rating)}
      <span style={{ color: "#334155" }}>{"★".repeat(5 - rating)}</span>
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
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />
      {status}
    </span>
  );
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() =>
    partners.filter((p) => !search || p.companyName.toLowerCase().includes(search.toLowerCase())),
    [partners, search]);

  const addPartner = (data: Omit<Partner, "id">) =>
    setPartners((prev) => [...prev, { ...data, id: prev.length + 1 }]);

  const deletePartner = (id: number) =>
    setPartners((prev) => prev.filter((p) => p.id !== id));

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Partners</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>
            Manage, review, and add new partners for your team.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtn}>
          <Plus size={15} strokeWidth={2.5} /> Add New Partner
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partner name..."
            style={{ ...filterInput, paddingLeft: 30, width: 240 }} />
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B" }}>
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
                filtered.map((p, i) => <PartnerRow key={p.id} partner={p} index={i + 1} onDelete={deletePartner} />)
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filtered.length} of {partners.length} partners shown</span>
        </div>
      </div>

      {showModal && <AddPartnerModal onClose={() => setShowModal(false)} onSave={addPartner} nextId={partners.length + 1} />}
    </div>
  );
}

function PartnerRow({ partner: p, index, onDelete }: { partner: Partner; index: number; onDelete: (id: number) => void }) {
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
          <IBtn title="Delete" color="#F87171" onClick={() => onDelete(p.id)}><Trash2 size={14} /></IBtn>
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

const thStyle: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "13px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const filterInput: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
