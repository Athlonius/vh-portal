"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, RefreshCw } from "lucide-react";

export default function ExchangeRate() {
  const [rate, setRate] = useState("2.72");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rate);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const save = () => {
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && parsed > 0) {
      setRate(parsed.toFixed(2));
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(rate);
    setEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  };

  return (
    <div
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "fit-content",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: "#1E1B4B",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <RefreshCw size={16} color="#818CF8" strokeWidth={2} />
      </div>

      <div>
        <p style={{ margin: 0, fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
          Exchange Rate
        </p>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 14, color: "#94A3B8" }}>1 USD =</span>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              style={{
                background: "#0F172A",
                border: "1px solid #6366F1",
                borderRadius: 6,
                color: "#F8FAFC",
                fontSize: 16,
                fontWeight: 700,
                padding: "2px 8px",
                width: 70,
                outline: "none",
              }}
            />
            <span style={{ fontSize: 14, color: "#94A3B8" }}>GEL</span>
            <button onClick={save} style={{ background: "none", border: "none", cursor: "pointer", color: "#22C55E", padding: 2 }}>
              <Check size={16} />
            </button>
            <button onClick={cancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: 2 }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>
              1 USD = {rate} GEL
            </span>
            <button
              onClick={() => { setDraft(rate); setEditing(true); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 2, display: "flex", alignItems: "center" }}
              title="Edit rate"
            >
              <Pencil size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
