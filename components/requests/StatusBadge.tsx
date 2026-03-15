import { type RequestStatus } from "./mockData";

const statusStyles: Record<RequestStatus, { bg: string; color: string; dot: string }> = {
  "In Progress": { bg: "#1E3A5F", color: "#60A5FA", dot: "#3B82F6" },
  Quoted:        { bg: "#3B2A00", color: "#FCD34D", dot: "#F59E0B" },
  Confirmed:     { bg: "#0D2E1A", color: "#4ADE80", dot: "#22C55E" },
  Cancelled:     { bg: "#1E293B", color: "#94A3B8", dot: "#64748B" },
  Lost:          { bg: "#3B0F0F", color: "#F87171", dot: "#EF4444" },
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  const s = statusStyles[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}
