"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { type Partner, type Market, type PartnerStatus, type Agent } from "./mockPartners";

interface Props {
  onClose: () => void;
  onSave: (p: Omit<Partner, "id">) => void;
  nextId: number;
}

const blankAgent = (): Agent => ({ name: "", position: "", phone: "", email: "" });

export default function AddPartnerModal({ onClose, onSave, nextId }: Props) {
  const [form, setForm] = useState({
    companyName: "",
    registrationNumber: `VH-P-2026-${String(nextId).padStart(3, "0")}`,
    market: "India" as Market,
    socialMedia: "",
    website: "",
    partnershipStatus: "Active" as PartnerStatus,
    rating: 3,
    email: "",
    telephone: "",
    address: "",
    city: "",
    country: "",
    notes: "",
  });
  const [agents, setAgents] = useState<Agent[]>([blankAgent()]);

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setAgent = (i: number, k: keyof Agent, v: string) =>
    setAgents((a) => a.map((ag, idx) => idx === i ? { ...ag, [k]: v } : ag));

  const addAgent = () => setAgents((a) => [...a, blankAgent()]);
  const removeAgent = (i: number) => setAgents((a) => a.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, agents });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #334155", position: "sticky", top: 0, background: "#1E293B", zIndex: 1 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#F8FAFC" }}>Add New Partner</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748B" }}>Fill in partner and agent details below.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4, borderRadius: 6 }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {/* Company Info */}
          <SectionLabel>Company Information</SectionLabel>
          <div style={grid2}>
            <Field label="Company Name" full required>
              <input required value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Agency name" style={inp} />
            </Field>
            <Field label="Registration Number">
              <input value={form.registrationNumber} readOnly style={{ ...inp, color: "#64748B", cursor: "default" }} />
            </Field>
            <Field label="Market" required>
              <select value={form.market} onChange={(e) => set("market", e.target.value as Market)} style={{ ...inp, cursor: "pointer" }}>
                <option value="India">India</option>
                <option value="GCC">GCC</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Partnership Status">
              <select value={form.partnershipStatus} onChange={(e) => set("partnershipStatus", e.target.value as PartnerStatus)} style={{ ...inp, cursor: "pointer" }}>
                {["Active", "Inactive", "Prospect"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Rating (1–5)">
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => set("rating", n)}
                    style={{ width: 32, height: 32, borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14,
                      background: form.rating >= n ? "#854D0E" : "#0F172A",
                      color: form.rating >= n ? "#FBBF24" : "#475569" }}>
                    ★
                  </button>
                ))}
                <span style={{ fontSize: 12, color: "#64748B", marginLeft: 4 }}>{form.rating}/5</span>
              </div>
            </Field>
            <Field label="Website">
              <input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="www.agency.com" style={inp} />
            </Field>
            <Field label="Social Media">
              <input value={form.socialMedia} onChange={(e) => set("socialMedia", e.target.value)} placeholder="@handle" style={inp} />
            </Field>
          </div>

          {/* Contact */}
          <SectionLabel>Contact Details</SectionLabel>
          <div style={grid2}>
            <Field label="Email" required>
              <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@agency.com" style={inp} />
            </Field>
            <Field label="Telephone">
              <input value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+91 / +971 / +965" style={inp} />
            </Field>
            <Field label="Address">
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address" style={inp} />
            </Field>
            <Field label="City">
              <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" style={inp} />
            </Field>
            <Field label="Country">
              <input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Country" style={inp} />
            </Field>
          </div>

          {/* Agents */}
          <SectionLabel>
            <span>Agents</span>
            <button type="button" onClick={addAgent}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 12, padding: "3px 10px", borderRadius: 6, border: "1px solid #334155", background: "none", color: "#60A5FA", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              <Plus size={11} /> Add Agent
            </button>
          </SectionLabel>

          {agents.map((ag, i) => (
            <div key={i} style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Agent {i + 1}</span>
                {agents.length > 1 && (
                  <button type="button" onClick={() => removeAgent(i)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", padding: 2 }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div style={grid2}>
                <Field label="Full Name">
                  <input value={ag.name} onChange={(e) => setAgent(i, "name", e.target.value)} placeholder="Full name" style={inp} />
                </Field>
                <Field label="Position">
                  <input value={ag.position} onChange={(e) => setAgent(i, "position", e.target.value)} placeholder="e.g. Sales Manager" style={inp} />
                </Field>
                <Field label="Phone">
                  <input value={ag.phone} onChange={(e) => setAgent(i, "phone", e.target.value)} placeholder="+91 / +971 / +965" style={inp} />
                </Field>
                <Field label="Email">
                  <input type="email" value={ag.email} onChange={(e) => setAgent(i, "email", e.target.value)} placeholder="agent@agency.com" style={inp} />
                </Field>
              </div>
            </div>
          ))}

          {/* Notes */}
          <SectionLabel>Notes</SectionLabel>
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any additional notes about this partner..." rows={3}
            style={{ ...inp, width: "100%", resize: "vertical", lineHeight: 1.5 }} />

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid #334155" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Partner</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid #334155", paddingTop: 16, marginTop: 4, marginBottom: 12 }}>
      <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>{children}</span>
    </div>
  );
}

function Field({ label, children, required, full, style }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean; style?: React.CSSProperties }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, gridColumn: full ? "1 / -1" : undefined, ...style }}>
      <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}{required && <span style={{ color: "#F87171", marginLeft: 2 }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 4 };
const inp: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "8px 12px", outline: "none", width: "100%", colorScheme: "dark" };
