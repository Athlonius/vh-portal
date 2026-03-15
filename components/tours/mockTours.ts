export type TourType = "Tour" | "Transfer" | "Disposal";
export type TourStatus = "Active" | "Inactive";
export type VehicleType = "Sedan" | "SUV" | "Minivan" | "Sprinter" | "Minibus" | "Bus";
export type TourMarket = "India" | "GCC" | "Both";

export interface Tour {
  id: number;
  name: string;
  type: TourType;
  fromCity: string;
  toCity: string;
  duration: string;
  description: string;
  status: TourStatus;
}

export interface TourRate {
  id: number;
  tourId: number;
  tourName: string;
  type: TourType;
  vehicle: VehicleType;
  market: TourMarket;
  highSeasonGel: number;
  lowSeasonGel: number;
  status: TourStatus;
}

export const TOUR_TYPES: TourType[] = ["Tour", "Transfer", "Disposal"];
export const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Minivan", "Sprinter", "Minibus", "Bus"];
export const GEORGIAN_CITIES = ["Tbilisi", "Batumi", "Kutaisi", "Kazbegi", "Gudauri", "Borjomi", "Kakheti", "Mtskheta", "Svaneti", "Signagi"];

export const mockTours: Tour[] = [
  {
    id: 1,
    name: "Tbilisi City Tour",
    type: "Tour",
    fromCity: "Tbilisi",
    toCity: "Tbilisi",
    duration: "Full Day (8h)",
    description: "Comprehensive Tbilisi sightseeing: Old Town, Narikala, Rustaveli Ave, sulfur baths.",
    status: "Active",
  },
  {
    id: 2,
    name: "Tbilisi – Kazbegi Day Trip",
    type: "Tour",
    fromCity: "Tbilisi",
    toCity: "Kazbegi",
    duration: "Full Day (10h)",
    description: "Scenic drive via Georgian Military Highway, Ananuri Fortress, Gudauri viewpoint, Gergeti Trinity Church.",
    status: "Active",
  },
  {
    id: 3,
    name: "Kakheti Wine Tour",
    type: "Tour",
    fromCity: "Tbilisi",
    toCity: "Kakheti",
    duration: "Full Day (9h)",
    description: "Wine region tour: Signagi, Bodbe Monastery, Telavi, winery visits with tastings.",
    status: "Active",
  },
  {
    id: 4,
    name: "Tbilisi Airport Transfer",
    type: "Transfer",
    fromCity: "Tbilisi",
    toCity: "Tbilisi Airport",
    duration: "30–45 min",
    description: "Private airport transfer to/from Tbilisi city centre.",
    status: "Active",
  },
  {
    id: 5,
    name: "Driver Disposal – Tbilisi",
    type: "Disposal",
    fromCity: "Tbilisi",
    toCity: "Tbilisi",
    duration: "Per day",
    description: "Full-day driver at disposal for city transfers and errands.",
    status: "Active",
  },
];

export const mockRates: TourRate[] = [
  {
    id: 1,
    tourId: 1,
    tourName: "Tbilisi City Tour",
    type: "Tour",
    vehicle: "SUV",
    market: "India",
    highSeasonGel: 420,
    lowSeasonGel: 320,
    status: "Active",
  },
  {
    id: 2,
    tourId: 1,
    tourName: "Tbilisi City Tour",
    type: "Tour",
    vehicle: "Minivan",
    market: "GCC",
    highSeasonGel: 580,
    lowSeasonGel: 450,
    status: "Active",
  },
  {
    id: 3,
    tourId: 2,
    tourName: "Tbilisi – Kazbegi Day Trip",
    type: "Tour",
    vehicle: "SUV",
    market: "Both",
    highSeasonGel: 650,
    lowSeasonGel: 500,
    status: "Active",
  },
  {
    id: 4,
    tourId: 3,
    tourName: "Kakheti Wine Tour",
    type: "Tour",
    vehicle: "Minivan",
    market: "India",
    highSeasonGel: 560,
    lowSeasonGel: 420,
    status: "Active",
  },
  {
    id: 5,
    tourId: 4,
    tourName: "Tbilisi Airport Transfer",
    type: "Transfer",
    vehicle: "Sedan",
    market: "Both",
    highSeasonGel: 120,
    lowSeasonGel: 100,
    status: "Active",
  },
  {
    id: 6,
    tourId: 5,
    tourName: "Driver Disposal – Tbilisi",
    type: "Disposal",
    vehicle: "SUV",
    market: "Both",
    highSeasonGel: 380,
    lowSeasonGel: 300,
    status: "Inactive",
  },
];
