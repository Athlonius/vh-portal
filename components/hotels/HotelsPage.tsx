"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, CalendarDays, DollarSign, BedDouble, X, Minus } from "lucide-react";
import { mockHotels, GEORGIAN_CITIES, type Hotel, type HotelStars, type HotelStatus } from "./mockHotels";
import StarsDisplay from "./StarsDisplay";
import AddHotelModal from "./AddHotelModal";

// ── Types ──────────────────────────────────────────────────────────────
interface DateRange { from: string; to: string; }
interface Season { id: number; name: string; ranges: DateRange[]; minNights: number; blackout: boolean; }
interface RoomCategory { id: number; name: string; code: string; maxOccupancy: number; adultsBaseRate: number; extraBedsAllowed: boolean; roomSize: number; bedType: string; status: "Active" | "Inactive"; }
interface HotelRate { id: number; seasonId: number; roomCategoryId: number; boardBasis: "RO" | "BB" | "HB" | "FB"; sgl: number; dbl: number; trpl: number; quad: number; extraAdult: number; cwb: number; cnb: number; }

// ── Shared modal bits ──────────────────────────────────────────────────
const BOARD_BASIS = ["RO", "BB", "HB", "FB"] as const;
const BED_TYPES = ["Twin", "Double", "King", "Queen", "Sofa Bed", "Bunk"];

function Overlay({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: wide ? 760 : 580, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        {children}
      </div>
    </div>
  );
}

function ModalHead({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #334155", position: "sticky", top: 0, background: "#1E293B", zIndex: 1 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{title}</h2>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>{sub}</p>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}><X size={18} /></button>
    </div>
  );
}

