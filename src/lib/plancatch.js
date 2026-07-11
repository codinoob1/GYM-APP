//replace with React api context memory insted of local storage

const CACHE_KEY = "V2";

export function getCachedData(parsedPlan) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(parsedPlan));
  } catch (e) {
    console.error("Failed to cache plan:", e);
  }
}

export function getFromCached() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function clearCachedData() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}
