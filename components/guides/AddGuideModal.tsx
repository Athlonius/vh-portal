"use client";

import { useState } from "react";
import { ALL_LANGUAGES, ALL_REGIONS, ALL_SPECIALTIES, type Guide, type GuideStatus } from "./mockGuides";
import CheckboxGroup from "../shared/CheckboxGroup";
import { Overlay, ModalHeader, Section, Field, ActiveToggle, ModalFooter, inp } from "../drivers/AddDriverModal";

interface Props {
  onClose: () => void;
  onSave: (g: Omit<Guide, "id">) => void;
  onUpdate?: (g: Guide) => void;
  guide?: Guide;
}

export default function AddGuideModal({ onClose, onSave, onUpdate, guide }: Props) {
  const isEdit = !!guide;
  const [f, setF] = useState({
    firstName: guide?.firstName ?? "", lastName: guide?.lastName ?? "",
    phone: guide?.phone ?? "", email: guide?.email ?? "",
    status: (guide?.status ?? "Active") as GuideStatus,
    languages: guide?.languages ?? [] as string[],
    regions: guide?.regions ?? [] as string[],
    specialties: guide?.specialties ?? [] as string[],
    active: guide?.active ?? true, notes: guide?.notes ?? "",
  });
  const set = (k: keyof typeof f, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && onUpdate && guide) {
      onUpdate({ ...f, id: guide.id });
    } else {
      onSave(f);
    }
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title={isEdit ? "Edit Guide" : "Add New Guide"} sub="Fill in guide details and expertise." onClose={onClose} />
      <form onSubmit={handleSubmit} style={{ padding: 24 }}>
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
