import {
  PROVIDER_LOGO_PATHS,
  buildProviderCards,
  formatFeeTag,
  formatMoney,
  formatRelativeTime,
  formatStockLabel,
  rankOffers,
  skuUrl,
} from "./lib/catalog.js";

const PREF_PINNED_KEY = "prefs:pinnedSkus";
const PREF_PILL_KEY = "prefs:pillEnabled";

const state = {
  indexData: null,
  pinnedSkus: {},
  pillEnabled: true,
  expandedProvider: null,
  skuDetails: new Map(), // sku -> { loading, data, error }
};

// 持久化各 provider 卡片的 DOM 引用，避免点击展开或数据到达时重建整个列表造成闪烁/跳动
const cardNodes = new Map();

const cardsEl = document.getElementById("cards");
const pillToggleEl = document.getElementById("pillToggle");
const refreshBtnEl = document.getElementById("refreshBtn");
const statusBannerEl = document.getElementById("statusBanner");
const updatedTextEl = document.getElementById("updatedText");

function sendMessage(payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response || !response.ok) {
        reject(new Error(response?.error || "请求失败"));
        return;
      }
      resolve(response);
    });
  });
}

function showBanner(text, isError = false) {
  if (!text) {
    statusBannerEl.hidden = true;
    statusBannerEl.textContent = "";
    statusBannerEl.classList.remove("error");
    return;
  }
  statusBannerEl.hidden = false;
  statusBannerEl.textContent = text;
  statusBannerEl.classList.toggle("error", isError);
}

function createProviderSvg(providerId) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "19");
  svg.setAttribute("height", "19");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", PROVIDER_LOGO_PATHS[providerId] || "");
  svg.appendChild(path);
  return svg;
}

function createChevronSvg(size = 15, className = "chevron") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2.2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  poly.setAttribute("points", "6 9 12 15 18 9");
  svg.appendChild(poly);
  return svg;
}

function getCurrentCards() {
  return buildProviderCards(state.indexData?.products || [], state.pinnedSkus);
}

function renderFooter() {
  const data = state.indexData;
  if (!data) return;
  const rel = formatRelativeTime(data.generated_at || data.stats?.updated) || "实时同步";
  const parts = [rel];
  if (data.stats?.shops) parts.push(`${data.stats.shops} 家店`);
  updatedTextEl.textContent = parts.join(" · ");
}

function buildCardShell(provider) {
  const article = document.createElement("article");
  article.className = "card";
  article.dataset.provider = provider.id;

  const mainBtn = document.createElement("button");
  mainBtn.type = "button";
  mainBtn.className = "card-main";
  mainBtn.setAttribute("aria-expanded", "false");

  const left = document.createElement("div");
  left.className = "card-left";

  const badge = document.createElement("span");
  badge.className = "provider-badge";
  badge.appendChild(createProviderSvg(provider.id));

  const info = document.createElement("div");
  info.className = "card-info";

  const pName = document.createElement("span");
  pName.className = "provider-name";
  pName.textContent = provider.label;

  const skuMetaEl = document.createElement("span");
  skuMetaEl.className = "sku-meta";

  info.append(pName, skuMetaEl);
  left.append(badge, info);

  const right = document.createElement("div");
  right.className = "card-right";

  const priceLine = document.createElement("div");
  priceLine.className = "price-line";

  const priceUnit = document.createElement("span");
  priceUnit.className = "price-unit";
  priceUnit.textContent = "¥";

  const priceNum = document.createElement("span");
  priceNum.className = "price-num";

  const priceSuffix = document.createElement("span");
  priceSuffix.className = "price-suffix";
  priceSuffix.textContent = "起";

  priceLine.append(priceUnit, priceNum, priceSuffix);

  const chevronWrap = document.createElement("span");
  chevronWrap.className = "chevron-wrap";
  chevronWrap.appendChild(createChevronSvg());

  right.append(priceLine, chevronWrap);
  mainBtn.append(left, right);

  const collapse = document.createElement("div");
  collapse.className = "card-collapse";

  const collapseInner = document.createElement("div");
  collapseInner.className = "card-collapse-inner";

  const detail = document.createElement("div");
  detail.className = "card-detail";

  const specRow = document.createElement("div");
  specRow.className = "spec-row";
  specRow.hidden = true;

  const specLabel = document.createElement("span");
  specLabel.className = "spec-label";
  specLabel.textContent = "规格";

  const selectWrap = document.createElement("div");
  selectWrap.className = "select-wrap";

  const specSelect = document.createElement("select");
  specSelect.className = "spec-select";
  specSelect.setAttribute("aria-label", `选择 ${provider.label} 规格`);

  selectWrap.append(specSelect, createChevronSvg(13, "select-arrow"));
  specRow.append(specLabel, selectWrap);

  const offersWrap = document.createElement("div");
  offersWrap.className = "offers-list";

  const cta = document.createElement("a");
  cta.className = "cta-link";
  cta.target = "_blank";
  cta.rel = "noopener noreferrer";

  detail.append(specRow, offersWrap, cta);
  collapseInner.appendChild(detail);
  collapse.appendChild(collapseInner);
  article.append(mainBtn, collapse);

  const refs = {
    providerId: provider.id,
    article,
    mainBtn,
    skuMetaEl,
    priceUnit,
    priceNum,
    priceSuffix,
    specRow,
    specSelect,
    offersWrap,
    cta,
    renderedOptionsKey: "",
    currentSku: null,
  };

  mainBtn.addEventListener("click", () => {
    if (!refs.currentSku) return;
    const willExpand = state.expandedProvider !== provider.id;
    state.expandedProvider = willExpand ? provider.id : null;
    syncExpandStates();
    if (willExpand) {
      ensureSkuDetail(refs.currentSku);
    }
  });

  specSelect.addEventListener("change", async (e) => {
    const nextSku = e.target.value;
    state.pinnedSkus = { ...state.pinnedSkus, [provider.id]: nextSku };
    await chrome.storage.local.set({ [PREF_PINNED_KEY]: state.pinnedSkus });
    syncAllCards();
    ensureSkuDetail(nextSku);
  });

  return refs;
}

