export type Market = "India" | "GCC" | "Other";
export type PartnerStatus = "Active" | "Inactive" | "Prospect";

export interface Agent {
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface Partner {
  id: number;
  companyName: string;
  registrationNumber: string;
  market: Market;
  socialMedia: string;
  website: string;
  agents: Agent[];
  partnershipStatus: PartnerStatus;
  rating: number;
  email: string;
  telephone: string;
  address: string;
  city: string;
  country: string;
  notes: string;
}

export const mockPartners: Partner[] = [
  {
    id: 1,
    companyName: "Cosmos Travel India",
    registrationNumber: "VH-P-2024-001",
    market: "India",
    socialMedia: "@cosmostravelindia",
    website: "www.cosmostravelindia.com",
    agents: [
      { name: "Priya Sharma", position: "Senior Sales Manager", phone: "+91 98765 43210", email: "priya@cosmostravelindia.com" },
      { name: "Raj Mehta", position: "Operations Head", phone: "+91 98765 12345", email: "raj@cosmostravelindia.com" },
    ],
    partnershipStatus: "Active",
    rating: 5,
    email: "info@cosmostravelindia.com",
    telephone: "+91 22 4567 8900",
    address: "42 Marine Drive, Nariman Point",
    city: "Mumbai",
    country: "India",
    notes: "Top-performing partner since 2022. High-volume groups.",
  },
  {
    id: 2,
    companyName: "Al Raha Tours Dubai",
    registrationNumber: "VH-P-2024-002",
    market: "GCC",
    socialMedia: "@alrahatours",
    website: "www.alrahatours.ae",
    agents: [
      { name: "Khalid Al Mansouri", position: "Director", phone: "+971 50 123 4567", email: "khalid@alrahatours.ae" },
    ],
    partnershipStatus: "Active",
    rating: 4,
    email: "groups@alrahatours.ae",
    telephone: "+971 4 345 6789",
    address: "Deira Tower, Floor 7",
    city: "Dubai",
    country: "UAE",
    notes: "Strong GCC market presence. Prefers luxury properties.",
  },
  {
    id: 3,
    companyName: "Wanderlust Holidays Mumbai",
    registrationNumber: "VH-P-2024-003",
    market: "India",
    socialMedia: "@wanderlustholidays",
    website: "www.wanderlustholidays.in",
    agents: [
      { name: "Ankit Verma", position: "Sales Executive", phone: "+91 99887 76655", email: "ankit@wanderlust.in" },
      { name: "Sneha Patil", position: "Accounts Manager", phone: "+91 99887 11223", email: "sneha@wanderlust.in" },
    ],
    partnershipStatus: "Active",
    rating: 4,
    email: "booking@wanderlustholidays.in",
    telephone: "+91 22 6789 0123",
    address: "Bandra Kurla Complex, Plot C-12",
    city: "Mumbai",
    country: "India",
    notes: "Mid-size agency. Focus on family packages.",
  },
  {
    id: 4,
    companyName: "Arabian Escapes Abu Dhabi",
    registrationNumber: "VH-P-2024-004",
    market: "GCC",
    socialMedia: "@arabianescapes",
    website: "www.arabianescapes.ae",
    agents: [
      { name: "Fatima Al Zaabi", position: "Group Travel Specialist", phone: "+971 55 987 6543", email: "fatima@arabianescapes.ae" },
    ],
    partnershipStatus: "Active",
    rating: 5,
    email: "groups@arabianescapes.ae",
    telephone: "+971 2 678 9012",
    address: "Al Salam Street, Corniche Tower",
    city: "Abu Dhabi",
    country: "UAE",
    notes: "Premium segment. Large group bookings (8-15 pax).",
  },
  {
    id: 5,
    companyName: "Saffron Journeys Delhi",
    registrationNumber: "VH-P-2025-005",
    market: "India",
    socialMedia: "@saffronjourneys",
    website: "www.saffronjourneys.in",
    agents: [
      { name: "Rahul Kapoor", position: "Managing Director", phone: "+91 98100 55667", email: "rahul@saffronjourneys.in" },
    ],
    partnershipStatus: "Prospect",
    rating: 3,
    email: "info@saffronjourneys.in",
    telephone: "+91 11 4567 2345",
    address: "Connaught Place, Block A",
    city: "New Delhi",
    country: "India",
    notes: "New prospect. First group confirmed for April 2026.",
  },
  {
    id: 6,
    companyName: "Gulf Horizons Travel",
    registrationNumber: "VH-P-2025-006",
    market: "GCC",
    socialMedia: "@gulfhorizons",
    website: "www.gulfhorizons.com.kw",
    agents: [
      { name: "Ahmed Al Rashidi", position: "Sales Director", phone: "+965 9988 7766", email: "ahmed@gulfhorizons.com.kw" },
      { name: "Sara Al Hamdan", position: "Groups Coordinator", phone: "+965 9988 5544", email: "sara@gulfhorizons.com.kw" },
    ],
    partnershipStatus: "Inactive",
    rating: 2,
    email: "travel@gulfhorizons.com.kw",
    telephone: "+965 2234 5678",
    address: "Fahad Al Salem St, Floor 4",
    city: "Kuwait City",
    country: "Kuwait",
    notes: "Inactive since late 2025. Follow up for re-engagement.",
  },
];
