export type ConfirmationStatus = "Confirmed" | "Ongoing" | "Completed";

export interface Confirmation {
  id: number;
  fileNo: string;
  agent: string;
  partner: string;
  start: string;      // YYYY-MM-DD
  end: string;
  hotels: string;
  guide: string;
  driver: string;
  guests: number;
  guestName: string;
  invoice: string;
  amountPaid: number;
  paid: boolean;
  paidInIndia: boolean;
  paymentMethod: string;
  expenses: number;
  revenue: number;    // used to compute profit
  status: ConfirmationStatus;
  createdBy: string;
}

export const mockConfirmations: Confirmation[] = [
  {
    id: 1,
    fileNo: "VH-CF-2026-001",
    agent: "Priya Sharma",
    partner: "Cosmos Travel India",
    start: "2026-04-10",
    end: "2026-04-17",
    hotels: "Rooms Hotel Tbilisi, Château Mukhrani",
    guide: "Giorgi K.",
    driver: "Levan T.",
    guests: 6,
    guestName: "Sharma Family",
    invoice: "INV-2026-041",
    amountPaid: 4800,
    paid: true,
    paidInIndia: true,
    paymentMethod: "Bank Transfer",
    expenses: 2950,
    revenue: 4800,
    status: "Confirmed",
    createdBy: "Admin",
  },
  {
    id: 2,
    fileNo: "VH-CF-2026-002",
    agent: "Khalid Al Mansouri",
    partner: "Al Raha Tours Dubai",
    start: "2026-03-14",
    end: "2026-03-21",
    hotels: "Stamba Hotel, Old Tbilisi Boutique",
    guide: "Nino B.",
    driver: "Irakli M.",
    guests: 4,
    guestName: "Al Mansouri Group",
    invoice: "INV-2026-032",
    amountPaid: 3200,
    paid: true,
    paidInIndia: false,
    paymentMethod: "Cash",
    expenses: 1980,
    revenue: 3200,
    status: "Ongoing",
    createdBy: "Nino G.",
  },
  {
    id: 3,
    fileNo: "VH-CF-2026-003",
    agent: "Ankit Verma",
    partner: "Wanderlust Holidays Mumbai",
    start: "2026-05-05",
    end: "2026-05-12",
    hotels: "Radisson Blu Batumi, Sheraton Metechi",
    guide: "Tamara D.",
    driver: "Zurab A.",
    guests: 8,
    guestName: "Verma & Associates",
    invoice: "INV-2026-051",
    amountPaid: 2400,
    paid: false,
    paidInIndia: false,
    paymentMethod: "Pending",
    expenses: 3800,
    revenue: 5600,
    status: "Confirmed",
    createdBy: "Lasha M.",
  },
  {
    id: 4,
    fileNo: "VH-CF-2026-004",
    agent: "Fatima Al Zaabi",
    partner: "Arabian Escapes Abu Dhabi",
    start: "2026-02-20",
    end: "2026-02-27",
    hotels: "Kopala Mtsketa, Ananuri Resort",
    guide: "David S.",
    driver: "Mamuka G.",
    guests: 10,
    guestName: "Al Zaabi Party",
    invoice: "INV-2026-022",
    amountPaid: 7200,
    paid: true,
    paidInIndia: false,
    paymentMethod: "Card",
    expenses: 5100,
    revenue: 7200,
    status: "Completed",
    createdBy: "Admin",
  },
];
