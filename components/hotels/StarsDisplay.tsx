import { type HotelStars } from "./mockHotels";

export default function StarsDisplay({ stars }: { stars: HotelStars }) {
  if (stars === "Boutique") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 20, background: "#2D1B4E", color: "#C084FC", fontSize: 11, fontWeight: 700 }}>
        ✦ Boutique
      </span>
    );
  }
  const count = parseInt(stars, 10);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 1, color: "#FBBF24", fontSize: 14, letterSpacing: 1 }}>
      {"★".repeat(count)}
      <span style={{ marginLeft: 4, color: "#94A3B8", fontSize: 11 }}>{stars}★</span>
    </span>
  );
}
