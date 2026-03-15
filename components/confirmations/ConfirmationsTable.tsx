"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, Download, Plus, X, Search } from "lucide-react";
import { mockConfirmations, type Confirmation, type ConfirmationStatus } from "./mockConfirmations";
import { useAuth } from "@/components/AuthContext";

const MONTHS = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const YEARS = ["2024", "2025", "2026", "2027"];
const CREATED_BY_OPTIONS = ["All", "Eynur Ahmadov", "Nino Giorgadze", "Lasha Mchedlidze", "Admin"];

const statusStyle: Record<ConfirmationStatus, { bg: string; color: string; dot: string }> = {
  Confirmed: { bg: "#0D2E1A", color: "#4ADE80", dot: "#22C55E" },
  Ongoing:   { bg: "#1E3A5F", color: "#60A5FA", dot: "#3B82F6" },
  Completed: { bg: "#1E293B", color: "#94A3B8", dot: "#64748B" },
};

function StatusBadge({ status }: { status: ConfirmationStatus }) {
  const s = statusStyle[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function PaidBadge({ paid }: { paid: boolean }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, background: paid ? "#0D2E1A" : "#3B0F0F", color: paid ? "#4ADE80" : "#F87171", fontSize: 11, fontWeight: 700 }}>
      {paid ? "Yes" : "No"}
    </span>
  );
}

