"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CheckCircle,
  Building2,
  Car,
  Map,
  Globe,
  Ticket,
  UtensilsCrossed,
  Handshake,
  UserCog,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Requests", href: "/requests", icon: ClipboardList },
  { label: "Confirmations", href: "/confirmations", icon: CheckCircle },
  { label: "Hotels", href: "/hotels", icon: Building2 },
  { label: "Drivers", href: "/drivers", icon: Car },
  { label: "Guides", href: "/guides", icon: Map },
  { label: "Tours", href: "/tours", icon: Globe },
  { label: "Extras & Entry Fees", href: "/extras", icon: Ticket },
  { label: "Meals", href: "/meals", icon: UtensilsCrossed },
  { label: "Partners", href: "/partners", icon: Handshake },
  { label: "Users", href: "/users", icon: UserCog },
  { label: "Availability Board", href: "/availability", icon: CalendarDays },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? 64 : 240,
        minWidth: collapsed ? 64 : 240,
        background: "#0F172A",
        borderRight: "1px solid #1E293B",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        position: "relative",
        height: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #1E293B",
          minHeight: 64,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 15,
            color: "#fff",
            flexShrink: 0,
            letterSpacing: "-0.5px",
          }}
        >
          VH
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC", lineHeight: 1.2 }}>
              VH Portal
            </div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Operations</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                color: isActive ? "#F8FAFC" : "#94A3B8",
                background: isActive ? "#1E3A5F" : "transparent",
                fontWeight: isActive ? 600 : 400,
                fontSize: 13.5,
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#1E293B";
                  e.currentTarget.style.color = "#F8FAFC";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94A3B8";
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          margin: "12px 8px",
          padding: "8px",
          background: "#1E293B",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          color: "#64748B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontSize: 12,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#334155";
          e.currentTarget.style.color = "#F8FAFC";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1E293B";
          e.currentTarget.style.color = "#64748B";
        }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
