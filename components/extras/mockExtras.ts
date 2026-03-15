export type ExtraCurrency = "GEL" | "USD";
export type ExtraCalculateType = "Per Person" | "Total" | "Per Day" | "Per Person Per Day";
export type ExtraServiceType = "Entrance Fee" | "Activity" | "Service" | "Other";
export type ExtraStatus = "Active" | "Inactive";

export interface Extra {
  id: number;
  serviceName: string;
  city: string;
  price: number;
  currency: ExtraCurrency;
  calculateType: ExtraCalculateType;
  serviceType: ExtraServiceType;
  ageFrom: number | null;
  ageTo: number | null;
  status: ExtraStatus;
}

export const EXTRA_CITIES = ["Tbilisi", "Batumi", "Gudauri", "Kazbegi", "Borjomi", "Kakheti", "Kutaisi", "Mtskheta", "Any", "Other"];
export const CALCULATE_TYPES: ExtraCalculateType[] = ["Per Person", "Total", "Per Day", "Per Person Per Day"];
export const SERVICE_TYPES: ExtraServiceType[] = ["Entrance Fee", "Activity", "Service", "Other"];

export const mockExtras: Extra[] = [
  {
    id: 1,
    serviceName: "Tbilisi Cable Car (Narikala)",
    city: "Tbilisi",
    price: 5,
    currency: "GEL",
    calculateType: "Per Person",
    serviceType: "Entrance Fee",
    ageFrom: 3,
    ageTo: null,
    status: "Active",
  },
  {
    id: 2,
    serviceName: "Narikala Fortress Entry",
    city: "Tbilisi",
    price: 0,
    currency: "GEL",
    calculateType: "Per Person",
    serviceType: "Entrance Fee",
    ageFrom: null,
    ageTo: null,
    status: "Active",
  },
  {
    id: 3,
    serviceName: "Batumi Boat Trip (1 hour)",
    city: "Batumi",
    price: 50,
    currency: "GEL",
    calculateType: "Per Person",
    serviceType: "Activity",
    ageFrom: 5,
    ageTo: null,
    status: "Active",
  },
  {
    id: 4,
    serviceName: "Belly Dancer Performance",
    city: "Tbilisi",
    price: 150,
    currency: "USD",
    calculateType: "Total",
    serviceType: "Activity",
    ageFrom: null,
    ageTo: null,
    status: "Active",
  },
  {
    id: 5,
    serviceName: "Georgian SIM Card",
    city: "Any",
    price: 15,
    currency: "GEL",
    calculateType: "Per Person",
    serviceType: "Service",
    ageFrom: 18,
    ageTo: null,
    status: "Active",
  },
  {
    id: 6,
    serviceName: "Mineral Water Bottle (0.5L)",
    city: "Any",
    price: 3,
    currency: "GEL",
    calculateType: "Per Person Per Day",
    serviceType: "Service",
    ageFrom: null,
    ageTo: null,
    status: "Active",
  },
  {
    id: 7,
    serviceName: "Kakheti Wine Tasting (3 wines)",
    city: "Kakheti",
    price: 30,
    currency: "GEL",
    calculateType: "Per Person",
    serviceType: "Activity",
    ageFrom: 18,
    ageTo: null,
    status: "Active",
  },
  {
    id: 8,
    serviceName: "Sulphur Bath (Private Room, 1h)",
    city: "Tbilisi",
    price: 25,
    currency: "USD",
    calculateType: "Total",
    serviceType: "Activity",
    ageFrom: null,
    ageTo: null,
    status: "Inactive",
  },
];
