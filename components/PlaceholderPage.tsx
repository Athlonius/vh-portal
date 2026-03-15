import { type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
  color?: string;
}

export default function PlaceholderPage({ title, icon: Icon, color = "#3B82F6" }: Props) {
  return (
    <div style={{ padding: "32px 32px 48px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>{title}</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 32px",
          background: "#1E293B",
          border: "1px dashed #334155",
          borderRadius: 16,
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#0F172A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={28} color={color} strokeWidth={1.5} />
        </div>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#F8FAFC" }}>{title}</p>
        <p style={{ margin: 0, fontSize: 14, color: "#64748B" }}>Coming soon — this page is under construction.</p>
      </div>
    </div>
  );
}