const inp: React.CSSProperties = { background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", width: "100%", colorScheme: "dark" };
const numInp: React.CSSProperties = { ...inp, width: 80, textAlign: "right" };

function Lbl({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ fontSize: 10, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      {children}
    </label>
  );
}

// ── SEASONS MODAL ──────────────────────────────────────────────────────
function SeasonsModal({ hotelName, seasons, onSave, onClose }: { hotelName: string; seasons: Season[]; onSave: (s: Season[]) => void; onClose: () => void }) {
  const [list, setList] = useState<Season[]>(seasons);
  const [form, setForm] = useState({ name: "", ranges: [{ from: "", to: "" }] as DateRange[], minNights: 1, blackout: false });
  const setF = (k: keyof typeof form, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const addRange = () => setForm((p) => ({ ...p, ranges: [...p.ranges, { from: "", to: "" }] }));
  const removeRange = (i: number) => { if (i === 0) return; setForm((p) => ({ ...p, ranges: p.ranges.filter((_, idx) => idx !== i) })); };
  const setRange = (i: number, k: keyof DateRange, v: string) => setForm((p) => ({ ...p, ranges: p.ranges.map((r, idx) => idx === i ? { ...r, [k]: v } : r) }));

  const addSeason = (e: React.FormEvent) => {
    e.preventDefault();
    const newS: Season = { id: Date.now(), ...form };
    const updated = [...list, newS];
    setList(updated);
    setForm({ name: "", ranges: [{ from: "", to: "" }], minNights: 1, blackout: false });
    onSave(updated);
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHead title={`Seasons — ${hotelName}`} sub="Manage season periods and blackout dates." onClose={onClose} />
      <div style={{ padding: 24 }}>
        {/* Existing seasons */}
        {list.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Saved Seasons</p>
            {list.map((s) => (
              <div key={s.id} style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 600, color: s.blackout ? "#F87171" : "#4ADE80", fontSize: 13 }}>{s.name}</span>
                  {s.blackout && <span style={{ marginLeft: 8, fontSize: 10, background: "#3B0F0F", color: "#F87171", padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>BLACKOUT</span>}
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>
                    {s.ranges.map((r, i) => <span key={i} style={{ marginRight: 8 }}>{r.from} → {r.to}</span>)}
                    · Min {s.minNights} nights
                  </div>
                </div>
                <button onClick={() => { const u = list.filter((x) => x.id !== s.id); setList(u); onSave(u); }} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}><X size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Add new season form */}
        <form onSubmit={addSeason}>
          <p style={{ margin: "0 0 14px", fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", borderTop: list.length > 0 ? "1px solid #334155" : "none", paddingTop: list.length > 0 ? 16 : 0 }}>Add Season</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <Lbl label="Season Name" full>
              <input required value={form.name} onChange={(e) => setF("name", e.target.value)} style={inp} placeholder="e.g. High Season 2026" />
            </Lbl>
            <Lbl label="Minimum Nights">
              <input type="number" min="1" value={form.minNights} onChange={(e) => setF("minNights", parseInt(e.target.value) || 1)} style={{ ...inp, width: 100 }} />
            </Lbl>
            <Lbl label="Blackout Period">
              <div style={{ display: "flex", gap: 8 }}>
                {[false, true].map((v) => (
                  <button key={String(v)} type="button" onClick={() => setF("blackout", v)}
                    style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: form.blackout === v ? "none" : "1px solid #334155", background: form.blackout === v ? (v ? "#3B0F0F" : "#0D2E1A") : "transparent", color: form.blackout === v ? (v ? "#F87171" : "#4ADE80") : "#64748B" }}>
                    {v ? "Yes (Blackout)" : "No"}
                  </button>
                ))}
              </div>
            </Lbl>
          </div>

          {/* Date ranges */}
          <p style={{ margin: "0 0 8px", fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Date Ranges</p>
          {form.ranges.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <input type="date" value={r.from} onChange={(e) => setRange(i, "from", e.target.value)} style={{ ...inp, width: 150, colorScheme: "dark" }} />
              <span style={{ color: "#64748B" }}>→</span>
              <input type="date" value={r.to} onChange={(e) => setRange(i, "to", e.target.value)} style={{ ...inp, width: 150, colorScheme: "dark" }} />
              {i > 0 && (
                <button type="button" onClick={() => removeRange(i)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}><Minus size={15} /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={addRange} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px dashed #334155", borderRadius: 8, color: "#64748B", fontSize: 12, padding: "6px 14px", cursor: "pointer", marginBottom: 20 }}>
            <Plus size={12} /> Add Range
          </button>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: "1px solid #334155" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Close</button>
            <button type="submit" style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add Season</button>
          </div>
        </form>
      </div>
    </Overlay>
  );
}

// ── ROOM CATEGORIES MODAL ──────────────────────────────────────────────
function RoomCategoriesModal({ hotelName, rooms, onSave, onClose }: { hotelName: string; rooms: RoomCategory[]; onSave: (r: RoomCategory[]) => void; onClose: () => void }) {
  const [list, setList] = useState<RoomCategory[]>(rooms);
  const [form, setForm] = useState<Omit<RoomCategory, "id">>({ name: "", code: "", maxOccupancy: 2, adultsBaseRate: 0, extraBedsAllowed: false, roomSize: 0, bedType: "Twin", status: "Active" });
  const setF = (k: keyof typeof form, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const addRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newR: RoomCategory = { id: Date.now(), ...form };
    const updated = [...list, newR];
    setList(updated);
    setForm({ name: "", code: "", maxOccupancy: 2, adultsBaseRate: 0, extraBedsAllowed: false, roomSize: 0, bedType: "Twin", status: "Active" });
    onSave(updated);
  };

  return (
    <Overlay onClose={onClose} wide>
      <ModalHead title={`Room Categories — ${hotelName}`} sub="Manage room types and base rates." onClose={onClose} />
      <div style={{ padding: 24 }}>
        {list.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Saved Room Categories</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                    {["Name", "Code", "Max Occ.", "Base Rate", "Extra Beds", "Size (m²)", "Bed Type", "Status", ""].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#64748B", fontSize: 10, fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #1E293B" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: "#F8FAFC" }}>{r.name}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8" }}>{r.code}</td>
                      <td style={{ padding: "8px 10px", textAlign: "center", color: "#E2E8F0" }}>{r.maxOccupancy}</td>
                      <td style={{ padding: "8px 10px", color: "#4ADE80", fontWeight: 600 }}>₾ {r.adultsBaseRate}</td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}><span style={{ color: r.extraBedsAllowed ? "#4ADE80" : "#64748B" }}>{r.extraBedsAllowed ? "✓" : "—"}</span></td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8" }}>{r.roomSize}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8" }}>{r.bedType}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: r.status === "Active" ? "#4ADE80" : "#64748B" }}>{r.status}</span>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <button onClick={() => { const u = list.filter((x) => x.id !== r.id); setList(u); onSave(u); }} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}><X size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <form onSubmit={addRoom}>
          <p style={{ margin: "0 0 14px", fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", borderTop: list.length > 0 ? "1px solid #334155" : "none", paddingTop: list.length > 0 ? 16 : 0 }}>Add Room Category</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Lbl label="Name" full><input required value={form.name} onChange={(e) => setF("name", e.target.value)} style={inp} placeholder="e.g. Deluxe Room" /></Lbl>
            <Lbl label="Code"><input required value={form.code} onChange={(e) => setF("code", e.target.value)} style={inp} placeholder="e.g. DLX" /></Lbl>
            <Lbl label="Max Occupancy"><input type="number" min="1" value={form.maxOccupancy} onChange={(e) => setF("maxOccupancy", parseInt(e.target.value) || 1)} style={numInp} /></Lbl>
            <Lbl label="Adults Base Rate (₾)"><input type="number" min="0" value={form.adultsBaseRate} onChange={(e) => setF("adultsBaseRate", parseFloat(e.target.value) || 0)} style={numInp} /></Lbl>
            <Lbl label="Room Size (m²)"><input type="number" min="0" value={form.roomSize} onChange={(e) => setF("roomSize", parseFloat(e.target.value) || 0)} style={numInp} /></Lbl>
            <Lbl label="Bed Type">
              <select value={form.bedType} onChange={(e) => setF("bedType", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                {BED_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Lbl>
          </div>
          <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 10, color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Extra Beds Allowed</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[true, false].map((v) => (
                  <button key={String(v)} type="button" onClick={() => setF("extraBedsAllowed", v)}
                    style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: form.extraBedsAllowed === v ? "none" : "1px solid #334155", background: form.extraBedsAllowed === v ? (v ? "#0D2E1A" : "#3B0F0F") : "transparent", color: form.extraBedsAllowed === v ? (v ? "#4ADE80" : "#F87171") : "#64748B" }}>
                    {v ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 10, color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Status</p>
              <div style={{ display: "flex", gap: 6 }}>
                {(["Active", "Inactive"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setF("status", s)}
                    style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: form.status === s ? "none" : "1px solid #334155", background: form.status === s ? (s === "Active" ? "#0D2E1A" : "#3B0F0F") : "transparent", color: form.status === s ? (s === "Active" ? "#4ADE80" : "#F87171") : "#64748B" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: "1px solid #334155" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Close</button>
            <button type="submit" style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#166534", color: "#4ADE80", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add Room Category</button>
          </div>
        </form>
      </div>
    </Overlay>
  );
}

// ── RATES MODAL ─────────────────────────────────────────────────────────
function RatesModal({ hotelName, seasons, rooms, rates, onSave, onClose }: { hotelName: string; seasons: Season[]; rooms: RoomCategory[]; rates: HotelRate[]; onSave: (r: HotelRate[]) => void; onClose: () => void }) {
  const [list, setList] = useState<HotelRate[]>(rates);
  const [form, setForm] = useState({ seasonId: seasons[0]?.id ?? 0, roomCategoryId: rooms[0]?.id ?? 0, boardBasis: "BB" as typeof BOARD_BASIS[number], sgl: 0, dbl: 0, trpl: 0, quad: 0, extraAdult: 0, cwb: 0, cnb: 0 });
  const setF = (k: keyof typeof form, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const addRate = (e: React.FormEvent) => {
    e.preventDefault();
    const newR: HotelRate = { id: Date.now(), ...form };
    const updated = [...list, newR];
    setList(updated);
    onSave(updated);
  };

  const getSeasonName = (id: number) => seasons.find((s) => s.id === id)?.name ?? "—";
  const getRoomCode = (id: number) => rooms.find((r) => r.id === id)?.code ?? "—";

  return (
    <Overlay onClose={onClose} wide>
      <ModalHead title={`Rates — ${hotelName}`} sub="Manage seasonal room rates." onClose={onClose} />
      <div style={{ padding: 24 }}>
        {list.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Saved Rates</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                    {["Season", "Room", "Board", "SGL", "DBL", "TRPL", "QUAD", "Ext. Adult", "CWB", "CNB", ""].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#64748B", fontSize: 10, fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #1E293B" }}>
                      <td style={{ padding: "8px 10px", color: "#60A5FA", fontWeight: 600 }}>{getSeasonName(r.seasonId)}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8" }}>{getRoomCode(r.roomCategoryId)}</td>
                      <td style={{ padding: "8px 10px" }}><span style={{ background: "#1E3A5F", color: "#60A5FA", padding: "1px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{r.boardBasis}</span></td>
                      {[r.sgl, r.dbl, r.trpl, r.quad, r.extraAdult, r.cwb, r.cnb].map((v, i) => (
                        <td key={i} style={{ padding: "8px 10px", color: "#4ADE80", fontWeight: 600 }}>₾ {v}</td>
                      ))}
                      <td style={{ padding: "8px 10px" }}>
                        <button onClick={() => { const u = list.filter((x) => x.id !== r.id); setList(u); onSave(u); }} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}><X size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {seasons.length === 0 || rooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#64748B", fontSize: 13 }}>
            {seasons.length === 0 ? "⚠ Add seasons first before adding rates." : "⚠ Add room categories first before adding rates."}
          </div>
        ) : (
          <form onSubmit={addRate}>
            <p style={{ margin: "0 0 14px", fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", borderTop: list.length > 0 ? "1px solid #334155" : "none", paddingTop: list.length > 0 ? 16 : 0 }}>Add Rate</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <Lbl label="Season">
                <select value={form.seasonId} onChange={(e) => setF("seasonId", parseInt(e.target.value))} style={{ ...inp, cursor: "pointer" }}>
                  {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Lbl>
              <Lbl label="Room Category">
                <select value={form.roomCategoryId} onChange={(e) => setF("roomCategoryId", parseInt(e.target.value))} style={{ ...inp, cursor: "pointer" }}>
                  {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.code})</option>)}
                </select>
              </Lbl>
            </div>
            <Lbl label="Board Basis">
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {BOARD_BASIS.map((b) => (
                  <button key={b} type="button" onClick={() => setF("boardBasis", b)}
                    style={{ padding: "6px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: form.boardBasis === b ? "none" : "1px solid #334155", background: form.boardBasis === b ? "#1E3A5F" : "transparent", color: form.boardBasis === b ? "#60A5FA" : "#64748B" }}>
                    {b}
                  </button>
                ))}
              </div>
            </Lbl>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginBottom: 16 }}>
              {(["sgl", "dbl", "trpl", "quad", "extraAdult", "cwb", "cnb"] as const).map((k) => (
                <Lbl key={k} label={k === "extraAdult" ? "Ext. Adult" : k.toUpperCase()}>
                  <input type="number" min="0" value={form[k]} onChange={(e) => setF(k, parseFloat(e.target.value) || 0)} style={{ ...inp, textAlign: "right" }} />
                </Lbl>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: "1px solid #334155" }}>
              <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Close</button>
              <button type="submit" style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add Rate</button>
            </div>
          </form>
        )}
      </div>
    </Overlay>
  );
}

// ── FILTER CONSTANTS ────────────────────────────────────────────────────
const STARS_FILTER: ("All" | HotelStars)[] = ["All", "Boutique", "3", "4", "5"];
const STATUS_FILTER: ("All" | HotelStatus)[] = ["All", "Active", "Not Operational"];

// ── MAIN PAGE ───────────────────────────────────────────────────────────
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
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>Manage, review, and add new hotels for your team.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtn}>
          <Plus size={15} strokeWidth={2.5} />Add New Hotel
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hotel name..." style={{ ...filterInput, paddingLeft: 30, width: 200 }} />
        </div>
        <select value={city} onChange={(e) => setCity(e.target.value)} style={{ ...filterInput, cursor: "pointer", width: 140 }}>
          <option value="All">All Cities</option>
          {GEORGIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={stars} onChange={(e) => setStars(e.target.value as typeof stars)} style={{ ...filterInput, cursor: "pointer", width: 130 }}>
          {STARS_FILTER.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Stars" : s === "Boutique" ? "✦ Boutique" : `${s} Stars`}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} style={{ ...filterInput, cursor: "pointer", width: 150 }}>
          {STATUS_FILTER.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>
        {hasFilters && (
          <button onClick={() => { setSearch(""); setCity("All"); setStars("All"); setStatus("All"); }}
            style={{ background: "none", border: "1px solid #475569", borderRadius: 8, color: "#94A3B8", fontSize: 12, padding: "7px 12px", cursor: "pointer", height: 36 }}>
            Clear
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B" }}>{filtered.length} hotel{filtered.length !== 1 ? "s" : ""}</span>
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
                <tr><td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>No hotels match your filters.</td></tr>
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

      {showModal && <AddHotelModal onClose={() => setShowModal(false)} onSave={addHotel} />}
    </div>
  );
}

// ── HOTEL ROW WITH PER-ROW MODAL STATE ──────────────────────────────────
function HotelRow({ hotel, index, onDelete }: { hotel: Hotel; index: number; onDelete: (id: number) => void }) {
  const [hov, setHov] = useState(false);
  const [seasonsOpen, setSeasonsOpen] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [ratesOpen, setRatesOpen] = useState(false);

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [rooms, setRooms] = useState<RoomCategory[]>([]);
  const [rates, setRates] = useState<HotelRate[]>([]);

  return (
    <>
      <tr
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}
      >
        <td style={tdStyle}>{index}</td>
        <td style={tdStyle}>
          <div style={{ fontWeight: 600, color: "#F8FAFC" }}>{hotel.name}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{hotel.address}</div>
        </td>
        <td style={tdStyle}><StarsDisplay stars={hotel.stars} /></td>
        <td style={{ ...tdStyle, color: "#94A3B8" }}>{hotel.city}</td>
        <td style={tdStyle}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: hotel.status === "Active" ? "#0D2E1A" : "#1E293B", color: hotel.status === "Active" ? "#4ADE80" : "#64748B" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: hotel.status === "Active" ? "#22C55E" : "#475569" }} />
            {hotel.status}
          </span>
        </td>
        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "nowrap", alignItems: "center" }}>
            <ActionBtn icon={<CalendarDays size={12} />} label={`Seasons${seasons.length ? ` (${seasons.length})` : ""}`} color="#60A5FA" bg="#1E3A5F" onClick={() => setSeasonsOpen(true)} />
            <ActionBtn icon={<DollarSign size={12} />} label={`Rates${rates.length ? ` (${rates.length})` : ""}`} color="#A78BFA" bg="#2D1B4E" onClick={() => setRatesOpen(true)} />
            <ActionBtn icon={<BedDouble size={12} />} label={`Rooms${rooms.length ? ` (${rooms.length})` : ""}`} color="#34D399" bg="#0D2E1A" onClick={() => setRoomsOpen(true)} />
            <div style={{ width: 1, height: 20, background: "#334155", margin: "0 2px" }} />
            <IconBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IconBtn>
            <IconBtn title="Delete" color="#F87171" onClick={() => onDelete(hotel.id)}><Trash2 size={14} /></IconBtn>
          </div>
        </td>
      </tr>

      {seasonsOpen && <SeasonsModal hotelName={hotel.name} seasons={seasons} onSave={setSeasons} onClose={() => setSeasonsOpen(false)} />}
      {roomsOpen && <RoomCategoriesModal hotelName={hotel.name} rooms={rooms} onSave={setRooms} onClose={() => setRoomsOpen(false)} />}
      {ratesOpen && <RatesModal hotelName={hotel.name} seasons={seasons} rooms={rooms} rates={rates} onSave={setRates} onClose={() => setRatesOpen(false)} />}
    </>
  );
}

function ActionBtn({ icon, label, color, bg, onClick }: { icon: React.ReactNode; label: string; color: string; bg: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 6, border: "none", background: h ? bg : "#0F172A", color: h ? color : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "background 0.15s, color 0.15s", whiteSpace: "nowrap" }}
    >
      {icon}{label}
    </button>
  );
}

function IconBtn({ children, title, color, onClick }: { children: React.ReactNode; title: string; color: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#0F172A" : "none", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", color: h ? color : "#475569", display: "flex", alignItems: "center", transition: "color 0.15s, background 0.15s" }}>
      {children}
    </button>
  );
}

const thStyle: React.CSSProperties = { padding: "11px 16px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "13px 16px", color: "#E2E8F0", verticalAlign: "middle" };
const filterInput: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
