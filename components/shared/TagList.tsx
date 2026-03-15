interface TagListProps {
  items: string[];
  color?: string;
  bg?: string;
}

export default function TagList({ items, color = "#60A5FA", bg = "#1E3A5F" }: TagListProps) {
  if (!items.length) return <span style={{ color: "#475569", fontSize: 12 }}>—</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {items.map((item) => (
        <span key={item} style={{ padding: "2px 8px", borderRadius: 4, background: bg, color, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>
          {item}
        </span>
      ))}
    </div>
  );
}