function renderOffersInto(offersWrap, sku) {
  const skuState = state.skuDetails.get(sku);
  offersWrap.textContent = "";

  if (!skuState || (skuState.loading && !skuState.data)) {
    for (let i = 0; i < 3; i += 1) {
      const sk = document.createElement("div");
      sk.className = "offer-skeleton";
      offersWrap.appendChild(sk);
    }
    return;
  }

  if (skuState.error && !skuState.data) {
    const errEl = document.createElement("div");
    errEl.className = "detail-hint";
    errEl.textContent = `报价明细加载失败（${skuState.error}）`;
    offersWrap.appendChild(errEl);
    return;
  }

  const topOffers = rankOffers(skuState.data?.shop_floors || [], false, 3);
  if (topOffers.length === 0) {
    const empty = document.createElement("div");
    empty.className = "detail-hint";
    empty.textContent = "暂无可展示的店铺报价";
    offersWrap.appendChild(empty);
    return;
  }

  topOffers.forEach((offer, idx) => {
    const row = document.createElement("div");
    row.className = idx === 0 && offer.inStock ? "offer-row top-one" : "offer-row";

    const left = document.createElement("div");
    left.className = "offer-left";

    const rank = document.createElement("span");
    rank.className = "rank-badge";
    rank.textContent = String(idx + 1);

    const shopCol = document.createElement("div");
    shopCol.className = "offer-shop";

    const shopName = document.createElement("span");
    shopName.className = "offer-shop-name";
    shopName.textContent = offer.shop_name || offer.shop_token || "收录店铺";

    const metaParts = [];
    const stockLabel = formatStockLabel(offer);
    if (stockLabel) metaParts.push(stockLabel);
    const feeTag = formatFeeTag(offer);
    if (feeTag) metaParts.push(feeTag);

    const meta = document.createElement("span");
    meta.className = "offer-meta";
    meta.textContent = metaParts.join(" · ");

    shopCol.append(shopName, meta);
    left.append(rank, shopCol);

    const price = document.createElement("span");
    price.className = offer.inStock ? "offer-price" : "offer-price oos";
    price.textContent = `¥${formatMoney(offer.effectivePrice)}`;

    row.append(left, price);
    offersWrap.appendChild(row);
  });
}

function updateCardNode(refs, card) {
  const { selected, options } = card;
  refs.currentSku = selected?.sku || null;

  if (selected) {
    const parts = [selected.name];
    if (selected.merchants) parts.push(`${selected.merchants} 家有货`);
    refs.skuMetaEl.textContent = parts.join(" · ");
  } else {
    refs.skuMetaEl.textContent = "暂无报价";
  }

  if (selected?.min_price != null) {
    refs.priceUnit.hidden = false;
    refs.priceSuffix.hidden = false;
    refs.priceNum.textContent = formatMoney(selected.min_price);
  } else {
    refs.priceUnit.hidden = true;
    refs.priceSuffix.hidden = true;
    refs.priceNum.textContent = "-";
  }

  if (selected && options.length > 1) {
    refs.specRow.hidden = false;
    const optionsKey = options.map((o) => `${o.sku}:${o.min_price}`).join("|");
    if (refs.renderedOptionsKey !== optionsKey) {
      refs.renderedOptionsKey = optionsKey;
      refs.specSelect.textContent = "";
      for (const opt of options) {
        const optionEl = document.createElement("option");
        optionEl.value = opt.sku;
        optionEl.textContent = `${opt.name} · ¥${formatMoney(opt.min_price)} 起`;
        refs.specSelect.appendChild(optionEl);
      }
    }
    refs.specSelect.value = selected.sku;
  } else {
    refs.specRow.hidden = true;
  }

  if (selected) {
    refs.cta.href = skuUrl(selected.sku);
    refs.cta.textContent = `去水獭看 ${selected.name} 全部报价 ↗`;
    renderOffersInto(refs.offersWrap, selected.sku);
  }
}

