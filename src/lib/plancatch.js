import Plan from "@/components/onBord/Plan";

const CACHE_KEY = "gym_tracker_cache";

export function getCachedData(Plan) {
  localStorage.getItem(CACHE_KEY, JSON.stringify(Plan));
}

export function getFromCached() {
  const Cached_Plan = localStorage.getItem(CACHE_KEY);
  return Cached_Plan ? JSON.parse(Cached_Plan) : null;
}

export function clearCachedData() {
  localStorage.removeItem(CACHE_KEY);
}
