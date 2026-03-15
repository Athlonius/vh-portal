"use client";

import { useState } from "react";
import { ALL_LANGUAGES, ALL_REGIONS, ALL_SPECIALTIES, type Guide, type GuideStatus } from "./mockGuides";
import CheckboxGroup from "../shared/CheckboxGroup";
import { Overlay, ModalHeader, Section, Field, ActiveToggle, ModalFooter, inp } from "../drivers/AddDriverModal";

interface Props { onClose: () => void; onSave: (g: Omit<Guide, "id">) => void; }

export default function AddGuideModal({ onClose, onSave }: Props) {
  const [f, setF] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    status: "Active" as GuideStatus,
    languages: [] as string[], regions: [] as string[], specialties: [] as string[],
    active: true, notes: "",
  });
  const set = (k: keyof typeof f, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Add New Guide" sub="Fill in guide details and expertise." onClose={onClose} />
      <form onSubmit={(e) => { e.preventDefault(); onSave(f); onClose(); }} style={{ padding: 24 }}>
        <Section label="Personal Information">
          <Field label="First Name" required><input required value={f.firstName} onChange={(e) => set("firstName", e.target.value)} style={inp} placeholder="First name" /></Field>
          <Field label="Last Name" required><input required value={f.lastName} onChange={(e) => set("lastName", e.target.value)} style={inp} placeholder="Last name" /></Field>
          <Field label="Phone"><input value={f.phone} onChange={(e) => set("phone", e.target.value)} style={inp} placeholder="+995 5XX XXX XXX" /></Field>
          <Field label="Email"><input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} style={inp} placeholder="guide@email.com" /></Field>
          <Field label="Status">
            <select value={f.status} onChange={(e) => set("status", e.target.value as GuideStatus)} style={{ ...inp, cursor: "pointer" }}>
              {["Active","Inactive","On Leave"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </Section>

        <Section label="Languages, Regions & Specialties">
          <CheckboxGroup label="Languages" options={ALL_LANGUAGES} selected={f.languages} onChange={(v) => set("languages", v)} />
          <CheckboxGroup label="Regions" options={ALL_REGIONS} selected={f.regions} onChange={(v) => set("regions", v)} />
          <CheckboxGroup label="Specialties" options={ALL_SPECIALTIES} selected={f.specialties} onChange={(v) => set("specialties", v)} />
        </Section>

        <Section label="Notes">
          <textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any additional notes..." rows={3}
            style={{ ...inp, width: "100%", resize: "vertical", lineHeight: 1.5, gridColumn: "1 / -1" }} />
        </Section>

        <ActiveToggle active={f.active} onChange={(v) => set("active", v)} />
        <ModalFooter onClose={onClose} label="Save Guide" />
      </form>
    </Overlay>
  );
}