function syncExpandStates() {
  for (const [providerId, refs] of cardNodes.entries()) {
    const expanded = state.expandedProvider === providerId && Boolean(refs.currentSku);
    refs.article.classList.toggle("expanded", expanded);
    refs.mainBtn.setAttribute("aria-expanded", String(expanded));
  }
}

function syncAllCards() {
  if (!state.indexData) return;
  const cards = getCurrentCards();

  if (cardNodes.size === 0) {
    cardsEl.textContent = "";
    for (const card of cards) {
      const refs = buildCardShell(card.provider);
      cardNodes.set(card.provider.id, refs);
      cardsEl.appendChild(refs.article);
    }
  }

  for (const card of cards) {
    const refs = cardNodes.get(card.provider.id);
    if (refs) updateCardNode(refs, card);
  }

  syncExpandStates();
  renderFooter();
}

function syncSingleSku(sku) {
  if (!state.indexData) return;
  for (const card of getCurrentCards()) {
    if (card.selected?.sku === sku) {
      const refs = cardNodes.get(card.provider.id);
      if (refs) updateCardNode(refs, card);
    }
  }
}

async function ensureSkuDetail(sku, force = false) {
  if (!sku) return;
  const current = state.skuDetails.get(sku);
  if (current?.loading) return;
  if (current?.data && !force) return;

  state.skuDetails.set(sku, { loading: true, data: current?.data || null, error: null });
  syncSingleSku(sku);

  try {
    const res = await sendMessage({ type: "GET_SKU", sku, force });
    state.skuDetails.set(sku, { loading: false, data: res.data, error: null });
  } catch (err) {
    state.skuDetails.set(sku, { loading: false, data: current?.data || null, error: err.message });
  }
  syncSingleSku(sku);
}

function prefetchVisibleSkus(force = false) {
  const skus = getCurrentCards()
    .map((c) => c.selected?.sku)
    .filter(Boolean);
  for (const sku of skus) {
    ensureSkuDetail(sku, force);
  }
}

function renderError(message) {
  cardNodes.clear();
  cardsEl.textContent = "";
  const box = document.createElement("div");
  box.className = "empty-state";

  const title = document.createElement("div");
  title.className = "empty-title";
  title.textContent = "暂时无法获取比价数据";

  const desc = document.createElement("div");
  desc.className = "empty-desc";
  desc.textContent = message || "请检查网络连接后重试";

  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "retry-btn";
  retry.textContent = "重新加载";
  retry.addEventListener("click", () => loadIndex(true));

  box.append(title, desc, retry);
  cardsEl.appendChild(box);
  updatedTextEl.textContent = "加载失败";
}

async function loadIndex(force = false) {
  refreshBtnEl.classList.add("spinning");
  refreshBtnEl.disabled = true;
  if (!force) showBanner("");

  try {
    const res = await sendMessage({ type: "GET_INDEX", force });
    state.indexData = res.data;
    if (res.stale) {
      showBanner(`网络异常，当前显示缓存数据（${res.error || "离线"}）`, false);
    } else if (res.throttled) {
      showBanner("刚刚已刷新过，请 30 秒后再试", false);
    } else {
      showBanner("");
    }
    syncAllCards();
    prefetchVisibleSkus(force && !res.throttled);
  } catch (err) {
    if (state.indexData) {
      showBanner(`刷新失败：${err.message}`, true);
    } else {
      renderError(err.message);
    }
  } finally {
    refreshBtnEl.classList.remove("spinning");
    refreshBtnEl.disabled = false;
  }
}

function updatePillToggleUi() {
  pillToggleEl.setAttribute("aria-checked", String(state.pillEnabled));
  pillToggleEl.title = state.pillEnabled
    ? "官网升级页比价浮窗：已开启（点击关闭）"
    : "官网升级页比价浮窗：已关闭（点击开启）";
}

async function init() {
  const stored = await chrome.storage.local.get([PREF_PINNED_KEY, PREF_PILL_KEY]);
  state.pinnedSkus = stored[PREF_PINNED_KEY] || {};
  state.pillEnabled = stored[PREF_PILL_KEY] !== false;
  updatePillToggleUi();

  pillToggleEl.addEventListener("click", async () => {
    state.pillEnabled = !state.pillEnabled;
    updatePillToggleUi();
    await chrome.storage.local.set({ [PREF_PILL_KEY]: state.pillEnabled });
    if (state.pillEnabled) {
      await chrome.storage.local.remove([
        "dismissed:gpt",
        "dismissed:claude",
        "dismissed:gemini",
        "dismissed:grok",
      ]);
    }
  });

  refreshBtnEl.addEventListener("click", () => loadIndex(true));

  await loadIndex(false);
}

init();
