import { inp, lbl } from "./S1Context";

interface Props {
  itinerary: string; setItinerary: (v: string) => void;
  createdBy: string;
}

export default function S8Notes(p: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={lbl}>Itinerary / Internal Notes</span>
        <textarea value={p.itinerary} onChange={(e) => p.setItinerary(e.target.value)} rows={5}
          placeholder="Day 1 – Arrive Tbilisi. Transfer to hotel.&#10;Day 2 – Tbilisi City Tour..."
          style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 5, maxWidth: 240 }}>
        <span style={lbl}>Created By</span>
        <input readOnly value={p.createdBy} style={{ ...inp, color: "#94A3B8", cursor: "default" }} />
      </label>
    </div>
  );
}
