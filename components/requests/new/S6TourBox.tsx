"use client";

import { useState } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { type TourRow, type VehicleType, type GuideType } from "./types";
import { inp, lbl, sel } from "./S1Context";
import { uid, fmtDateMed, lookupRate, tourBoxTotalGel, generateTourRows } from "./utils";
import { mockTours } from "../../tours/mockTours";

const VEHICLES: VehicleType[] = ["Sedan", "SUV", "Minivan", "Van", "Sprinter", "Minibus", "Bus"];
const DRIVER_LANGS = ["English", "Russian", "Arabic", "German", "French"];
const GUIDE_TYPES: GuideType[] = ["Not Included", "English speaking", "Russian speaking", "Arabic speaking"];

interface Props {
  tourRows: TourRow[];
  setTourRows: (v: TourRow[]) => void;
  dateFrom: string;
  dateTo: string;
  gelRate: number;
}

export default function S6TourBox(p: Props) {
  const totalGel = tourBoxTotalGel(p.tourRows);
  const totalUsd = totalGel / (p.gelRate || 2.72);

  const updateRow = (id: string, patch: Partial<TourRow>) =>
    p.setTourRows(p.tourRows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: string) => p.setTourRows(p.tourRows.filter((r) => r.id !== id));

  const addSameDay = (afterRow: TourRow) => {
    const idx = p.tourRows.findIndex((r) => r.id === afterRow.id);
    const newRow: TourRow = { ...afterRow, id: uid(), isSameDay: true, rateGel: 0, tourName: "" };
    const rows = [...p.tourRows];
    rows.splice(idx + 1, 0, newRow);
    p.setTourRows(rows);
  };

  const copyLangDown = (fromId: string, lang: string) => {
    const idx = p.tourRows.findIndex((r) => r.id === fromId);
    p.setTourRows(p.tourRows.map((r, i) => i >= idx ? { ...r, driverLang: lang } : r));
  };

  const regenerate = () => {
    if (!p.dateFrom || !p.dateTo) return;
    p.setTourRows(generateTourRows(p.dateFrom, p.dateTo));
  };

  return (
    <div>
      {p.tourRows.length === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: "#475569", fontSize: 13 }}>
          {p.dateFrom && p.dateTo
            ? <><span>No rows yet. </span><button type="button" onClick={regenerate} style={{ background: "none", border: "none", color: "#60A5FA", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Generate from trip dates</button></>
            : "Set trip dates in Section 3 to auto-generate tour rows."}
        </div>
      ) : (
        <>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "70px 90px 120px 1fr 120px 160px 100px 32px", gap: 6, padding: "6px 10px", marginBottom: 4 }}>
            {["Date", "Day", "Vehicle", "Tour / Transfer", "Driver Lang", "Guide", "Rate (GEL)", ""].map((h) => (
              <span key={h} style={{ ...lbl, fontSize: 10 }}>{h}</span>
            ))}
          </div>

          {p.tourRows.map((row) => (
            <TourRowItem
              key={row.id} row={row}
              onUpdate={(patch) => updateRow(row.id, patch)}
              onRemove={() => removeRow(row.id)}
              onAddSameDay={() => addSameDay(row)}
              onCopyLangDown={(lang) => copyLangDown(row.id, lang)}
            />
          ))}

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 20, marginTop: 12, padding: "10px 10px", borderTop: "1px solid #334155" }}>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>
              Tour Box Total: <strong style={{ color: "#FCD34D", marginLeft: 4 }}>₾ {totalGel.toLocaleString()}</strong>
            </span>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>
              ≈ <strong style={{ color: "#4ADE80" }}>${totalUsd.toFixed(2)}</strong>
            </span>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button type="button" onClick={regenerate} disabled={!p.dateFrom || !p.dateTo}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1px solid #334155", background: "none", color: (!p.dateFrom || !p.dateTo) ? "#334155" : "#94A3B8", fontSize: 12, cursor: (!p.dateFrom || !p.dateTo) ? "default" : "pointer" }}>
          <RefreshCw size={12} /> Regenerate from dates
        </button>
      </div>
    </div>
  );
}

