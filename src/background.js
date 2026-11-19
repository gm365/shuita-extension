import { fetchIndex, fetchSkuDetail } from "./lib/api.js";
import { buildProviderCards, formatMoney, skuUrl } from "./lib/catalog.js";
import { detectOfficialUpgradePage, isDismissed } from "./lib/site-match.js";

const PREF_PINNED_KEY = "prefs:pinnedSkus";
const PREF_PILL_KEY = "prefs:pillEnabled";
const DISMISS_PREFIX = "dismissed:";

async function handleGetPageOffer(url) {
  const match = detectOfficialUpgradePage(url);
  if (!match) return { ok: true, offer: null };

  const dismissKey = `${DISMISS_PREFIX}${match.providerId}`;
  const stored = await chrome.storage.local.get([dismissKey, PREF_PINNED_KEY, PREF_PILL_KEY]);
  if (stored[PREF_PILL_KEY] === false || isDismissed(stored[dismissKey])) {
    return { ok: true, offer: null };
  }

  const indexRes = await fetchIndex({ force: false });
  const cards = buildProviderCards(indexRes.data?.products || [], stored[PREF_PINNED_KEY] || {});
  const card = cards.find((c) => c.provider.id === match.providerId);
  if (!card?.selected || card.selected.min_price == null) {
    return { ok: true, offer: null };
  }

  return {
    ok: true,
    offer: {
      providerId: match.providerId,
      providerLabel: card.provider.label,
      sku: card.selected.sku,
      name: card.selected.name,
      priceText: formatMoney(card.selected.min_price),
      merchants: card.selected.merchants || 0,
      url: skuUrl(card.selected.sku),
    },
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== "string") return false;

  if (message.type === "GET_INDEX") {
    fetchIndex({ force: Boolean(message.force) })
      .then((result) => sendResponse({ ok: true, ...result }))
      .catch((err) => sendResponse({ ok: false, error: err?.message || "加载失败" }));
    return true;
  }

  if (message.type === "GET_SKU") {
    fetchSkuDetail(message.sku, { force: Boolean(message.force) })
      .then((result) => sendResponse({ ok: true, ...result }))
      .catch((err) => sendResponse({ ok: false, error: err?.message || "加载失败" }));
    return true;
  }

  if (message.type === "GET_PAGE_OFFER") {
    handleGetPageOffer(message.url)
      .then((result) => sendResponse(result))
      .catch(() => sendResponse({ ok: true, offer: null }));
    return true;
  }

  if (message.type === "DISMISS_PAGE_OFFER") {
    const providerId = String(message.providerId || "");
    if (!/^[a-z]+$/.test(providerId)) {
      sendResponse({ ok: false });
      return false;
    }
    chrome.storage.local
      .set({ [`${DISMISS_PREFIX}${providerId}`]: Date.now() })
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }

  return false;
});