function fmt(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function usd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

// ── Edit Modal ──────────────────────────────────────────────────────────
function EditConfirmationModal({ c, onClose, onSave }: { c: Confirmation; onClose: () => void; onSave: (updated: Confirmation) => void }) {
  const [f, setF] = useState({
    guestName: c.guestName,
    revenue: String(c.revenue),
    amountPaid: String(c.amountPaid),
    paid: c.paid,
    paidInIndia: c.paidInIndia,
    paymentMethod: c.paymentMethod,
    expenses: String(c.expenses),
    status: c.status as ConfirmationStatus,
  });

  const set = (k: keyof typeof f, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...c,
      guestName: f.guestName,
      revenue: parseFloat(f.revenue) || 0,
      amountPaid: parseFloat(f.amountPaid) || 0,
      paid: f.paid,
      paidInIndia: f.paidInIndia,
      paymentMethod: f.paymentMethod,
      expenses: parseFloat(f.expenses) || 0,
      status: f.status,
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #334155", position: "sticky", top: 0, background: "#1E293B" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>Edit Confirmation</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748B" }}>{c.fileNo}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4 }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <MField label="Guest Name" full>
              <input value={f.guestName} onChange={(e) => set("guestName", e.target.value)} style={minp} placeholder="Guest name" />
            </MField>
            <MField label="Invoice Amount ($)">
              <input type="number" min="0" step="0.01" value={f.revenue} onChange={(e) => set("revenue", e.target.value)} style={minp} />
            </MField>
            <MField label="Amount Paid ($)">
              <input type="number" min="0" step="0.01" value={f.amountPaid} onChange={(e) => set("amountPaid", e.target.value)} style={minp} />
            </MField>
            <MField label="Expenses ($)">
              <input type="number" min="0" step="0.01" value={f.expenses} onChange={(e) => set("expenses", e.target.value)} style={minp} />
            </MField>
            <MField label="Payment Type">
              <input value={f.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} style={minp} placeholder="e.g. Bank Transfer" />
            </MField>
            <MField label="Status">
              <select value={f.status} onChange={(e) => set("status", e.target.value as ConfirmationStatus)} style={{ ...minp, cursor: "pointer" }}>
                {(["Confirmed", "Ongoing", "Completed"] as ConfirmationStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </MField>
          </div>

          {/* Toggles */}
          <div style={{ display: "flex", gap: 20, paddingTop: 16, marginTop: 4, borderTop: "1px solid #334155" }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Paid</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[true, false].map((val) => (
                  <button key={String(val)} type="button" onClick={() => set("paid", val)} style={{ padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: f.paid === val ? "none" : "1px solid #334155", background: f.paid === val ? (val ? "#0D2E1A" : "#3B0F0F") : "transparent", color: f.paid === val ? (val ? "#4ADE80" : "#F87171") : "#64748B" }}>
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Paid in India</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[true, false].map((val) => (
                  <button key={String(val)} type="button" onClick={() => set("paidInIndia", val)} style={{ padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: f.paidInIndia === val ? "none" : "1px solid #334155", background: f.paidInIndia === val ? (val ? "#0D2E1A" : "#3B0F0F") : "transparent", color: f.paidInIndia === val ? (val ? "#4ADE80" : "#F87171") : "#64748B" }}>
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid #334155" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MField({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      {children}
    </label>
  );
}

// ── Main Component ──────────────────────────────────────────────────────
export default function ConfirmationsTable() {
  const [confirmations, setConfirmations] = useState<Confirmation[]>(mockConfirmations);
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("All");

  // Filters
  const [fileNoFilter, setFileNoFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ConfirmationStatus>("All");
  const [paidFilter, setPaidFilter] = useState<"All" | "Yes" | "No">("All");
  const [createdByFilter, setCreatedByFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [editItem, setEditItem] = useState<Confirmation | null>(null);
  const { isManager } = useAuth();

  const filtered = useMemo(() => {
    return confirmations.filter((c) => {
      const [cy, cm] = c.start.split("-");
      if (cy !== year) return false;
      if (month !== "All" && parseInt(cm, 10) !== MONTHS.indexOf(month)) return false;
      if (fileNoFilter && !c.fileNo.toLowerCase().includes(fileNoFilter.toLowerCase())) return false;
      if (agentFilter && !c.agent.toLowerCase().includes(agentFilter.toLowerCase())) return false;
      if (partnerFilter && !c.partner.toLowerCase().includes(partnerFilter.toLowerCase())) return false;
      if (statusFilter !== "All" && c.status !== statusFilter) return false;
      if (paidFilter === "Yes" && !c.paid) return false;
      if (paidFilter === "No" && c.paid) return false;
      if (createdByFilter !== "All" && c.createdBy !== createdByFilter) return false;
      return true;
    });
  }, [confirmations, year, month, fileNoFilter, agentFilter, partnerFilter, statusFilter, paidFilter, createdByFilter]);

  const totalRevenue = filtered.reduce((s, c) => s + c.revenue, 0);
  const totalExpenses = filtered.reduce((s, c) => s + c.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalPaid = filtered.reduce((s, c) => s + (c.paid ? c.amountPaid : 0), 0);

  const hasFilters = fileNoFilter || agentFilter || partnerFilter || statusFilter !== "All" || paidFilter !== "All" || createdByFilter !== "All";
  const clearFilters = () => { setFileNoFilter(""); setAgentFilter(""); setPartnerFilter(""); setStatusFilter("All"); setPaidFilter("All"); setCreatedByFilter("All"); };

  const saveEdit = (updated: Confirmation) => {
    setConfirmations((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    setEditItem(null);
  };

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Confirmations</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>View, filter, and export all confirmed bookings.</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ ...selectStyle, width: 130 }}>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <div style={{ width: 1, height: 28, background: "#334155", margin: "0 4px" }} />
          <Link href="/leads"><button style={navBtn}>Leads</button></Link>
          <Link href="/requests"><button style={navBtn}>Requests</button></Link>
          <button style={newBtn}><Plus size={15} strokeWidth={2.5} />New Request</button>
          <button style={exportBtn}><Download size={14} strokeWidth={2.5} />Export</button>
        </div>
      </div>

      {/* Filters panel */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
        <button
          onClick={() => setShowFilters((v) => !v)}
          style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 13 }}
        >
          <span style={{ fontWeight: 600, color: hasFilters ? "#60A5FA" : "#94A3B8" }}>
            {hasFilters ? `Filters active (${[fileNoFilter, agentFilter, partnerFilter, statusFilter !== "All" ? statusFilter : "", paidFilter !== "All" ? paidFilter : "", createdByFilter !== "All" ? createdByFilter : ""].filter(Boolean).length})` : "Filters"}
          </span>
          <span style={{ fontSize: 11, color: "#64748B" }}>{showFilters ? "▲ Hide" : "▼ Show"}</span>
        </button>
        {showFilters && (
          <div style={{ padding: "0 16px 16px", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end", borderTop: "1px solid #334155" }}>
            <FLabel label="File No">
              <div style={{ position: "relative" }}>
                <Search size={13} color="#64748B" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={fileNoFilter} onChange={(e) => setFileNoFilter(e.target.value)} placeholder="VH-CF-..." style={{ ...fi, paddingLeft: 28, width: 150 }} />
              </div>
            </FLabel>
            <FLabel label="Agent">
              <input value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} placeholder="Agent name..." style={{ ...fi, width: 150 }} />
            </FLabel>
            <FLabel label="Partner">
              <input value={partnerFilter} onChange={(e) => setPartnerFilter(e.target.value)} placeholder="Partner name..." style={{ ...fi, width: 170 }} />
            </FLabel>
            <FLabel label="Status">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} style={{ ...fi, cursor: "pointer", width: 130 }}>
                <option value="All">All Statuses</option>
                {(["Confirmed", "Ongoing", "Completed"] as ConfirmationStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FLabel>
            <FLabel label="Paid">
              <select value={paidFilter} onChange={(e) => setPaidFilter(e.target.value as typeof paidFilter)} style={{ ...fi, cursor: "pointer", width: 110 }}>
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FLabel>
            <FLabel label="Created By">
              <select value={createdByFilter} onChange={(e) => setCreatedByFilter(e.target.value)} style={{ ...fi, cursor: "pointer", width: 170 }}>
                {CREATED_BY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </FLabel>
            {hasFilters && (
              <button onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid #475569", borderRadius: 8, color: "#94A3B8", fontSize: 12, padding: "7px 12px", cursor: "pointer", height: 36, alignSelf: "flex-end" }}>
                <X size={13} /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Bookings", value: filtered.length.toString(), color: "#60A5FA" },
          { label: "Total Revenue", value: usd(totalRevenue), color: "#A78BFA" },
          { label: "Total Expenses", value: usd(totalExpenses), color: "#F87171" },
          { label: "Net Profit", value: usd(totalProfit), color: totalProfit >= 0 ? "#4ADE80" : "#F87171" },
          { label: "Total Collected", value: usd(totalPaid), color: "#34D399" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "10px 18px", display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 17, fontWeight: 700, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {[
                  "#", "File No", "Agent", "Partner", "Start", "End",
                  "Hotel(s)", "Guide", "Driver", "Guests", "Guest Name",
                  "Invoice", "Amount Paid", "Paid", "Paid in India",
                  "Payment Type", "Expenses", "Profit", "Status", "Created By", "Actions",
                ].map((col) => (
                  <th key={col} style={thStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={21} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>
                    No confirmations for this period.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <ConfirmationRow key={c.id} c={c} index={i + 1} onEdit={setEditItem} onDelete={(id) => setConfirmations((p) => p.filter((x) => x.id !== id))} canDelete={isManager} />
                ))
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ background: "#0F172A", borderTop: "2px solid #334155" }}>
                  <td colSpan={12} style={{ padding: "10px 14px", color: "#64748B", fontSize: 12, fontWeight: 600 }}>
                    TOTALS — {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: "#F8FAFC" }}>{usd(totalPaid)}</td>
                  <td colSpan={3} />
                  <td style={{ ...tdStyle, fontWeight: 700, color: "#F87171" }}>{usd(totalExpenses)}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: totalProfit >= 0 ? "#4ADE80" : "#F87171" }}>
                    {totalProfit >= 0 ? "+" : ""}{usd(totalProfit)}
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {editItem && <EditConfirmationModal c={editItem} onClose={() => setEditItem(null)} onSave={saveEdit} />}
    </div>
  );
}

function ConfirmationRow({ c, index, onEdit, onDelete, canDelete }: { c: Confirmation; index: number; onEdit: (c: Confirmation) => void; onDelete: (id: number) => void; canDelete?: boolean }) {
  const [hov, setHov] = useState(false);
  const profit = c.revenue - c.expenses;

  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}
    >
      <td style={tdStyle}>{index}</td>
      <td style={{ ...tdStyle, color: "#60A5FA", fontWeight: 600, whiteSpace: "nowrap" }}>{c.fileNo}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{c.agent}</td>
      <td style={{ ...tdStyle, color: "#94A3B8", whiteSpace: "nowrap", maxWidth: 160 }}>{c.partner}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmt(c.start)}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmt(c.end)}</td>
      <td style={{ ...tdStyle, color: "#94A3B8", maxWidth: 200 }}>{c.hotels}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{c.guide}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{c.driver}</td>
      <td style={{ ...tdStyle, textAlign: "center" }}>{c.guests}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{c.guestName}</td>
      <td style={{ ...tdStyle, color: "#94A3B8", whiteSpace: "nowrap" }}>{c.invoice}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap", fontWeight: 600 }}>{usd(c.amountPaid)}</td>
      <td style={tdStyle}><PaidBadge paid={c.paid} /></td>
      <td style={{ ...tdStyle, textAlign: "center" }}>
        <span style={{ color: c.paidInIndia ? "#4ADE80" : "#64748B", fontSize: 13 }}>{c.paidInIndia ? "✓" : "—"}</span>
      </td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#94A3B8" }}>{c.paymentMethod}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#F87171" }}>{usd(c.expenses)}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap", fontWeight: 700, color: profit >= 0 ? "#4ADE80" : "#F87171" }}>
        {profit >= 0 ? "+" : ""}{usd(profit)}
      </td>
      <td style={tdStyle}><StatusBadge status={c.status} /></td>
      <td style={{ ...tdStyle, color: "#94A3B8" }}>{c.createdBy}</td>
      <td style={tdStyle}>
        <div style={{ display: "flex", gap: 3 }}>
          <ActionBtn title="Edit" color="#60A5FA" onClick={() => onEdit(c)}><Pencil size={13} /></ActionBtn>
          {canDelete && <ActionBtn title="Delete" color="#F87171" onClick={() => onDelete(c.id)}><Trash2 size={13} /></ActionBtn>}
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ children, title, color, onClick }: { children: React.ReactNode; title: string; color: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#0F172A" : "none", border: "none", borderRadius: 6, padding: "4px 5px", cursor: "pointer", color: h ? color : "#475569", display: "flex", alignItems: "center", transition: "color 0.15s, background 0.15s" }}>
      {children}
    </button>
  );
}

function FLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 12 }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      {children}
    </label>
  );
}

const thStyle: React.CSSProperties = { padding: "10px 12px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "11px 12px", color: "#E2E8F0", verticalAlign: "middle" };
const minp: React.CSSProperties = { background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "8px 12px", outline: "none", width: "100%", colorScheme: "dark" };
const fi: React.CSSProperties = { background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };

const selectStyle: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "6px 10px", cursor: "pointer", height: 36, outline: "none", width: 90, colorScheme: "dark" };
const navBtn: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#94A3B8", fontSize: 13, fontWeight: 500, padding: "7px 14px", cursor: "pointer", height: 36 };
const newBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "7px 14px", cursor: "pointer", height: 36, display: "flex", alignItems: "center", gap: 5 };
const exportBtn: React.CSSProperties = { background: "#14532D", border: "1px solid #166534", borderRadius: 8, color: "#4ADE80", fontSize: 13, fontWeight: 600, padding: "7px 14px", cursor: "pointer", height: 36, display: "flex", alignItems: "center", gap: 5 };
