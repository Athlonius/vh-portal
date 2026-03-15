"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ROLES, type User, type UserRole, roleStyle } from "./mockUsers";

interface Props {
  onClose: () => void;
  onSave: (u: Omit<User, "id" | "createdAt">) => void;
}

export default function AddUserModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    role: "Sales" as UserRole,
    active: true,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const rs = roleStyle[form.role];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #334155" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#F8FAFC" }}>Add New User</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748B" }}>Create a new portal user account.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4, borderRadius: 6 }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First Name" required>
              <input required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" style={inp} />
            </Field>
            <Field label="Last Name" required>
              <input required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" style={inp} />
            </Field>
            <Field label="Email" required full>
              <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="user@vh-portal.ge" style={inp} />
            </Field>
            <Field label="Telephone" full>
              <input value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+995 5XX XXX XXX" style={inp} />
            </Field>
            <Field label="Role" required full>
              <select value={form.role} onChange={(e) => set("role", e.target.value as UserRole)} style={{ ...inp, cursor: "pointer" }}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          {/* Role preview */}
          <div style={{ marginTop: 12, padding: "10px 14px", background: "#0F172A", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#64748B" }}>Role preview:</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: rs.bg, color: rs.color, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: rs.color }} />
              {form.role}
            </span>
          </div>

          {/* Active toggle */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Status:</span>
            {[true, false].map((val) => (
              <button key={String(val)} type="button" onClick={() => set("active", val)}
                style={{
                  padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: form.active === val ? "none" : "1px solid #334155",
                  background: form.active === val ? (val ? "#0D2E1A" : "#3B0F0F") : "transparent",
                  color: form.active === val ? (val ? "#4ADE80" : "#F87171") : "#64748B",
                }}>
                {val ? "Active" : "Inactive"}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid #334155" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}{required && <span style={{ color: "#F87171", marginLeft: 2 }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const inp: React.CSSProperties = { background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "8px 12px", outline: "none", width: "100%", colorScheme: "dark" };
