import type { Customer } from "../types";

// Demo accounts seeded on first run. Plaintext passwords are a mock-only shortcut —
// a real backend must hash credentials; this never ships past the frontend-only phase.
export const CUSTOMERS: Customer[] = [
  {
    id: "cust-admin",
    name: "Valestra Admin",
    email: "admin@valestra.lk",
    phone: "+94 77 123 4567",
    password: "admin123",
    role: "admin",
    addresses: [],
    wishlistIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "cust-demo",
    name: "Nadeesha Kumari",
    email: "demo@valestra.lk",
    phone: "+94 71 987 6543",
    password: "demo123",
    role: "customer",
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        recipientName: "Nadeesha Kumari",
        phone: "+94 71 987 6543",
        district: "Colombo",
        city: "Dehiwala",
        addressLine: "12/4 Galle Road",
        isDefault: true,
      },
    ],
    wishlistIds: [],
    createdAt: new Date().toISOString(),
  },
];
