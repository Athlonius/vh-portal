"use client";

import { useState } from "react";
import { EXTRA_CITIES, CALCULATE_TYPES, SERVICE_TYPES, type Extra, type ExtraCurrency, type ExtraCalculateType, type ExtraServiceType, type ExtraStatus } from "./mockExtras";
import { Overlay, ModalHeader, Section, Field, ModalFooter, inp } from "../drivers/AddDriverModal";

interface Props { onClose: () => void; onSave: (e: Omit<Extra, "id">) => void; }

export default function AddExtraModal({ onClose, onSave }: Props) {
  const [f, setF] = useState({
    serviceName: "", city: "Tbilisi",
    price: "", currency: "GEL" as ExtraCurrency,
    calculateType: "Per Person" as ExtraCalculateType,
    serviceType: "Entrance Fee" as ExtraServiceType,
    ageFrom: "", ageTo: "",
    status: "Active" as ExtraStatus,
  });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Add Extra / Entry Fee" sub="Add a new service item for request inclusions." onClose={onClose} />
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({
          serviceName: f.serviceName, city: f.city,
          price: parseFloat(f.price) || 0, currency: f.currency,
          calculateType: f.calculateType, serviceType: f.serviceType,
          ageFrom: f.ageFrom ? parseInt(f.ageFrom) : null,
          ageTo: f.ageTo ? parseInt(f.ageTo) : null,
          status: f.status,
        });
        onClose();
      }} style={{ padding: 24 }}>
        <Section label="Service Details">
          <Field label="Service Name" required full>
            <input required value={f.serviceName} onChange={(e) => set("serviceName", e.target.value)} style={inp} placeholder="e.g. Cable Car Ride" />
          </Field>
          <Field label="City" required>
            <select value={f.city} onChange={(e) => set("city", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              {EXTRA_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Service Type">
            <select value={f.serviceType} onChange={(e) => set("serviceType", e.target.value as ExtraServiceType)} style={{ ...inp, cursor: "pointer" }}>
              {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </Section>

        <Section label="Pricing">
          <Field label="Price" required>
            <input required type="number" min="0" step="0.01" value={f.price} onChange={(e) => set("price", e.target.value)} style={inp} placeholder="0.00" />
          </Field>
          <Field label="Currency">
            <div style={{ display: "flex", gap: 8 }}>
              {(["GEL", "USD"] as ExtraCurrency[]).map((c) => (
                <button key={c} type="button" onClick={() => set("currency", c)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: f.currency === c ? "none" : "1px solid #334155",
                  background: f.currency === c ? (c === "GEL" ? "#0D2E1A" : "#1E3A5F") : "transparent",
                  color: f.currency === c ? (c === "GEL" ? "#4ADE80" : "#60A5FA") : "#64748B",
                }}>
                  {c === "GEL" ? "₾ GEL" : "$ USD"}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Calculate Type" full>
            <select value={f.calculateType} onChange={(e) => set("calculateType", e.target.value as ExtraCalculateType)} style={{ ...inp, cursor: "pointer" }}>
              {CALCULATE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </Section>

        <Section label="Age Restriction (optional)">
          <Field label="Age From">
            <input type="number" min="0" max="120" value={f.ageFrom} onChange={(e) => set("ageFrom", e.target.value)} style={inp} placeholder="Min age (leave blank for all)" />
          </Field>
          <Field label="Age To">
            <input type="number" min="0" max="120" value={f.ageTo} onChange={(e) => set("ageTo", e.target.value)} style={inp} placeholder="Max age (leave blank for no limit)" />
          </Field>
        </Section>

        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Status:</span>
          {(["Active", "Inactive"] as ExtraStatus[]).map((s) => (
            <button key={s} type="button" onClick={() => set("status", s)} style={{
              padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: f.status === s ? "none" : "1px solid #334155",
              background: f.status === s ? (s === "Active" ? "#0D2E1A" : "#3B0F0F") : "transparent",
              color: f.status === s ? (s === "Active" ? "#4ADE80" : "#F87171") : "#64748B",
            }}>{s}</button>
          ))}
        </div>

        <ModalFooter onClose={onClose} label="Save Extra" />
      </form>
    </Overlay>
  );
}
