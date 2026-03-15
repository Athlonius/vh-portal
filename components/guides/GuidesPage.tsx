"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, CalendarDays, AlertTriangle } from "lucide-react";
import { mockGuides, ALL_LANGUAGES, ALL_REGIONS, ALL_SPECIALTIES, type Guide } from "./mockGuides";
import TagList from "../shared/TagList";
import AddGuideModal from "./AddGuideModal";
import { useAuth } from "@/components/AuthContext";

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

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>(mockGuides);
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [langFilter, setLangFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editGuide, setEditGuide] = useState<Guide | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { isManager } = useAuth();

  const filtered = useMemo(() => guides.filter((g) => {
    const q = search.toLowerCase();
    if (q && !`${g.firstName} ${g.lastName} ${g.phone} ${g.email}`.toLowerCase().includes(q)) return false;
    if (activeOnly && !g.active) return false;
    if (langFilter !== "All" && !g.languages.includes(langFilter)) return false;
    if (regionFilter !== "All" && !g.regions.includes(regionFilter)) return false;
    if (specialtyFilter !== "All" && !g.specialties.includes(specialtyFilter)) return false;
    return true;
  }), [guides, search, activeOnly, langFilter, regionFilter, specialtyFilter]);

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      setGuides((p) => p.filter((x) => x.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const guideToDelete = guides.find((g) => g.id === deleteConfirmId);

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
        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} style={{ ...fi, cursor: "pointer", width: 140 }}>
          <option value="All">All Regions</option>
          {ALL_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)} style={{ ...fi, cursor: "pointer", width: 160 }}>
          <option value="All">All Specialties</option>
          {ALL_SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
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
                : filtered.map((g, i) => (
                  <GuideRow
                    key={g.id} g={g} i={i + 1}
                    onEdit={setEditGuide}
                    onDelete={(id) => setDeleteConfirmId(id)}
                    canDelete={isManager}
                  />
                ))
              }
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filtered.length} of {guides.length} guides shown</span>
        </div>
      </div>

      {showModal && (
        <AddGuideModal
          onClose={() => setShowModal(false)}
          onSave={(g) => setGuides((p) => [...p, { ...g, id: p.length + 1 }])}
        />
      )}
      {editGuide && (
        <AddGuideModal
          guide={editGuide}
          onClose={() => setEditGuide(null)}
          onSave={() => {}}
          onUpdate={(g) => {
            setGuides((p) => p.map((x) => x.id === g.id ? g : x));
            setEditGuide(null);
          }}
        />
      )}
      {deleteConfirmId !== null && (
        <ConfirmDialog
          message={`Delete guide "${guideToDelete?.firstName} ${guideToDelete?.lastName}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}

function GuideRow({ g, i, onEdit, onDelete, canDelete }: { g: Guide; i: number; onEdit: (g: Guide) => void; onDelete: (id: number) => void; canDelete?: boolean }) {
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
          <IBtn title="Edit" color="#A78BFA" onClick={() => onEdit(g)}><Pencil size={14} /></IBtn>
          {canDelete && <IBtn title="Delete" color="#F87171" onClick={() => onDelete(g.id)}><Trash2 size={14} /></IBtn>}
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
