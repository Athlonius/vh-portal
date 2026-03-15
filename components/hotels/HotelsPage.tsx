"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, CalendarDays, DollarSign, BedDouble } from "lucide-react";
import { mockHotels, GEORGIAN_CITIES, type Hotel, type HotelStars, type HotelStatus } from "./mockHotels";
import StarsDisplay from "./StarsDisplay";
import AddHotelModal from "./AddHotelModal";

const STARS_FILTER: ("All" | HotelStars)[] = ["All", "Boutique", "3", "4", "5"];
const STATUS_FILTER: ("All" | HotelStatus)[] = ["All", "Active", "Not Operational"];

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [stars, setStars] = useState<"All" | HotelStars>("All");
  const [status, setStatus] = useState<"All" | HotelStatus>("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "All" && h.city !== city) return false;
      if (stars !== "All" && h.stars !== stars) return false;
      if (status !== "All" && h.status !== status) return false;
      return true;
    });
  }, [hotels, search, city, stars, status]);

  const addHotel = (data: Omit<Hotel, "id">) => {
    setHotels((prev) => [...prev, { ...data, id: prev.length + 1 }]);
  };

  const deleteHotel = (id: number) => {
    setHotels((prev) => prev.filter((h) => h.id !== id));
  };

  const hasFilters = search || city !== "All" || stars !== "All" || status !== "All";

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Hotels</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>
            Manage, review, and add new hotels for your team.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtn}>
          <Plus size={15} strokeWidth={2.5} />
          Add New Hotel
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotel name..."
            style={{ ...filterInput, paddingLeft: 30, width: 200 }}
          />
        </div>

        {/* City */}
        <select value={city} onChange={(e) => setCity(e.target.value)} style={{ ...filterInput, cursor: "pointer", width: 140 }}>
          <option value="All">All Cities</option>
          {GEORGIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Stars */}
        <select value={stars} onChange={(e) => setStars(e.target.value as typeof stars)} style={{ ...filterInput, cursor: "pointer", width: 130 }}>
          {STARS_FILTER.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Stars" : s === "Boutique" ? "✦ Boutique" : `${s} Stars`}</option>
          ))}
        </select>

        {/* Status */}
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} style={{ ...filterInput, cursor: "pointer", width: 150 }}>
          {STATUS_FILTER.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>

        {hasFilters && (
          <button onClick={() => { setSearch(""); setCity("All"); setStars("All"); setStatus("All"); }}
            style={{ background: "none", border: "1px solid #475569", borderRadius: 8, color: "#94A3B8", fontSize: 12, padding: "7px 12px", cursor: "pointer", height: 36 }}>
            Clear
          </button>
        )}

        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B" }}>
          {filtered.length} hotel{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "Hotel Name", "Stars", "City", "Status", "Actions"].map((col) => (
                  <th key={col} style={thStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>
                    No hotels match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((hotel, i) => (
                  <HotelRow key={hotel.id} hotel={hotel} index={i + 1} onDelete={deleteHotel} />
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>{filtered.length} of {hotels.length} hotels shown</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && <AddHotelModal onClose={() => setShowModal(false)} onSave={addHotel} />}
    </div>
  );
}

function HotelRow({ hotel, index, onDelete }: { hotel: Hotel; index: number; onDelete: (id: number) => void }) {
  const [hov, setHov] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}
    >
      <td style={tdStyle}>{index}</td>

      {/* Hotel Name */}
      <td style={tdStyle}>
        <div style={{ fontWeight: 600, color: "#F8FAFC" }}>{hotel.name}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{hotel.address}</div>
      </td>

      {/* Stars */}
      <td style={tdStyle}><StarsDisplay stars={hotel.stars} /></td>

      {/* City */}
      <td style={{ ...tdStyle, color: "#94A3B8" }}>{hotel.city}, {hotel.country}</td>

      {/* Status */}
      <td style={tdStyle}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: hotel.status === "Active" ? "#0D2E1A" : "#1E293B",
          color: hotel.status === "Active" ? "#4ADE80" : "#64748B",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: hotel.status === "Active" ? "#22C55E" : "#475569" }} />
          {hotel.status}
        </span>
      </td>

      {/* Actions */}
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "nowrap", alignItems: "center" }}>
          <ActionBtn icon={<CalendarDays size={12} />} label="Seasons" color="#60A5FA" bg="#1E3A5F" />
          <ActionBtn icon={<DollarSign size={12} />} label="Rates" color="#A78BFA" bg="#2D1B4E" />
          <ActionBtn icon={<BedDouble size={12} />} label="Room Categories" color="#34D399" bg="#0D2E1A" />
          <div style={{ width: 1, height: 20, background: "#334155", margin: "0 2px" }} />
          <IconBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IconBtn>
          <IconBtn title="Delete (Admin)" color="#F87171" onClick={() => onDelete(hotel.id)}><Trash2 size={14} /></IconBtn>
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ icon, label, color, bg }: { icon: React.ReactNode; label: string; color: string; bg: string }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "4px 9px", borderRadius: 6, border: "none",
        background: h ? bg : "#0F172A",
        color: h ? color : "#64748B",
        fontSize: 11, fontWeight: 600, cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {icon}{label}
    </button>
  );
}

function IconBtn({ children, title, color, onClick }: { children: React.ReactNode; title: string; color: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? "#0F172A" : "none", border: "none", borderRadius: 6,
        padding: "4px 6px", cursor: "pointer",
        color: h ? color : "#475569",
        display: "flex", alignItems: "center",
        transition: "color 0.15s, background 0.15s",
      }}
    >
      {children}
    </button>
  );
}

const thStyle: React.CSSProperties = {
  padding: "11px 16px", textAlign: "left", color: "#64748B",
  fontWeight: 600, fontSize: 11, textTransform: "uppercase",
  letterSpacing: "0.05em", whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "13px 16px", color: "#E2E8F0", verticalAlign: "middle",
};

const filterInput: React.CSSProperties = {
  background: "#1E293B", border: "1px solid #334155", borderRadius: 8,
  color: "#F8FAFC", fontSize: 13, padding: "7px 12px",
  outline: "none", height: 36, colorScheme: "dark",
};

const addBtn: React.CSSProperties = {
  background: "#2563EB", border: "none", borderRadius: 8, color: "#fff",
  fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer",
  height: 38, display: "flex", alignItems: "center", gap: 6,
};
