import { SITE_ORIGIN } from "./catalog.js";

export const CACHE_TTL_MS = 10 * 60 * 1000;
export const FORCE_COOLDOWN_MS = 30 * 1000;

const INDEX_STORAGE_KEY = "cache:mcp:index";
const SKU_STORAGE_PREFIX = "cache:mcp:sku:";

const inflight = new Map();

function isValidSku(sku) {
  return typeof sku === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(sku);
}

async function readStorage(key) {
  const result = await chrome.storage.local.get(key);
  return result[key] || null;
}

async function writeStorage(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

async function fetchJson(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

async function getCachedOrFetch({ storageKey, url, force = false }) {
  const now = Date.now();
  const cached = await readStorage(storageKey);
  const age = cached ? now - cached.fetchedAt : Infinity;

  if (cached && !force && age < CACHE_TTL_MS) {
    return { data: cached.data, fetchedAt: cached.fetchedAt, fromCache: true, stale: false };
  }
  if (cached && force && age < FORCE_COOLDOWN_MS) {
    return { data: cached.data, fetchedAt: cached.fetchedAt, fromCache: true, stale: false, throttled: true };
  }

  if (inflight.has(storageKey)) {
    return inflight.get(storageKey);
  }

  const task = (async () => {
    try {
      const data = await fetchJson(url);
      const fetchedAt = Date.now();
      await writeStorage(storageKey, { data, fetchedAt });
      return { data, fetchedAt, fromCache: false, stale: false };
    } catch (err) {
      if (cached) {
        return {
          data: cached.data,
          fetchedAt: cached.fetchedAt,
          fromCache: true,
          stale: true,
          error: err.message || "网络请求失败",
        };
      }
      throw err;
    } finally {
      inflight.delete(storageKey);
    }
  })();

  inflight.set(storageKey, task);
  return task;
}

export function fetchIndex({ force = false } = {}) {
  return getCachedOrFetch({
    storageKey: INDEX_STORAGE_KEY,
    url: `${SITE_ORIGIN}/api/mcp/index.json`,
    force,
  });
}

export function fetchSkuDetail(sku, { force = false } = {}) {
  if (!isValidSku(sku)) {
    return Promise.reject(new Error("无效的 SKU 标识"));
  }
  return getCachedOrFetch({
    storageKey: `${SKU_STORAGE_PREFIX}${sku}`,
    url: `${SITE_ORIGIN}/api/mcp/sku/${encodeURIComponent(sku)}.json`,
    force,
  });
}
