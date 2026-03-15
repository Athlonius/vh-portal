"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { mockGuides, ALL_LANGUAGES, type Guide } from "./mockGuides";
import TagList from "../shared/TagList";
import AddGuideModal from "./AddGuideModal";


export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>(mockGuides);
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [langFilter, setLangFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => guides.filter((g) => {
    const q = search.toLowerCase();
    if (q && !`${g.firstName} ${g.lastName} ${g.phone} ${g.email}`.toLowerCase().includes(q)) return false;
    if (activeOnly && !g.active) return false;
    if (langFilter !== "All" && !g.languages.includes(langFilter)) return false;
    return true;
  }), [guides, search, activeOnly, langFilter]);

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Guides</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>Manage guide profiles, languages, and specialties.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtn}><Plus size={15} strokeWidth={2.5} />Add Guide</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, email..." style={{ ...fi, paddingLeft: 30, width: 230 }} />
        </div>
        <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} style={{ ...fi, cursor: "pointer", width: 140 }}>
          <option value="All">All Languages</option>
          {ALL_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#94A3B8", cursor: "pointer", userSelect: "none" }}>
          <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} style={{ accentColor: "#3B82F6", width: 14, height: 14 }} />
          Active Only
        </label>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B" }}>{filtered.length} guide{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Name", "Phone", "Languages", "Regions", "Specialties", "Status", "Actions"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>No guides found.</td></tr>
                : filtered.map((g, i) => <GuideRow key={g.id} g={g} i={i + 1} onDelete={(id) => setGuides((p) => p.filter((x) => x.id !== id))} />)
              }
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filtered.length} of {guides.length} guides shown</span>
        </div>
      </div>
      {showModal && <AddGuideModal onClose={() => setShowModal(false)} onSave={(g) => setGuides((p) => [...p, { ...g, id: p.length + 1 }])} />}
    </div>
  );
}

function GuideRow({ g, i, onDelete }: { g: Guide; i: number; onDelete: (id: number) => void }) {
  const [hov, setHov] = useState(false);
  const statusMap: Record<string, { bg: string; color: string }> = {
    Active:     { bg: "#0D2E1A", color: "#4ADE80" },
    Inactive:   { bg: "#1E293B", color: "#64748B" },
    "On Leave": { bg: "#3B2A00", color: "#FCD34D" },
  };
  const s = statusMap[g.status] ?? statusMap.Inactive;
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={td}>{i}</td>
      <td style={td}>
        <div style={{ fontWeight: 600, color: "#F8FAFC" }}>{g.firstName} {g.lastName}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{g.email}</div>
      </td>
      <td style={{ ...td, color: "#94A3B8", whiteSpace: "nowrap" }}>{g.phone}</td>
      <td style={{ ...td, maxWidth: 180 }}><TagList items={g.languages} color="#60A5FA" bg="#1E3A5F" /></td>
      <td style={{ ...td, maxWidth: 200 }}><TagList items={g.regions} color="#34D399" bg="#0D2E1A" /></td>
      <td style={{ ...td, maxWidth: 220 }}><TagList items={g.specialties} color="#C084FC" bg="#2D1B4E" /></td>
      <td style={td}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />{g.status}
        </span>
      </td>
      <td style={td}>
        <div style={{ display: "flex", gap: 4 }}>
          <IBtn title="Calendar" color="#60A5FA"><CalendarDays size={14} /></IBtn>
          <IBtn title="Edit" color="#A78BFA"><Pencil size={14} /></IBtn>
          <IBtn title="Delete" color="#F87171" onClick={() => onDelete(g.id)}><Trash2 size={14} /></IBtn>
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

const th: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "13px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const fi: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
