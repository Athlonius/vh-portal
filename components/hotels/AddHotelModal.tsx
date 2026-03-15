"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { GEORGIAN_CITIES, type Hotel, type HotelStars, type HotelStatus } from "./mockHotels";

interface Props {
  onClose: () => void;
  onSave: (hotel: Omit<Hotel, "id">) => void;
}

const STARS_OPTIONS: HotelStars[] = ["Boutique", "3", "4", "5"];

const blank = {
  name: "", stars: "4" as HotelStars, country: "Georgia", city: "Tbilisi",
  address: "", email: "", phone: "", contactPerson: "",
  contactPhone: "+995 ", contactPosition: "", contactEmail: "",
  status: "Active" as HotelStatus,
};

export default function AddHotelModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...blank });

  const set = (key: keyof typeof blank, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1E293B", border: "1px solid #334155", borderRadius: 16,
          width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Modal header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #334155" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#F8FAFC" }}>Add New Hotel</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748B" }}>Fill in the hotel details below.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4, display: "flex", borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Hotel Name" required style={{ gridColumn: "1 / -1" }}>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Rooms Hotel Tbilisi" style={inp} />
            </Field>

            <Field label="Stars / Category" required>
              <select value={form.stars} onChange={(e) => set("stars", e.target.value as HotelStars)} style={{ ...inp, cursor: "pointer" }}>
                {STARS_OPTIONS.map((s) => <option key={s} value={s}>{s === "Boutique" ? "✦ Boutique" : `${s} Stars`}</option>)}
              </select>
            </Field>

            <Field label="Country">
              <input value={form.country} onChange={(e) => set("country", e.target.value)} style={inp} />
            </Field>

            <Field label="City" required>
              <select value={form.city} onChange={(e) => set("city", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                {GEORGIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Address" style={{ gridColumn: "1 / -1" }}>
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, City, Postal Code" style={inp} />
            </Field>

            <Field label="Hotel Email">
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="reservations@hotel.com" style={inp} />
            </Field>

            <Field label="Hotel Phone">
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+995 32 XXX XXXX" style={inp} />
            </Field>

            {/* Divider */}
            <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #334155", paddingTop: 4 }}>
              <p style={{ margin: 0, fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Contact Person</p>
            </div>

            <Field label="Full Name">
              <input value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} placeholder="Full name" style={inp} />
            </Field>

            <Field label="Position">
              <input value={form.contactPosition} onChange={(e) => set("contactPosition", e.target.value)} placeholder="e.g. Reservations Manager" style={inp} />
            </Field>

            <Field label="Contact Phone">
              <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+995 5XX XXX XXX" style={inp} />
            </Field>

            <Field label="Contact Email">
              <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="name@hotel.com" style={inp} />
            </Field>

            {/* Status toggle */}
            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
              <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Status:</span>
              {(["Active", "Not Operational"] as HotelStatus[]).map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => set("status", s)}
                  style={{
                    padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: form.status === s ? "none" : "1px solid #334155",
                    background: form.status === s ? (s === "Active" ? "#0D2E1A" : "#3B0F0F") : "transparent",
                    color: form.status === s ? (s === "Active" ? "#4ADE80" : "#F87171") : "#64748B",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8, paddingTop: 20, borderTop: "1px solid #334155" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Save Hotel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required, style }: { label: string; children: React.ReactNode; required?: boolean; style?: React.CSSProperties }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}{required && <span style={{ color: "#F87171", marginLeft: 2 }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const inp: React.CSSProperties = {
  background: "#0F172A", border: "1px solid #334155", borderRadius: 8,
  color: "#F8FAFC", fontSize: 13, padding: "8px 12px", outline: "none",
  width: "100%", colorScheme: "dark",
};
