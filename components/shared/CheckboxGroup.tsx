"use client";

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export default function CheckboxGroup({ label, options, selected, onChange }: CheckboxGroupProps) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <p style={{ margin: "0 0 8px", fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              style={{
                padding: "4px 11px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: checked ? 600 : 400,
                border: checked ? "none" : "1px solid #334155",
                background: checked ? "#1E3A5F" : "transparent",
                color: checked ? "#60A5FA" : "#64748B",
                transition: "all 0.15s",
              }}>
              {checked ? "✓ " : ""}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
