"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ALL_LANGUAGES, ALL_VEHICLES, type Driver, type DriverStatus } from "./mockDrivers";
import CheckboxGroup from "../shared/CheckboxGroup";

interface Props {
  onClose: () => void;
  onSave: (d: Omit<Driver, "id">) => void;
  onUpdate?: (d: Driver) => void;
  driver?: Driver;
}

export default function AddDriverModal({ onClose, onSave, onUpdate, driver }: Props) {
  const isEdit = !!driver;
  const [f, setF] = useState({
    firstName: driver?.firstName ?? "", lastName: driver?.lastName ?? "",
    phone: driver?.phone ?? "", email: driver?.email ?? "",
    status: (driver?.status ?? "Active") as DriverStatus,
    languages: driver?.languages ?? [] as string[],
    vehicleCategories: driver?.vehicleCategories ?? [] as string[],
    carDescription: driver?.carDescription ?? "", plateNumber: driver?.plateNumber ?? "",
    supplierCompany: driver?.supplierCompany ?? "",
    supplierContactName: driver?.supplierContactName ?? "",
    supplierPhone: driver?.supplierPhone ?? "",
    active: driver?.active ?? true, notes: driver?.notes ?? "",
  });
  const set = (k: keyof typeof f, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && onUpdate && driver) {
      onUpdate({ ...f, id: driver.id });
    } else {
      onSave(f);
    }
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title={isEdit ? "Edit Driver" : "Add New Driver"} sub="Fill in driver and vehicle details." onClose={onClose} />
      <form onSubmit={handleSubmit} style={{ padding: 24 }}>
        <Section label="Personal Information">
          <Field label="First Name" required><input required value={f.firstName} onChange={(e) => set("firstName", e.target.value)} style={inp} placeholder="First name" /></Field>
          <Field label="Last Name" required><input required value={f.lastName} onChange={(e) => set("lastName", e.target.value)} style={inp} placeholder="Last name" /></Field>
          <Field label="Phone"><input value={f.phone} onChange={(e) => set("phone", e.target.value)} style={inp} placeholder="+995 5XX XXX XXX" /></Field>
          <Field label="Email"><input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} style={inp} placeholder="driver@email.com" /></Field>
          <Field label="Status">
            <select value={f.status} onChange={(e) => set("status", e.target.value as DriverStatus)} style={{ ...inp, cursor: "pointer" }}>
              {["Active","Inactive","On Leave"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </Section>

        <Section label="Languages & Vehicle Categories">
          <CheckboxGroup label="Languages" options={ALL_LANGUAGES} selected={f.languages} onChange={(v) => set("languages", v)} />
          <CheckboxGroup label="Vehicle Categories" options={ALL_VEHICLES} selected={f.vehicleCategories} onChange={(v) => set("vehicleCategories", v)} />
        </Section>

        <Section label="Vehicle Details">
          <Field label="Car Description" full><input value={f.carDescription} onChange={(e) => set("carDescription", e.target.value)} style={inp} placeholder="e.g. Toyota Land Cruiser, Black, 2022" /></Field>
          <Field label="Plate Number"><input value={f.plateNumber} onChange={(e) => set("plateNumber", e.target.value)} style={inp} placeholder="GEO-XXX-AB" /></Field>
        </Section>

        <Section label="Supplier Information">
          <Field label="Supplier Company" full><input value={f.supplierCompany} onChange={(e) => set("supplierCompany", e.target.value)} style={inp} placeholder="Company name" /></Field>
          <Field label="Contact Name"><input value={f.supplierContactName} onChange={(e) => set("supplierContactName", e.target.value)} style={inp} placeholder="Contact person" /></Field>
          <Field label="Contact Phone"><input value={f.supplierPhone} onChange={(e) => set("supplierPhone", e.target.value)} style={inp} placeholder="+995 5XX XXX XXX" /></Field>
        </Section>

        <Section label="Notes">
          <textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any additional notes..." rows={3}
            style={{ ...inp, width: "100%", resize: "vertical", lineHeight: 1.5, gridColumn: "1 / -1" }} />
        </Section>

        <ActiveToggle active={f.active} onChange={(v) => set("active", v)} />
        <ModalFooter onClose={onClose} label="Save Driver" />
      </form>
    </Overlay>
  );
}

// ── shared modal sub-components ──────────────────────────────────────
export function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 660, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        {children}
      </div>
    </div>
  );
}
export function ModalHeader({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #334155", position: "sticky", top: 0, background: "#1E293B", zIndex: 1 }}>
      <div><h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#F8FAFC" }}>{title}</h2><p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748B" }}>{sub}</p></div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4, borderRadius: 6 }}>
        <X size={18} />
      </button>
    </div>
  );
}
export function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <p style={{ margin: "0 0 12px", paddingTop: 16, borderTop: "1px solid #334155", fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>{label}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>
    </div>
  );
}
export function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}{required && <span style={{ color: "#F87171", marginLeft: 2 }}>*</span>}
      </span>
      {children}
    </label>
  );
}
export function ActiveToggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, paddingTop: 16, borderTop: "1px solid #334155" }}>
      <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Active:</span>
      {[true, false].map((val) => (
        <button key={String(val)} type="button" onClick={() => onChange(val)}
          style={{ padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: active === val ? "none" : "1px solid #334155", background: active === val ? (val ? "#0D2E1A" : "#3B0F0F") : "transparent", color: active === val ? (val ? "#4ADE80" : "#F87171") : "#64748B" }}>
          {val ? "Active" : "Inactive"}
        </button>
      ))}
    </div>
  );
}
export function ModalFooter({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid #334155" }}>
      <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
      <button type="submit" style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{label}</button>
    </div>
  );
}
export const inp: React.CSSProperties = { background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "8px 12px", outline: "none", width: "100%", colorScheme: "dark" };
