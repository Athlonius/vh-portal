"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { type HotelBlock, type RoomType, type MealPlan } from "./types";
import { inp, lbl, sel } from "./S1Context";
import { uid, nightsBetween, suggestRooms, hotelSubtotalUsd } from "./utils";
import { mockHotels } from "../../hotels/mockHotels";

const ROOM_TYPES: RoomType[] = ["SGL", "DBL", "TRPL", "QUAD", "QUINT"];
const MEAL_PLANS: MealPlan[] = ["RO", "BB", "HB", "FB"];
const activeHotels = mockHotels.filter((h) => h.status === "Active");

interface Props {
  hotels: HotelBlock[];
  setHotels: (v: HotelBlock[]) => void;
  defaultCheckIn: string;
  defaultCheckOut: string;
  defaultMealPlan: MealPlan;
  adults: number;
  cwb: number;
  gelRate: number;
}

export default function S5Accommodations(p: Props) {
  const addHotel = () => {
    const block: HotelBlock = {
      id: uid(),
      hotelName: "",
      checkIn: p.defaultCheckIn,
      checkOut: p.defaultCheckOut,
      mealPlan: p.defaultMealPlan,
      rooms: suggestRooms(p.adults),
      extraBedRateUsd: 0,
    };
    p.setHotels([...p.hotels, block]);
  };

  const update = (id: string, patch: Partial<HotelBlock>) =>
    p.setHotels(p.hotels.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  const remove = (id: string) => p.setHotels(p.hotels.filter((h) => h.id !== id));

  const totalUsd = p.hotels.reduce((s, h) => s + hotelSubtotalUsd(h), 0);

  return (
    <div>
      {p.hotels.map((hotel, idx) => (
        <HotelBlockCard
          key={hotel.id}
          hotel={hotel}
          idx={idx}
          cwb={p.cwb}
          onUpdate={(patch) => update(hotel.id, patch)}
          onRemove={() => remove(hotel.id)}
        />
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <button type="button" onClick={addHotel}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px dashed #334155", background: "none", color: "#60A5FA", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Add Hotel
        </button>
        {p.hotels.length > 0 && (
          <div style={{ fontSize: 13, color: "#94A3B8" }}>
            Accommodations Total: <span style={{ fontWeight: 700, color: "#4ADE80", fontSize: 15 }}>${totalUsd.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HotelBlockCard({ hotel, idx, cwb, onUpdate, onRemove }: {
  hotel: HotelBlock; idx: number; cwb: number;
  onUpdate: (p: Partial<HotelBlock>) => void; onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  const nights = nightsBetween(hotel.checkIn, hotel.checkOut);
  const subtotal = hotelSubtotalUsd(hotel);

  const toggleRoom = (type: RoomType) => {
    const has = hotel.rooms.find((r) => r.type === type);
    if (has) onUpdate({ rooms: hotel.rooms.filter((r) => r.type !== type) });
    else onUpdate({ rooms: [...hotel.rooms, { type, count: 1, rateUsd: 0 }] });
  };

  const updateRoom = (type: RoomType, field: "count" | "rateUsd", val: number) =>
    onUpdate({ rooms: hotel.rooms.map((r) => r.type === type ? { ...r, [field]: val } : r) });

  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
      {/* Block header */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10, borderBottom: open ? "1px solid #334155" : "none", cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Hotel {idx + 1}</span>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: hotel.hotelName ? "#F8FAFC" : "#475569" }}>
          {hotel.hotelName || "Not selected"}
        </span>
        {nights > 0 && (
          <span style={{ fontSize: 11, color: "#94A3B8", marginRight: 4 }}>
            {nights}N · ${subtotal.toFixed(0)}
          </span>
        )}
        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", padding: 2, display: "flex" }}>
          <Trash2 size={13} />
        </button>
        <span style={{ color: "#475569" }}>{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
      </div>

      {open && (
        <div style={{ padding: 14 }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 120px 1fr", gap: 10, marginBottom: 12 }}>
            <label style={fieldWrap}>
              <span style={lbl}>Hotel</span>
              <select value={hotel.hotelName} onChange={(e) => onUpdate({ hotelName: e.target.value })} style={{ ...sel, background: "#1E293B" }}>
                <option value="">Select hotel…</option>
                {activeHotels.map((h) => <option key={h.id} value={h.name}>{h.name}</option>)}
              </select>
            </label>
            <label style={fieldWrap}>
              <span style={lbl}>Check-in</span>
              <input type="date" value={hotel.checkIn} onChange={(e) => onUpdate({ checkIn: e.target.value })} style={{ ...inp, background: "#1E293B", colorScheme: "dark" }} />
            </label>
            <label style={fieldWrap}>
              <span style={lbl}>Check-out</span>
              <input type="date" value={hotel.checkOut} onChange={(e) => onUpdate({ checkOut: e.target.value })} style={{ ...inp, background: "#1E293B", colorScheme: "dark" }} />
            </label>
            <div style={fieldWrap}>
              <span style={lbl}>Nights</span>
              <div style={{ ...inp, background: "#1E293B", color: nights > 0 ? "#60A5FA" : "#475569", fontWeight: 700, cursor: "default" }}>
                {nights > 0 ? nights : "—"}
              </div>
            </div>
            <label style={fieldWrap}>
              <span style={lbl}>Meal Plan</span>
              <select value={hotel.mealPlan} onChange={(e) => onUpdate({ mealPlan: e.target.value as MealPlan })} style={{ ...sel, background: "#1E293B" }}>
                {MEAL_PLANS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
          </div>

          {/* Room selector */}
          <div style={{ marginBottom: 10 }}>
            <p style={{ ...lbl, marginBottom: 8 }}>Room Types</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {ROOM_TYPES.map((rt) => {
                const active = hotel.rooms.find((r) => r.type === rt);
                return (
                  <button key={rt} type="button" onClick={() => toggleRoom(rt)}
                    style={{ padding: "5px 14px", borderRadius: 6, border: active ? "none" : "1px solid #334155", background: active ? "#1E3A5F" : "transparent", color: active ? "#60A5FA" : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {rt}
                  </button>
                );
              })}
            </div>

            {/* Active room lines */}
            {hotel.rooms.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {hotel.rooms.map((room) => (
                  <div key={room.type} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#1E293B", borderRadius: 8 }}>
                    <span style={{ width: 48, fontSize: 12, fontWeight: 700, color: "#60A5FA" }}>{room.type}</span>
                    <span style={{ fontSize: 11, color: "#64748B" }}>×</span>
                    <input type="number" min="1" value={room.count}
                      onChange={(e) => updateRoom(room.type, "count", parseInt(e.target.value) || 1)}
                      style={{ ...inp, background: "#0F172A", width: 60, textAlign: "center" }} />
                    <span style={{ fontSize: 11, color: "#64748B" }}>rooms @ $</span>
                    <input type="number" min="0" step="0.01" value={room.rateUsd}
                      onChange={(e) => updateRoom(room.type, "rateUsd", parseFloat(e.target.value) || 0)}
                      style={{ ...inp, background: "#0F172A", width: 80 }} placeholder="Rate/night" />
                    <span style={{ fontSize: 11, color: "#64748B" }}>/night</span>
                    {nights > 0 && (
                      <span style={{ marginLeft: "auto", fontSize: 12, color: "#4ADE80", fontWeight: 600 }}>
                        = ${(room.count * room.rateUsd * nights).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CWB extra bed */}
          {cwb > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#1E293B", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#C084FC" }}>Extra Bed</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>×{cwb} CWB @ $</span>
              <input type="number" min="0" step="0.01" value={hotel.extraBedRateUsd}
                onChange={(e) => onUpdate({ extraBedRateUsd: parseFloat(e.target.value) || 0 })}
                style={{ ...inp, background: "#0F172A", width: 80 }} placeholder="Rate/night" />
              <span style={{ fontSize: 11, color: "#64748B" }}>/night</span>
              {nights > 0 && (
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#C084FC", fontWeight: 600 }}>
                  = ${(cwb * hotel.extraBedRateUsd * nights).toFixed(2)}
                </span>
              )}
            </div>
          )}

          {/* Block subtotal */}
          {(hotel.rooms.length > 0 || cwb > 0) && nights > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #334155" }}>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>
                Subtotal: <strong style={{ color: "#4ADE80", marginLeft: 4 }}>${subtotal.toFixed(2)}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5 };
