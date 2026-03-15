export type GuideStatus = "Active" | "Inactive" | "On Leave";

export interface Guide {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: GuideStatus;
  languages: string[];
  regions: string[];
  specialties: string[];
  active: boolean;
  notes: string;
}

export const ALL_LANGUAGES = ["English", "Russian", "Arabic", "German", "French", "Spanish", "Italian", "Hebrew", "Chinese"];
export const ALL_REGIONS = ["Tbilisi", "Mtskheta", "Kazbegi", "Gudauri", "Kakheti", "Borjomi", "Kutaisi", "Svaneti", "Batumi", "Other"];
export const ALL_SPECIALTIES = ["Cultural", "History", "Religious", "Food & Wine", "Adventure", "Nature", "Family", "Luxury", "Photography", "Other"];

export const mockGuides: Guide[] = [
  {
    id: 1,
    firstName: "Nino",
    lastName: "Berishvili",
    phone: "+995 599 200 300",
    email: "nino.berishvili@guides.ge",
    status: "Active",
    languages: ["English", "Russian", "Arabic"],
    regions: ["Tbilisi", "Mtskheta", "Kakheti", "Borjomi"],
    specialties: ["Cultural", "History", "Religious", "Food & Wine"],
    active: true,
    notes: "Top-rated guide. Arabic-speaking, highly preferred by GCC groups.",
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Sulaberidze",
    phone: "+995 577 400 500",
    email: "david.s@guides.ge",
    status: "Active",
    languages: ["English", "Russian", "German"],
    regions: ["Kazbegi", "Gudauri", "Svaneti", "Borjomi"],
    specialties: ["Adventure", "Nature", "Photography"],
    active: true,
    notes: "Specialist for mountain treks and off-road adventures.",
  },
  {
    id: 3,
    firstName: "Tamara",
    lastName: "Dolidze",
    phone: "+995 555 600 700",
    email: "tamara.d@guides.ge",
    status: "Active",
    languages: ["English", "French", "Italian"],
    regions: ["Tbilisi", "Kakheti", "Kutaisi", "Batumi"],
    specialties: ["Luxury", "Food & Wine", "Cultural", "Family"],
    active: true,
    notes: "Fluent in French and Italian. Excellent with European clients.",
  },
  {
    id: 4,
    firstName: "Giorgi",
    lastName: "Kvaratskhelia",
    phone: "+995 598 800 900",
    email: "giorgi.k@guides.ge",
    status: "On Leave",
    languages: ["English", "Russian", "Hebrew"],
    regions: ["Tbilisi", "Mtskheta", "Kakheti"],
    specialties: ["Religious", "History", "Cultural"],
    active: true,
    notes: "Hebrew-speaking. On leave until May 2026.",
  },
];
