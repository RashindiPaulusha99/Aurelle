const KEY = "aurelle:recently-viewed";
const MAX_ITEMS = 8;

export function trackRecentlyViewed(productId: string): void {
  if (typeof window === "undefined") return;
  const existing = getRecentlyViewed().filter((id) => id !== productId);
  const next = [productId, ...existing].slice(0, MAX_ITEMS);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
