import { type RequestStatus } from "../requests/mockData";

export interface Lead {
  id: number;
  requestNumber: string;
  travelAgency: string;
  agent: string;
  travelDateFrom: string;  // YYYY-MM-DD
  travelDateTo: string;
  guests: number;
  status: RequestStatus;
  nextFollowUp: string;    // YYYY-MM-DD
  lastFollowUpDate: string;
  lastFollowUpBy: string;
}

// Today reference: 2026-03-14
export const mockLeads: Lead[] = [
  {
    id: 1,
    requestNumber: "VH-2025-008",
    travelAgency: "Cosmos Travel India",
    agent: "Priya Sharma",
    travelDateFrom: "2026-03-18",
    travelDateTo: "2026-03-25",
    guests: 6,
    status: "In Progress",
    nextFollowUp: "2026-03-10",   // overdue
    lastFollowUpDate: "2026-03-05",
    lastFollowUpBy: "Nino G.",
  },
  {
    id: 2,
    requestNumber: "VH-2025-009",
    travelAgency: "Al Raha Tours Dubai",
    agent: "Khalid Al Mansouri",
    travelDateFrom: "2026-03-20",
    travelDateTo: "2026-03-27",
    guests: 4,
    status: "Quoted",
    nextFollowUp: "2026-03-14",   // due today
    lastFollowUpDate: "2026-03-09",
    lastFollowUpBy: "Lasha M.",
  },
  {
    id: 3,
    requestNumber: "VH-2025-010",
    travelAgency: "Wanderlust Holidays Mumbai",
    agent: "Ankit Verma",
    travelDateFrom: "2026-04-05",
    travelDateTo: "2026-04-12",
    guests: 8,
    status: "In Progress",
    nextFollowUp: "2026-03-18",   // upcoming, 22 days to arrival
    lastFollowUpDate: "2026-03-11",
    lastFollowUpBy: "Admin",
  },
  {
    id: 4,
    requestNumber: "VH-2025-011",
    travelAgency: "Saffron Journeys Delhi",
    agent: "Rahul Kapoor",
    travelDateFrom: "2026-05-10",
    travelDateTo: "2026-05-17",
    guests: 3,
    status: "Quoted",
    nextFollowUp: "2026-03-21",   // upcoming, 57 days to arrival
    lastFollowUpDate: "2026-03-07",
    lastFollowUpBy: "Nino G.",
  },
  {
    id: 5,
    requestNumber: "VH-2025-012",
    travelAgency: "Arabian Escapes Abu Dhabi",
    agent: "Fatima Al Zaabi",
    travelDateFrom: "2026-03-16",
    travelDateTo: "2026-03-23",
    guests: 10,
    status: "In Progress",
    nextFollowUp: "2026-03-13",   // overdue
    lastFollowUpDate: "2026-03-08",
    lastFollowUpBy: "Lasha M.",
  },
];
