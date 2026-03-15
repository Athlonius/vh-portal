"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Pencil, Copy, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { mockRequests, type RequestStatus, type Request } from "./mockData";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS: ("All" | RequestStatus)[] = [
  "All", "In Progress", "Quoted", "Confirmed", "Cancelled", "Lost",
];

const PAGE_SIZE = 5;

function fmt(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

const inputStyle: React.CSSProperties = {
  background: "#1E293B",
  border: "1px solid #334155",
  borderRadius: 8,
  color: "#F8FAFC",
  fontSize: 13,
  padding: "7px 12px",
  outline: "none",
  height: 36,
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 11,
  color: "#64748B",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export default function RequestsTable() {
  const [search, setSearch] = useState("");
  const [agency, setAgency] = useState("");
  const [agent, setAgent] = useState("");
  const [status, setStatus] = useState<"All" | RequestStatus>("All");
  const [reqDateFrom, setReqDateFrom] = useState("");
  const [reqDateTo, setReqDateTo] = useState("");
  const [travelDateFrom, setTravelDateFrom] = useState("");
  const [travelDateTo, setTravelDateTo] = useState("");
  const [createdBy, setCreatedBy] = useState("All");
  const [page, setPage] = useState(1);

  const CREATED_BY_OPTIONS = ["All", "Eynur Ahmadov", "Nino Giorgadze", "Lasha Mchedlidze"];

  const filtered = useMemo(() => {
    return mockRequests.filter((r) => {
      if (search && !r.requestNumber.toLowerCase().includes(search.toLowerCase())) return false;
      if (agency && !r.travelAgency.toLowerCase().includes(agency.toLowerCase())) return false;
      if (agent && !r.agent.toLowerCase().includes(agent.toLowerCase())) return false;
      if (status !== "All" && r.status !== status) return false;
      if (reqDateFrom && r.requestDate < reqDateFrom) return false;
      if (reqDateTo && r.requestDate > reqDateTo) return false;
      if (travelDateFrom && r.travelDateFrom < travelDateFrom) return false;
      if (travelDateTo && r.travelDateTo > travelDateTo) return false;
      if (createdBy !== "All" && r.createdBy !== createdBy) return false;
      return true;
    });
  }, [search, agency, agent, status, reqDateFrom, reqDateTo, travelDateFrom, travelDateTo, createdBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const clearFilters = () => {
    setSearch(""); setAgency(""); setAgent(""); setStatus("All");
    setReqDateFrom(""); setReqDateTo(""); setTravelDateFrom(""); setTravelDateTo("");
    setCreatedBy("All"); setPage(1);
  };

  const hasFilters = search || agency || agent || status !== "All" ||
    reqDateFrom || reqDateTo || travelDateFrom || travelDateTo || createdBy !== "All";

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Requests</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>
            Manage, review, and create new requests for your team.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/leads">
            <button style={{ ...navBtnStyle }}>Leads</button>
          </Link>
          <Link href="/confirmations">
            <button style={{ ...navBtnStyle }}>Confirmations</button>
          </Link>
          <Link href="/requests/new">
            <button style={{ ...newBtnStyle }}>
              <Plus size={15} strokeWidth={2.5} />
              New Request
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        {/* Search */}
        <label style={labelStyle}>
          Request #
          <div style={{ position: "relative" }}>
            <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="VH-2025-..."
              style={{ ...inputStyle, paddingLeft: 30, width: 150 }}
            />
          </div>
        </label>

        {/* Agency */}
        <label style={labelStyle}>
          Travel Agency
          <input
            value={agency}
            onChange={(e) => { setAgency(e.target.value); setPage(1); }}
            placeholder="Agency name..."
            style={{ ...inputStyle, width: 170 }}
          />
        </label>

        {/* Agent */}
        <label style={labelStyle}>
          Agent
          <input
            value={agent}
            onChange={(e) => { setAgent(e.target.value); setPage(1); }}
            placeholder="Agent name..."
            style={{ ...inputStyle, width: 140 }}
          />
        </label>

        {/* Status */}
        <label style={labelStyle}>
          Status
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }}
            style={{ ...inputStyle, width: 140, cursor: "pointer" }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        {/* Request Date */}
        <label style={labelStyle}>
          Request Date
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="date"
              value={reqDateFrom}
              onChange={(e) => { setReqDateFrom(e.target.value); setPage(1); }}
              style={{ ...inputStyle, width: 140, colorScheme: "dark" }}
            />
            <span style={{ color: "#64748B", fontSize: 12 }}>–</span>
            <input
              type="date"
              value={reqDateTo}
              onChange={(e) => { setReqDateTo(e.target.value); setPage(1); }}
              style={{ ...inputStyle, width: 140, colorScheme: "dark" }}
            />
          </div>
        </label>

        {/* Travel Date */}
        <label style={labelStyle}>
          Travel Date
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="date"
              value={travelDateFrom}
              onChange={(e) => { setTravelDateFrom(e.target.value); setPage(1); }}
              style={{ ...inputStyle, width: 140, colorScheme: "dark" }}
            />
            <span style={{ color: "#64748B", fontSize: 12 }}>–</span>
            <input
              type="date"
              value={travelDateTo}
              onChange={(e) => { setTravelDateTo(e.target.value); setPage(1); }}
              style={{ ...inputStyle, width: 140, colorScheme: "dark" }}
            />
          </div>
        </label>

        {/* Created By */}
        <label style={labelStyle}>
          Created By
          <select
            value={createdBy}
            onChange={(e) => { setCreatedBy(e.target.value); setPage(1); }}
            style={{ ...inputStyle, width: 160, cursor: "pointer" }}
          >
            {CREATED_BY_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "1px solid #475569", borderRadius: 8,
              color: "#94A3B8", fontSize: 13, padding: "7px 12px", cursor: "pointer",
              height: 36, alignSelf: "flex-end",
            }}
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Request Date", "Request Number", "Travel Dates", "Nights", "Guests",
                  "Travel Agency", "Agent", "Status", "Created By", "Actions"].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "11px 14px",
                      textAlign: "left",
                      color: "#64748B",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>
                    No requests match your filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((r, i) => (
                  <TableRow key={r.id} r={r} index={(currentPage - 1) * PAGE_SIZE + i + 1} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderTop: "1px solid #334155",
          }}
        >
          <span style={{ fontSize: 12, color: "#64748B" }}>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} results
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={14} />
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PageBtn key={p} onClick={() => setPage(p)} active={p === currentPage}>
                {p}
              </PageBtn>
            ))}
            <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight size={14} />
            </PageBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ r, index }: { r: Request; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid #1E293B",
        background: hovered ? "#162032" : "transparent",
        transition: "background 0.1s",
      }}
    >
      <td style={td}>{index}</td>
      <td style={td}>{fmt(r.requestDate)}</td>
      <td style={{ ...td, color: "#60A5FA", fontWeight: 600 }}>{r.requestNumber}</td>
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        {fmt(r.travelDateFrom)} – {fmt(r.travelDateTo)}
      </td>
      <td style={{ ...td, textAlign: "center" }}>{r.nights}</td>
      <td style={{ ...td, textAlign: "center" }}>{r.guests}</td>
      <td style={td}>{r.travelAgency}</td>
      <td style={{ ...td, color: "#94A3B8" }}>{r.agent}</td>
      <td style={td}>
        <StatusBadge status={r.status} />
      </td>
      <td style={{ ...td, color: "#94A3B8" }}>{r.createdBy}</td>
      <td style={td}>
        <div style={{ display: "flex", gap: 4 }}>
          <ActionBtn title="Edit" color="#60A5FA"><Pencil size={14} /></ActionBtn>
          <ActionBtn title="Duplicate" color="#A78BFA"><Copy size={14} /></ActionBtn>
          <ActionBtn title="Delete" color="#F87171"><Trash2 size={14} /></ActionBtn>
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ children, title, color }: { children: React.ReactNode; title: string; color: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#0F172A" : "none",
        border: "none",
        borderRadius: 6,
        padding: "4px 6px",
        cursor: "pointer",
        color: hov ? color : "#475569",
        display: "flex",
        alignItems: "center",
        transition: "color 0.15s, background 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 30,
        height: 30,
        padding: "0 6px",
        borderRadius: 6,
        border: active ? "1px solid #3B82F6" : "1px solid #334155",
        background: active ? "#1E3A5F" : "transparent",
        color: active ? "#60A5FA" : disabled ? "#334155" : "#94A3B8",
        fontSize: 12,
        fontWeight: active ? 700 : 400,
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {children}
    </button>
  );
}

const td: React.CSSProperties = {
  padding: "12px 14px",
  color: "#E2E8F0",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const navBtnStyle: React.CSSProperties = {
  background: "#1E293B",
  border: "1px solid #334155",
  borderRadius: 8,
  color: "#94A3B8",
  fontSize: 13,
  fontWeight: 500,
  padding: "7px 14px",
  cursor: "pointer",
  height: 36,
};

const newBtnStyle: React.CSSProperties = {
  background: "#2563EB",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  padding: "7px 16px",
  cursor: "pointer",
  height: 36,
  display: "flex",
  alignItems: "center",
  gap: 6,
};
