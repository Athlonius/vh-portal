"use client";

import { useState } from "react";
import { TOUR_TYPES, GEORGIAN_CITIES, type Tour, type TourType, type TourStatus } from "./mockTours";
import { Overlay, ModalHeader, Section, Field, ModalFooter, inp } from "../drivers/AddDriverModal";

interface Props { onClose: () => void; onSave: (t: Omit<Tour, "id">) => void; }

export default function AddTourModal({ onClose, onSave }: Props) {
  const [f, setF] = useState({
    name: "", type: "Tour" as TourType,
    fromCity: "Tbilisi", toCity: "Tbilisi",
    duration: "", description: "", status: "Active" as TourStatus,
  });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Add New Tour / Transfer" sub="Add a new service item for the request tour box." onClose={onClose} />
      <form onSubmit={(e) => { e.preventDefault(); onSave(f); onClose(); }} style={{ padding: 24 }}>
        <Section label="Tour Details">
          <Field label="Tour Name" required full><input required value={f.name} onChange={(e) => set("name", e.target.value)} style={inp} placeholder="e.g. Tbilisi City Tour" /></Field>
          <Field label="Type" required>
            <select value={f.type} onChange={(e) => set("type", e.target.value as TourType)} style={{ ...inp, cursor: "pointer" }}>
              {TOUR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Duration"><input value={f.duration} onChange={(e) => set("duration", e.target.value)} style={inp} placeholder="e.g. Full Day (8h)" /></Field>
          <Field label="From City">
            <select value={f.fromCity} onChange={(e) => set("fromCity", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              {GEORGIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="To City">
            <select value={f.toCity} onChange={(e) => set("toCity", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              {GEORGIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={f.status} onChange={(e) => set("status", e.target.value as TourStatus)} style={{ ...inp, cursor: "pointer" }}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </Field>
          <Field label="Description" full>
            <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Brief description..." style={{ ...inp, resize: "vertical", lineHeight: 1.5 }} />
          </Field>
        </Section>
        <ModalFooter onClose={onClose} label="Save Tour" />
      </form>
    </Overlay>
  );
}
