export function formatLKR(cents: number): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

let counter = 0;
export function generateId(prefix = "id"): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}

export function generateOrderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `AU${n}`;
}
