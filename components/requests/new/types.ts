export type RoomType = "SGL" | "DBL" | "TRPL" | "QUAD" | "QUINT";
export type MealPlan = "RO" | "BB" | "HB" | "FB";
export type GuideType = "Not Included" | "English speaking" | "Russian speaking" | "Arabic speaking";
export type VehicleType = "Sedan" | "SUV" | "Minivan" | "Van" | "Sprinter" | "Minibus" | "Bus";
export type MarkupType = "Per Pax" | "Total" | "Percent";
export type CalcType = "Per Pax" | "Total";

export interface RoomLine {
  type: RoomType;
  count: number;
  rateUsd: number;
}

export interface HotelBlock {
  id: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  mealPlan: MealPlan;
  rooms: RoomLine[];
  extraBedRateUsd: number;
}

export interface TourRow {
  id: string;
  date: string;
  day: number;
  vehicleType: VehicleType;
  tourName: string;
  driverLang: string;
  guideType: GuideType;
  rateGel: number;
  isSameDay: boolean;
}

export interface InclusionRow {
  id: string;
  name: string;
  calcLabel: string;
  totalGel: number;
}

export interface FormState {
  // S1
  agencyId: number | null;
  agentName: string;
  status: string;
  receivedVia: string;
  requestDate: string;
  requestNumber: string;
  // S2
  calcType: CalcType;
  markupType: MarkupType;
  markupValue: number;
  gelRate: number;
  // S3
  dateFrom: string;
  dateTo: string;
  mealPlan: MealPlan;
  // S4
  adults: number;
  numChildren: number;
  childAges: (number | "")[];
  cwb: number;
  cnb: number;
  // S5
  hotels: HotelBlock[];
  // S6
  tourRows: TourRow[];
  // S7
  entryFees: InclusionRow[];
  mealInclusions: InclusionRow[];
  extras: InclusionRow[];
  // S8
  itinerary: string;
  createdBy: string;
}
