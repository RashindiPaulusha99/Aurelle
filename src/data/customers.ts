import { db } from "./db";
import { generateId } from "@/lib/format";
import type { Address, Customer, SizeProfile } from "./types";

export function findCustomerByEmail(email: string): Customer | undefined {
  return db.getCustomers().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getCustomerById(id: string): Customer | undefined {
  return db.getCustomers().find((c) => c.id === id);
}

export interface LoginResult {
  ok: boolean;
  customer?: Customer;
  error?: string;
}

/** Mock-only credential check — plaintext comparison, never ships to a real backend. */
export function login(email: string, password: string): LoginResult {
  const customer = findCustomerByEmail(email);
  if (!customer) return { ok: false, error: "No account found with that email." };
  if (customer.password !== password) return { ok: false, error: "Incorrect password." };
  return { ok: true, customer };
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export function register(input: RegisterInput): LoginResult {
  if (findCustomerByEmail(input.email)) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const customer: Customer = {
    id: generateId("cust"),
    name: input.name,
    email: input.email,
    phone: input.phone,
    password: input.password,
    role: "customer",
    addresses: [],
    wishlistIds: [],
    createdAt: new Date().toISOString(),
  };
  const customers = db.getCustomers();
  customers.push(customer);
  db.saveCustomers(customers);
  return { ok: true, customer };
}

function saveCustomer(updated: Customer): void {
  const customers = db.getCustomers();
  const idx = customers.findIndex((c) => c.id === updated.id);
  if (idx >= 0) customers[idx] = updated;
  db.saveCustomers(customers);
}

export function updateProfile(customerId: string, patch: Partial<Pick<Customer, "name" | "email" | "phone">>): Customer | undefined {
  const customer = getCustomerById(customerId);
  if (!customer) return undefined;
  const updated = { ...customer, ...patch };
  saveCustomer(updated);
  return updated;
}

export function saveSizeProfile(customerId: string, profile: SizeProfile): Customer | undefined {
  const customer = getCustomerById(customerId);
  if (!customer) return undefined;
  const updated = { ...customer, sizeProfile: profile };
  saveCustomer(updated);
  return updated;
}

export function addAddress(customerId: string, address: Omit<Address, "id">): Customer | undefined {
  const customer = getCustomerById(customerId);
  if (!customer) return undefined;
  const newAddress: Address = { ...address, id: generateId("addr") };
  const addresses = address.isDefault
    ? [...customer.addresses.map((a) => ({ ...a, isDefault: false })), newAddress]
    : [...customer.addresses, newAddress];
  const updated = { ...customer, addresses };
  saveCustomer(updated);
  return updated;
}

export function updateAddress(customerId: string, address: Address): Customer | undefined {
  const customer = getCustomerById(customerId);
  if (!customer) return undefined;
  let addresses = customer.addresses.map((a) => (a.id === address.id ? address : a));
  if (address.isDefault) {
    addresses = addresses.map((a) => ({ ...a, isDefault: a.id === address.id }));
  }
  const updated = { ...customer, addresses };
  saveCustomer(updated);
  return updated;
}

export function deleteAddress(customerId: string, addressId: string): Customer | undefined {
  const customer = getCustomerById(customerId);
  if (!customer) return undefined;
  const updated = { ...customer, addresses: customer.addresses.filter((a) => a.id !== addressId) };
  saveCustomer(updated);
  return updated;
}

export function toggleWishlist(customerId: string, productId: string): Customer | undefined {
  const customer = getCustomerById(customerId);
  if (!customer) return undefined;
  const has = customer.wishlistIds.includes(productId);
  const wishlistIds = has
    ? customer.wishlistIds.filter((id) => id !== productId)
    : [...customer.wishlistIds, productId];
  const updated = { ...customer, wishlistIds };
  saveCustomer(updated);
  return updated;
}

export function getAllCustomers(): Customer[] {
  return db.getCustomers();
}
