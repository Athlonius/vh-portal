export type UserRole = "Manager" | "Developer" | "Sales" | "Incoming Assistant" | "Operations" | "Finance";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string; // YYYY-MM-DD
}

export const ROLES: UserRole[] = [
  "Manager", "Developer", "Sales", "Incoming Assistant", "Operations", "Finance",
];

export const roleStyle: Record<UserRole, { bg: string; color: string }> = {
  Manager:              { bg: "#2D1B4E", color: "#C084FC" },
  Developer:            { bg: "#1E3A5F", color: "#60A5FA" },
  Sales:                { bg: "#0D2E1A", color: "#4ADE80" },
  "Incoming Assistant": { bg: "#0C2E36", color: "#22D3EE" },
  Operations:           { bg: "#3B1A0A", color: "#FB923C" },
  Finance:              { bg: "#2E2A00", color: "#FCD34D" },
};

export const mockUsers: User[] = [
  {
    id: 1,
    firstName: "Nino",
    lastName: "Giorgadze",
    telephone: "+995 599 100 111",
    email: "nino@vh-portal.ge",
    role: "Manager",
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    firstName: "Lasha",
    lastName: "Mchedlidze",
    telephone: "+995 577 200 222",
    email: "lasha@vh-portal.ge",
    role: "Sales",
    active: true,
    createdAt: "2024-02-03",
  },
  {
    id: 3,
    firstName: "Tamar",
    lastName: "Dolidze",
    telephone: "+995 591 300 333",
    email: "tamar@vh-portal.ge",
    role: "Incoming Assistant",
    active: true,
    createdAt: "2024-03-20",
  },
  {
    id: 4,
    firstName: "Giorgi",
    lastName: "Kvaratskhelia",
    telephone: "+995 555 400 444",
    email: "giorgi@vh-portal.ge",
    role: "Operations",
    active: true,
    createdAt: "2024-05-11",
  },
  {
    id: 5,
    firstName: "Ana",
    lastName: "Beridze",
    telephone: "+995 598 500 555",
    email: "ana@vh-portal.ge",
    role: "Finance",
    active: false,
    createdAt: "2024-08-07",
  },
  {
    id: 6,
    firstName: "David",
    lastName: "Sulaberidze",
    telephone: "+995 593 600 666",
    email: "david@vh-portal.ge",
    role: "Developer",
    active: true,
    createdAt: "2025-01-02",
  },
];
