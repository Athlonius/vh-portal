export type DriverStatus = "Active" | "Inactive" | "On Leave";

export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: DriverStatus;
  languages: string[];
  vehicleCategories: string[];
  carDescription: string;
  plateNumber: string;
  supplierCompany: string;
  supplierContactName: string;
  supplierPhone: string;
  active: boolean;
  notes: string;
}

export const ALL_LANGUAGES = ["English", "Russian", "Arabic", "German", "French", "Spanish", "Italian", "Hebrew", "Chinese"];
export const ALL_VEHICLES = ["Sedan", "SUV", "Minivan", "Van", "Sprinter", "Minibus", "Bus", "Other"];

export const mockDrivers: Driver[] = [
  {
    id: 1,
    firstName: "Levan",
    lastName: "Tabatadze",
    phone: "+995 599 111 222",
    email: "levan.t@vhtransport.ge",
    status: "Active",
    languages: ["English", "Russian"],
    vehicleCategories: ["SUV", "Minivan"],
    carDescription: "Toyota Land Cruiser 200, Black, 2022",
    plateNumber: "GEO-112-AB",
    supplierCompany: "VH Transport",
    supplierContactName: "Giorgi Chikava",
    supplierPhone: "+995 577 900 100",
    active: true,
    notes: "Very reliable. Preferred for VIP clients.",
  },
  {
    id: 2,
    firstName: "Irakli",
    lastName: "Maisuradze",
    phone: "+995 555 333 444",
    email: "irakli.m@vhtransport.ge",
    status: "Active",
    languages: ["English", "Russian", "Arabic"],
    vehicleCategories: ["Sedan", "SUV"],
    carDescription: "Mercedes-Benz E-Class, Silver, 2021",
    plateNumber: "GEO-255-CD",
    supplierCompany: "VH Transport",
    supplierContactName: "Giorgi Chikava",
    supplierPhone: "+995 577 900 100",
    active: true,
    notes: "Arabic speaking – ideal for GCC groups.",
  },
  {
    id: 3,
    firstName: "Zurab",
    lastName: "Abuladze",
    phone: "+995 598 555 666",
    email: "zurab.a@gmail.com",
    status: "Active",
    languages: ["English", "Russian", "German"],
    vehicleCategories: ["Sprinter", "Minibus"],
    carDescription: "Mercedes Sprinter 19-seat, White, 2023",
    plateNumber: "GEO-388-EF",
    supplierCompany: "Caucasus Transfers",
    supplierContactName: "Nino Kvali",
    supplierPhone: "+995 591 800 900",
    active: true,
    notes: "Specialist for mountain routes: Kazbegi, Gudauri, Svaneti.",
  },
  {
    id: 4,
    firstName: "Mamuka",
    lastName: "Gvenetadze",
    phone: "+995 577 777 888",
    email: "mamuka.g@vhtransport.ge",
    status: "Inactive",
    languages: ["English", "Russian"],
    vehicleCategories: ["Bus", "Minibus"],
    carDescription: "Setra Bus 50-seat, White, 2019",
    plateNumber: "GEO-451-GH",
    supplierCompany: "VH Transport",
    supplierContactName: "Giorgi Chikava",
    supplierPhone: "+995 577 900 100",
    active: false,
    notes: "Available for large groups only. Seasonal.",
  },
  {
    id: 5,
    firstName: "Tornike",
    lastName: "Chikava",
    phone: "+995 593 999 000",
    email: "tornike.c@gmail.com",
    status: "On Leave",
    languages: ["English", "Russian", "French"],
    vehicleCategories: ["SUV", "Van"],
    carDescription: "Hyundai Staria 9-seat, Dark Blue, 2023",
    plateNumber: "GEO-512-IJ",
    supplierCompany: "Self-employed",
    supplierContactName: "—",
    supplierPhone: "—",
    active: true,
    notes: "On paternity leave until April 2026.",
  },
];