function TourRowItem({ row, onUpdate, onRemove, onAddSameDay, onCopyLangDown }: {
  row: TourRow;
  onUpdate: (p: Partial<TourRow>) => void;
  onRemove: () => void;
  onAddSameDay: () => void;
  onCopyLangDown: (lang: string) => void;
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleTourChange = (tourName: string) => {
    const autoRate = lookupRate(tourName, row.vehicleType);
    onUpdate({ tourName, rateGel: autoRate });
  };

  const handleVehicleChange = (vehicleType: VehicleType) => {
    const autoRate = lookupRate(row.tourName, vehicleType);
    onUpdate({ vehicleType, rateGel: autoRate });
  };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "70px 90px 120px 1fr 120px 160px 100px 32px",
      gap: 6, padding: "5px 10px", alignItems: "center",
      background: row.isSameDay ? "#0C1929" : "transparent",
      borderRadius: 6, marginBottom: 3,
    }}>
      {/* Date */}
      <span style={{ fontSize: 12, color: row.isSameDay ? "#64748B" : "#94A3B8", fontWeight: row.isSameDay ? 400 : 600 }}>
        {row.date ? fmtDateMed(row.date) : "—"}
      </span>

      {/* Day */}
      <span style={{ fontSize: 12, color: "#475569", textAlign: "center" }}>
        {row.isSameDay ? <span style={{ color: "#334155" }}>+ same</span> : `Day ${row.day}`}
      </span>

      {/* Vehicle */}
      <select value={row.vehicleType} onChange={(e) => handleVehicleChange(e.target.value as VehicleType)}
        style={{ ...sel, background: "#0F172A", fontSize: 12, padding: "5px 8px" }}>
        {VEHICLES.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>

      {/* Tour */}
      <select value={row.tourName} onChange={(e) => handleTourChange(e.target.value)}
        style={{ ...sel, background: "#0F172A", fontSize: 12, padding: "5px 8px" }}>
        <option value="">Select tour…</option>
        {mockTours.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
      </select>

      {/* Driver language */}
      <div style={{ position: "relative" }}>
        <select value={row.driverLang}
          onChange={(e) => { onUpdate({ driverLang: e.target.value }); setShowLangMenu(true); }}
          onBlur={() => setTimeout(() => setShowLangMenu(false), 150)}
          style={{ ...sel, background: "#0F172A", fontSize: 12, padding: "5px 8px", width: "100%" }}>
          {DRIVER_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        {showLangMenu && (
          <button type="button"
            onMouseDown={(e) => { e.preventDefault(); onCopyLangDown(row.driverLang); setShowLangMenu(false); }}
            style={{ position: "absolute", top: "calc(100% + 2px)", left: 0, zIndex: 20, background: "#1E293B", border: "1px solid #334155", borderRadius: 6, padding: "5px 10px", color: "#60A5FA", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            ↓ Apply to all below
          </button>
        )}
      </div>

      {/* Guide */}
      <select value={row.guideType} onChange={(e) => onUpdate({ guideType: e.target.value as GuideType })}
        style={{ ...sel, background: "#0F172A", fontSize: 12, padding: "5px 8px" }}>
        {GUIDE_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>

      {/* Rate */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#64748B", pointerEvents: "none" }}>₾</span>
        <input type="number" min="0" step="1" value={row.rateGel}
          onChange={(e) => onUpdate({ rateGel: parseFloat(e.target.value) || 0 })}
          style={{ ...inp, background: "#0F172A", paddingLeft: 20, fontSize: 12, padding: "5px 5px 5px 20px" }} />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 2 }}>
        <button type="button" onClick={onAddSameDay} title="Add same day vehicle"
          style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", padding: "2px", display: "flex", borderRadius: 4 }}>
          <Plus size={13} />
        </button>
        <button type="button" onClick={onRemove} title="Remove row"
          style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", padding: "2px", display: "flex", borderRadius: 4 }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
