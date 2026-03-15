"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  num: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SectionCard({ num, title, subtitle, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
          borderBottom: open ? "1px solid #334155" : "none",
        }}
      >
        <span style={{
          width: 26, height: 26, borderRadius: 6, background: "#0F172A",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#60A5FA", flexShrink: 0,
        }}>
          {num}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>{subtitle}</div>}
        </div>
        <span style={{ color: "#64748B" }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && <div style={{ padding: "20px" }}>{children}</div>}
    </div>
  );
}
