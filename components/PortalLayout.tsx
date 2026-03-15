"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "./AuthContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (user && pathname === "/login") {
      router.replace("/");
    } else if (!user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [ready, user, pathname, router]);

  // Login page — full screen, no layout chrome
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Waiting for localStorage check or mid-redirect
  if (!ready || !user) {
    return (
      <div style={{ height: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid #1E293B",
          borderTopColor: "#3B82F6",
          animation: "vh-spin 0.75s linear infinite",
        }} />
        <style>{`@keyframes vh-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Top header */}
        <header style={{
          height: 52,
          background: "#0F172A",
          borderBottom: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 24px",
          gap: 14,
          flexShrink: 0,
        }}>
          {/* User info */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
              letterSpacing: "-0.5px",
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", lineHeight: 1.2 }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{user.role}</div>
            </div>
          </div>

          <div style={{ width: 1, height: 24, background: "#1E293B" }} />

          <LogoutButton onClick={() => { logout(); router.push("/login"); }} />
        </header>

        <main style={{ flex: 1, overflowY: "auto", background: "#0F172A", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: hov ? "#1E293B" : "none",
        border: `1px solid ${hov ? "#475569" : "#334155"}`,
        borderRadius: 8, color: hov ? "#F87171" : "#64748B",
        fontSize: 12, fontWeight: 600, padding: "6px 12px",
        cursor: "pointer", transition: "all 0.15s",
      }}
    >
      <LogOut size={13} /> Sign Out
    </button>
  );
}
