"use client";

import StatCard from "./StatCard";
import {
  ClipboardList,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Total Requests",
    value: 142,
    subtitle: "All time",
    icon: ClipboardList,
    color: "#3B82F6",
    bgColor: "#1E3A5F",
    progress: 71,
  },
  {
    title: "Leads / In Progress",
    value: 38,
    subtitle: "Active pipeline",
    icon: TrendingUp,
    color: "#06B6D4",
    bgColor: "#0C2E36",
    progress: 27,
  },
  {
    title: "Confirmed / Booked",
    value: 67,
    subtitle: "This season",
    icon: CheckCircle,
    color: "#22C55E",
    bgColor: "#0D2E1A",
    progress: 47,
  },
  {
    title: "Revenue / Price",
    value: "$84,320",
    subtitle: "Total confirmed",
    icon: DollarSign,
    color: "#A855F7",
    bgColor: "#2D1B4E",
    progress: 63,
  },
  {
    title: "Unpaid / Pending",
    value: "$12,750",
    subtitle: "Awaiting payment",
    icon: Clock,
    color: "#EF4444",
    bgColor: "#3B1212",
    progress: 15,
  },
  {
    title: "Cancelled / Lost",
    value: 11,
    subtitle: "This season",
    icon: XCircle,
    color: "#F97316",
    bgColor: "#3B1A0A",
    progress: 8,
  },
  {
    title: "Aging",
    value: 5,
    subtitle: "No follow-up 7+ days",
    icon: AlertTriangle,
    color: "#F59E0B",
    bgColor: "#3B2A00",
    progress: 13,
  },
];

export default function StatsGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
      }}
    >
      {stats.map((s) => (
        <StatCard key={s.title} {...s} />
      ))}
    </div>
  );
}
