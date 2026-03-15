export type RequestStatus = "In Progress" | "Quoted" | "Confirmed" | "Cancelled" | "Lost";

export interface Request {
  id: number;
  requestDate: string;
  requestNumber: string;
  travelDateFrom: string;
  travelDateTo: string;
  nights: number;
  guests: number;
  travelAgency: string;
  agent: string;
  status: RequestStatus;
  createdBy: string;
}

export const mockRequests: Request[] = [
  {
    id: 1,
    requestDate: "2025-03-01",
    requestNumber: "VH-2025-001",
    travelDateFrom: "2025-05-10",
    travelDateTo: "2025-05-17",
    nights: 7,
    guests: 4,
    travelAgency: "Cosmos Travel India",
    agent: "Priya Sharma",
    status: "Confirmed",
    createdBy: "Admin",
  },
  {
    id: 2,
    requestDate: "2025-03-04",
    requestNumber: "VH-2025-002",
    travelDateFrom: "2025-06-02",
    travelDateTo: "2025-06-09",
    nights: 7,
    guests: 6,
    travelAgency: "Al Raha Tours Dubai",
    agent: "Khalid Al Mansouri",
    status: "In Progress",
    createdBy: "Nino G.",
  },
  {
    id: 3,
    requestDate: "2025-03-07",
    requestNumber: "VH-2025-003",
    travelDateFrom: "2025-07-15",
    travelDateTo: "2025-07-21",
    nights: 6,
    guests: 2,
    travelAgency: "Wanderlust Holidays Mumbai",
    agent: "Ankit Verma",
    status: "Quoted",
    createdBy: "Lasha M.",
  },
  {
    id: 4,
    requestDate: "2025-03-10",
    requestNumber: "VH-2025-004",
    travelDateFrom: "2025-05-28",
    travelDateTo: "2025-06-04",
    nights: 7,
    guests: 10,
    travelAgency: "Gulf Horizons Travel",
    agent: "Sara Al Hamdan",
    status: "Cancelled",
    createdBy: "Admin",
  },
  {
    id: 5,
    requestDate: "2025-03-12",
    requestNumber: "VH-2025-005",
    travelDateFrom: "2025-08-05",
    travelDateTo: "2025-08-12",
    nights: 7,
    guests: 8,
    travelAgency: "Spice Route Tours Bangalore",
    agent: "Meena Pillai",
    status: "Lost",
    createdBy: "Nino G.",
  },
  {
    id: 6,
    requestDate: "2025-03-14",
    requestNumber: "VH-2025-006",
    travelDateFrom: "2025-09-01",
    travelDateTo: "2025-09-08",
    nights: 7,
    guests: 3,
    travelAgency: "Saffron Journeys Delhi",
    agent: "Rahul Kapoor",
    status: "In Progress",
    createdBy: "Lasha M.",
  },
  {
    id: 7,
    requestDate: "2025-03-15",
    requestNumber: "VH-2025-007",
    travelDateFrom: "2025-06-20",
    travelDateTo: "2025-06-25",
    nights: 5,
    guests: 5,
    travelAgency: "Arabian Escapes Abu Dhabi",
    agent: "Fatima Al Zaabi",
    status: "Quoted",
    createdBy: "Admin",
  },
];
