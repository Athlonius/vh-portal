"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#0F172A",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}
