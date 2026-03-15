"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, Copy, Download, Plus } from "lucide-react";
import { mockConfirmations, type ConfirmationStatus } from "./mockConfirmations";

const MONTHS = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const YEARS = ["2024", "2025", "2026", "2027"];

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

export default function ConfirmationsTable() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("All");

  const filtered = useMemo(() => {
    return mockConfirmations.filter((c) => {
      const [cy, cm] = c.start.split("-");
      if (cy !== year) return false;
      if (month !== "All" && parseInt(cm, 10) !== MONTHS.indexOf(month)) return false;
      return true;
    });
  }, [year, month]);

  const totalRevenue = filtered.reduce((s, c) => s + c.revenue, 0);
  const totalExpenses = filtered.reduce((s, c) => s + c.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalPaid = filtered.reduce((s, c) => s + (c.paid ? c.amountPaid : 0), 0);

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Confirmations</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>
            View, filter, and export all confirmed bookings.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Year */}
          <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {/* Month */}
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
                  "Payment", "Expenses", "Profit", "Status", "Created By", "Actions",
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
                filtered.map((c, i) => <ConfirmationRow key={c.id} c={c} index={i + 1} />)
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
    </div>
  );
}

function ConfirmationRow({ c, index }: { c: (typeof mockConfirmations)[0]; index: number }) {
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
          <ActionBtn title="Edit" color="#60A5FA"><Pencil size={13} /></ActionBtn>
          <ActionBtn title="Duplicate" color="#A78BFA"><Copy size={13} /></ActionBtn>
          <ActionBtn title="Delete" color="#F87171"><Trash2 size={13} /></ActionBtn>
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ children, title, color }: { children: React.ReactNode; title: string; color: string }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#0F172A" : "none", border: "none", borderRadius: 6, padding: "4px 5px", cursor: "pointer", color: h ? color : "#475569", display: "flex", alignItems: "center", transition: "color 0.15s, background 0.15s" }}>
      {children}
    </button>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px 12px", textAlign: "left", color: "#64748B",
  fontWeight: 600, fontSize: 10.5, textTransform: "uppercase",
  letterSpacing: "0.05em", whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "11px 12px", color: "#E2E8F0", verticalAlign: "middle",
};

const selectStyle: React.CSSProperties = {
  background: "#1E293B", border: "1px solid #334155", borderRadius: 8,
  color: "#F8FAFC", fontSize: 13, padding: "6px 10px",
  cursor: "pointer", height: 36, outline: "none", width: 90,
  colorScheme: "dark",
};

const navBtn: React.CSSProperties = {
  background: "#1E293B", border: "1px solid #334155", borderRadius: 8,
  color: "#94A3B8", fontSize: 13, fontWeight: 500,
  padding: "7px 14px", cursor: "pointer", height: 36,
};

const newBtn: React.CSSProperties = {
  background: "#2563EB", border: "none", borderRadius: 8, color: "#fff",
  fontSize: 13, fontWeight: 600, padding: "7px 14px", cursor: "pointer",
  height: 36, display: "flex", alignItems: "center", gap: 5,
};

const exportBtn: React.CSSProperties = {
  background: "#14532D", border: "1px solid #166534", borderRadius: 8, color: "#4ADE80",
  fontSize: 13, fontWeight: 600, padding: "7px 14px", cursor: "pointer",
  height: 36, display: "flex", alignItems: "center", gap: 5,
};
