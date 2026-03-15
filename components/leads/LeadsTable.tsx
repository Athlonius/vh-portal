"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, ChevronDown, CheckCheck, Plus } from "lucide-react";
import { mockLeads, type Lead } from "./mockLeads";
import StatusBadge from "../requests/StatusBadge";
import { type RequestStatus } from "../requests/mockData";

const TODAY = "2026-03-14";

const STATUS_OPTIONS: RequestStatus[] = ["In Progress", "Quoted", "Confirmed", "Cancelled", "Lost"];

function fmt(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function daysBetween(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
}

function DaysToArrival({ travelDateFrom }: { travelDateFrom: string }) {
  const days = daysBetween(TODAY, travelDateFrom);
  let color = "#4ADE80";
  let bg = "#0D2E1A";
  if (days < 7) { color = "#F87171"; bg = "#3B0F0F"; }
  else if (days < 30) { color = "#FB923C"; bg = "#3B1A0A"; }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
    </span>
  );
}

function isOverdue(nextFollowUp: string) {
  return nextFollowUp < TODAY;
}

function isDueToday(nextFollowUp: string) {
  return nextFollowUp === TODAY;
}

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [statusMenuId, setStatusMenuId] = useState<number | null>(null);

  const overdue = leads.filter((l) => isOverdue(l.nextFollowUp)).length;
  const dueToday = leads.filter((l) => isDueToday(l.nextFollowUp)).length;

  const markFollowedUp = (id: number) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, lastFollowUpDate: TODAY, lastFollowUpBy: "Admin", nextFollowUp: "" }
          : l
      )
    );
  };

  const changeStatus = (id: number, status: RequestStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setStatusMenuId(null);
  };

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Leads</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>
            Manage active request leads and follow-up reminders.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/confirmations">
            <button style={navBtn}>Confirmations</button>
          </Link>
          <Link href="/requests">
            <button style={navBtn}>Requests</button>
          </Link>
          <button style={newBtn}>
            <Plus size={15} strokeWidth={2.5} />
            New Request
          </button>
        </div>
      </div>

      {/* Counter badges */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <span style={countBadge("#3B0F0F", "#F87171")}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444", display: "inline-block", marginRight: 6 }} />
          Overdue: {overdue}
        </span>
        <span style={countBadge("#3B1A0A", "#FB923C")}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F97316", display: "inline-block", marginRight: 6 }} />
          Due today: {dueToday}
        </span>
      </div>

      {/* Table */}
      <div
        style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}
        onClick={() => setStatusMenuId(null)}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Request #", "Travel Agency", "Agent", "Travel Dates", "Guests",
                  "Status", "Days to Arrival", "Next Follow-up", "Last Follow-up", "Actions"].map((col) => (
                  <th key={col} style={th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => {
                const overduRow = isOverdue(lead.nextFollowUp);
                const todayRow = isDueToday(lead.nextFollowUp);
                return (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    index={i + 1}
                    overdue={overduRow}
                    dueToday={todayRow}
                    statusMenuOpen={statusMenuId === lead.id}
                    onStatusMenuToggle={(e) => {
                      e.stopPropagation();
                      setStatusMenuId((id) => (id === lead.id ? null : lead.id));
                    }}
                    onStatusChange={changeStatus}
                    onFollowedUp={markFollowedUp}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>
            {leads.length} lead{leads.length !== 1 ? "s" : ""} total
          </span>
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  lead: Lead;
  index: number;
  overdue: boolean;
  dueToday: boolean;
  statusMenuOpen: boolean;
  onStatusMenuToggle: (e: React.MouseEvent) => void;
  onStatusChange: (id: number, s: RequestStatus) => void;
  onFollowedUp: (id: number) => void;
}

function LeadRow({ lead, index, overdue, dueToday, statusMenuOpen, onStatusMenuToggle, onStatusChange, onFollowedUp }: RowProps) {
  const [hovered, setHovered] = useState(false);

  let rowBg = "transparent";
  if (overdue) rowBg = hovered ? "#2D1010" : "#200C0C";
  else if (dueToday) rowBg = hovered ? "#2D1E10" : "#1E1508";
  else if (hovered) rowBg = "#162032";

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: "1px solid #1E293B", background: rowBg, transition: "background 0.1s" }}
    >
      <td style={td}>{index}</td>
      <td style={{ ...td, color: "#60A5FA", fontWeight: 600 }}>{lead.requestNumber}</td>
      <td style={td}>{lead.travelAgency}</td>
      <td style={{ ...td, color: "#94A3B8" }}>{lead.agent}</td>
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        {fmt(lead.travelDateFrom)} – {fmt(lead.travelDateTo)}
      </td>
      <td style={{ ...td, textAlign: "center" }}>{lead.guests}</td>
      <td style={td}><StatusBadge status={lead.status} /></td>
      <td style={{ ...td, textAlign: "center" }}>
        <DaysToArrival travelDateFrom={lead.travelDateFrom} />
      </td>
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        {lead.nextFollowUp ? (
          <span style={{ color: overdue ? "#F87171" : dueToday ? "#FB923C" : "#E2E8F0", fontWeight: overdue || dueToday ? 600 : 400 }}>
            {fmt(lead.nextFollowUp)}
            {overdue && <span style={{ marginLeft: 5, fontSize: 10, color: "#F87171", fontWeight: 700 }}>OVERDUE</span>}
            {dueToday && <span style={{ marginLeft: 5, fontSize: 10, color: "#FB923C", fontWeight: 700 }}>TODAY</span>}
          </span>
        ) : (
          <span style={{ color: "#4ADE80", fontSize: 12 }}>✓ Done</span>
        )}
      </td>
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        <div style={{ color: "#E2E8F0" }}>{fmt(lead.lastFollowUpDate)}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{lead.lastFollowUpBy}</div>
      </td>
      <td style={{ ...td }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {/* Edit */}
          <ActionBtn title="Edit" hoverColor="#60A5FA">
            <Pencil size={14} />
          </ActionBtn>

          {/* Followed Up */}
          <button
            title="Mark as followed up"
            onClick={() => onFollowedUp(lead.id)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#0D2E1A", border: "1px solid #166534",
              borderRadius: 6, color: "#4ADE80",
              fontSize: 11, fontWeight: 600,
              padding: "4px 8px", cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <CheckCheck size={12} strokeWidth={2.5} />
            Followed Up
          </button>

          {/* Change Status */}
          <div style={{ position: "relative" }}>
            <button
              title="Change status"
              onClick={onStatusMenuToggle}
              style={{
                display: "flex", alignItems: "center", gap: 3,
                background: "#1E293B", border: "1px solid #334155",
                borderRadius: 6, color: "#94A3B8",
                fontSize: 11, fontWeight: 500,
                padding: "4px 8px", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Status <ChevronDown size={11} />
            </button>
            {statusMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0,
                  background: "#1E293B", border: "1px solid #334155",
                  borderRadius: 8, zIndex: 50, minWidth: 130,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  overflow: "hidden",
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(lead.id, s)}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      background: lead.status === s ? "#0F172A" : "none",
                      border: "none", color: lead.status === s ? "#F8FAFC" : "#94A3B8",
                      fontSize: 12, padding: "8px 12px", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { if (lead.status !== s) e.currentTarget.style.background = "#0F172A"; }}
                    onMouseLeave={(e) => { if (lead.status !== s) e.currentTarget.style.background = "none"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ children, title, hoverColor }: { children: React.ReactNode; title: string; hoverColor: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#0F172A" : "none",
        border: "none", borderRadius: 6,
        padding: "4px 6px", cursor: "pointer",
        color: hov ? hoverColor : "#475569",
        display: "flex", alignItems: "center",
        transition: "color 0.15s, background 0.15s",
      }}
    >
      {children}
    </button>
  );
}

const th: React.CSSProperties = {
  padding: "11px 14px",
  textAlign: "left",
  color: "#64748B",
  fontWeight: 600,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "12px 14px",
  color: "#E2E8F0",
  verticalAlign: "middle",
};

const navBtn: React.CSSProperties = {
  background: "#1E293B", border: "1px solid #334155",
  borderRadius: 8, color: "#94A3B8",
  fontSize: 13, fontWeight: 500,
  padding: "7px 14px", cursor: "pointer", height: 36,
};

const newBtn: React.CSSProperties = {
  background: "#2563EB", border: "none",
  borderRadius: 8, color: "#fff",
  fontSize: 13, fontWeight: 600,
  padding: "7px 16px", cursor: "pointer", height: 36,
  display: "flex", alignItems: "center", gap: 6,
};

function countBadge(bg: string, color: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center",
    padding: "5px 12px", borderRadius: 20,
    background: bg, color,
    fontSize: 12, fontWeight: 700,
    border: `1px solid ${color}33`,
  };
}
