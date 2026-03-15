export type HotelStars = "Boutique" | "3" | "4" | "5";
export type HotelStatus = "Active" | "Not Operational";

export interface Hotel {
  id: number;
  name: string;
  stars: HotelStars;
  city: string;
  country: string;
  address: string;
  email: string;
  phone: string;
  contactPerson: string;
  contactPhone: string;
  contactPosition: string;
  contactEmail: string;
  status: HotelStatus;
}

export const GEORGIAN_CITIES = [
  "Tbilisi", "Batumi", "Gudauri", "Borjomi", "Kazbegi",
  "Kutaisi", "Sighnaghi", "Mtskheta", "Gori", "Telavi",
];

export const mockHotels: Hotel[] = [
  {
    id: 1,
    name: "Rooms Hotel Tbilisi",
    stars: "Boutique",
    city: "Tbilisi",
    country: "Georgia",
    address: "14 Merab Kostava St, Tbilisi 0108",
    email: "reservations@roomshotels.com",
    phone: "+995 32 220 9000",
    contactPerson: "Nino Beridze",
    contactPhone: "+995 599 100 200",
    contactPosition: "Reservations Manager",
    contactEmail: "nino.beridze@roomshotels.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Stamba Hotel",
    stars: "5",
    city: "Tbilisi",
    country: "Georgia",
    address: "12 Merab Kostava St, Tbilisi 0108",
    email: "info@stambahotel.com",
    phone: "+995 32 292 4500",
    contactPerson: "Giorgi Lomidze",
    contactPhone: "+995 577 210 310",
    contactPosition: "Sales Director",
    contactEmail: "g.lomidze@stambahotel.com",
    status: "Active",
  },
  {
    id: 3,
    name: "Radisson Blu Batumi",
    stars: "5",
    city: "Batumi",
    country: "Georgia",
    address: "2 Ninoshvili St, Batumi 6000",
    email: "info.batumi@radissonblu.com",
    phone: "+995 422 229 000",
    contactPerson: "Ana Kvaratskhelia",
    contactPhone: "+995 598 330 440",
    contactPosition: "Groups & Events Manager",
    contactEmail: "a.kvaratskhelia@radissonblu.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Gudauri Hut",
    stars: "3",
    city: "Gudauri",
    country: "Georgia",
    address: "Gudauri Village, Kazbegi District",
    email: "booking@gudaurihut.ge",
    phone: "+995 32 245 6789",
    contactPerson: "Lasha Mchedlishvili",
    contactPhone: "+995 555 670 780",
    contactPosition: "Owner",
    contactEmail: "lasha@gudaurihut.ge",
    status: "Active",
  },
  {
    id: 5,
    name: "Château Mukhrani",
    stars: "Boutique",
    city: "Mtskheta",
    country: "Georgia",
    address: "Mukhrani Village, Mtskheta Municipality",
    email: "stay@chateaumukhrani.com",
    phone: "+995 32 260 1010",
    contactPerson: "Tamar Dolidze",
    contactPhone: "+995 591 780 890",
    contactPosition: "Reservations",
    contactEmail: "t.dolidze@chateaumukhrani.com",
    status: "Active",
  },
  {
    id: 6,
    name: "Rooms Hotel Kazbegi",
    stars: "4",
    city: "Kazbegi",
    country: "Georgia",
    address: "1 Kazbegi Ave, Stepantsminda 4700",
    email: "kazbegi@roomshotels.com",
    phone: "+995 32 220 9100",
    contactPerson: "David Sulaberidze",
    contactPhone: "+995 599 910 020",
    contactPosition: "Front Office Manager",
    contactEmail: "d.sulaberidze@roomshotels.com",
    status: "Not Operational",
  },
];
