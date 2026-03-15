import { type RoomLine, type RoomType, type TourRow, type InclusionRow, type HotelBlock } from "./types";
import { mockRates } from "../../tours/mockTours";

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export function fmtDateMed(d: string): string {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function nightsBetween(a: string, b: string): number {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function suggestRooms(adults: number): RoomLine[] {
  const types: RoomType[] = ["SGL", "DBL", "TRPL", "QUAD", "QUINT"];
  if (adults <= 5) return [{ type: types[adults - 1] ?? "DBL", count: 1, rateUsd: 0 }];
  const dbls = Math.floor(adults / 2);
  const sgls = adults % 2;
  const res: RoomLine[] = [{ type: "DBL", count: dbls, rateUsd: 0 }];
  if (sgls) res.push({ type: "SGL", count: 1, rateUsd: 0 });
  return res;
}

export function lookupRate(tourName: string, vehicleType: string): number {
  const r = mockRates.find((x) => x.tourName === tourName && x.vehicle === vehicleType);
  return r ? r.highSeasonGel : 0;
}

export function hotelSubtotalUsd(h: HotelBlock): number {
  const nights = nightsBetween(h.checkIn, h.checkOut);
  return h.rooms.reduce((s, r) => s + r.count * r.rateUsd * nights, 0);
}

export function tourBoxTotalGel(rows: TourRow[]): number {
  return rows.reduce((s, r) => s + (r.rateGel || 0), 0);
}

export function inclusionsTotalGel(items: InclusionRow[]): number {
  return items.reduce((s, r) => s + (r.totalGel || 0), 0);
}

export function generateTourRows(dateFrom: string, dateTo: string): TourRow[] {
  const nights = nightsBetween(dateFrom, dateTo);
  if (!nights || nights <= 0) return [];
  return Array.from({ length: nights }, (_, i) => ({
    id: uid(),
    date: addDays(dateFrom, i),
    day: i + 1,
    vehicleType: "SUV" as const,
    tourName: "",
    driverLang: "English",
    guideType: "Not Included" as const,
    rateGel: 0,
    isSameDay: false,
  }));
}

export function calcFooter(
  hotels: HotelBlock[],
  tourRows: TourRow[],
  entryFees: InclusionRow[],
  mealInclusions: InclusionRow[],
  extras: InclusionRow[],
  gelRate: number,
  markupType: string,
  markupValue: number,
  adults: number,
) {
  const accomsUsd = hotels.reduce((s, h) => s + hotelSubtotalUsd(h), 0);
  const toursUsd = tourBoxTotalGel(tourRows) / (gelRate || 2.72);
  const inclUsd =
    (inclusionsTotalGel(entryFees) + inclusionsTotalGel(mealInclusions) + inclusionsTotalGel(extras)) /
    (gelRate || 2.72);
  const netCost = accomsUsd + toursUsd + inclUsd;

  let markupUsd = 0;
  if (markupType === "Percent") markupUsd = netCost * (markupValue / 100);
  else if (markupType === "Per Pax") markupUsd = markupValue * adults;
  else markupUsd = markupValue;

  const sellingPrice = netCost + markupUsd;
  const margin = sellingPrice > 0 ? (markupUsd / sellingPrice) * 100 : 0;
  const perPax = adults > 0 ? sellingPrice / adults : 0;

  return { accomsUsd, toursUsd, inclUsd, netCost, markupUsd, sellingPrice, margin, perPax };
}

export function usd(n: number) {
  return "$" + n.toFixed(2);
}
