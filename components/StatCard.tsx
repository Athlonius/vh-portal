"use client";

import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;       // e.g. "#3B82F6"
  bgColor: string;     // e.g. "#1E3A5F"
  progress: number;    // 0–100
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  progress,
  subtitle,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: "20px 22px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.15s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#334155";
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            {title}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: "#F8FAFC", lineHeight: 1 }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>{subtitle}</p>
          )}
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={color} strokeWidth={2} />
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
          background: "#334155",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}
