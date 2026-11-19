export const SITE_ORIGIN = "https://shuita.xyz";

export const CORE_PROVIDERS = [
  { id: "gpt", label: "GPT", accent: "#10a37f" },
  { id: "claude", label: "Claude", accent: "#d97757" },
  { id: "gemini", label: "Gemini", accent: "#4285f4" },
  { id: "grok", label: "Grok", accent: "#1c1917" },
];

// 品牌图标路径来自 @lobehub/icons（MIT）
export const PROVIDER_LOGO_PATHS = {
  gpt: "M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.761 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z",
  claude: "M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z",
  gemini: "M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z",
  grok: "M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815",
};

// 与主站 SKU_ORDER 对齐，标准订阅优先于共享、短效与辅助账号
export const SKU_PRIORITY = [
  "gpt_plus_topup",
  "gpt_plus_topup_half",
  "gpt_plus_month",
  "gpt_plus_student",
  "gpt_plus_short",
  "gpt_plus_shared",
  "gpt_plus_year",
  "gpt_go",
  "gpt_go_year",
  "gpt_pro_5x",
  "gpt_pro_20x",
  "gpt_pro_500",
  "gpt_pro_short",
  "gpt_team_seat",
  "gpt_team_admin",
  "gpt_team_short",
  "claude_pro",
  "claude_5x",
  "claude_20x",
  "claude_team",
  "claude_pro_shared",
  "gemini_pro",
  "gemini_ultra",
  "gemini_ultra_family",
  "antigravity",
  "grok_plus",
  "grok_super",
  "grok_super_quarter",
  "grok_super_15x",
  "grok_heavy",
  "grok_heavy_quarter",
  "grok_short",
  "cursor_pro",
  "cursor_ultra",
  "x_premium",
];

const SKU_RANK = new Map(SKU_PRIORITY.map((sku, idx) => [sku, idx]));

export function matchProvider(providerId, sku) {
  if (!sku) return false;
  if (providerId === "gpt") return sku.startsWith("gpt_") || sku === "k12" || sku === "codex_credit";
  if (providerId === "claude") return sku.startsWith("claude_");
  if (providerId === "gemini") return sku.startsWith("gemini_") || sku.startsWith("antigravity");
  if (providerId === "grok") return sku.startsWith("grok_") || sku.startsWith("cursor_") || sku === "x_premium";
  return false;
}

export function sortProviderProducts(products) {
  return [...products].sort((a, b) => {
    const ra = SKU_RANK.has(a.sku) ? SKU_RANK.get(a.sku) : 9999;
    const rb = SKU_RANK.has(b.sku) ? SKU_RANK.get(b.sku) : 9999;
    if (ra !== rb) return ra - rb;
    return (b.merchants || 0) - (a.merchants || 0);
  });
}

/**
 * 为四大主力模型分别选出当前展示的 SKU 与可选规格列表。
 * 若用户在 pinnedSkus 里指定了某模型的规格且该规格存在报价，优先用用户选择；
 * 否则按主站展示优先级取第一个有报价的规格（与首页价签一致）。
 */
export function buildProviderCards(products = [], pinnedSkus = {}) {
  return CORE_PROVIDERS.map((provider) => {
    const allForProvider = sortProviderProducts(
      products.filter((p) => matchProvider(provider.id, p.sku) && p.min_price != null),
    );
    const pinnedId = pinnedSkus?.[provider.id];
    const selected =
      (pinnedId && allForProvider.find((p) => p.sku === pinnedId)) ||
      allForProvider[0] ||
      null;
    return {
      provider,
      selected,
      options: allForProvider,
    };
  });
}

export function isInStock(offer) {
  if (!offer) return false;
  const status = String(offer.stock_status || "").toLowerCase();
  if (status === "out" || status === "sold_out" || status === "oos") return false;
  if (typeof offer.stock_count === "number" && offer.stock_count <= 0) return false;
  return true;
}

/**
 * 报价排序：有货优先，再按当前支付口径（人民币到手价或 USDT 价）升序。
 */
export function rankOffers(offers = [], useUsdt = false, limit = 3) {
  const normalized = offers
    .filter((o) => o && (o.price != null || o.usdt_price != null))
    .map((o) => {
      const effectivePrice = useUsdt && o.usdt_price != null ? Number(o.usdt_price) : Number(o.price);
      const usingUsdt = Boolean(useUsdt && o.usdt_price != null);
      return {
        ...o,
        effectivePrice,
        usingUsdt,
        inStock: isInStock(o),
      };
    })
    .filter((o) => Number.isFinite(o.effectivePrice));

  normalized.sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    return a.effectivePrice - b.effectivePrice;
  });

  return limit > 0 ? normalized.slice(0, limit) : normalized;
}

export function formatMoney(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "-";
  return Number.isInteger(x) ? String(x) : String(Math.round(x * 100) / 100);
}

export function formatStockLabel(offer) {
  if (!offer) return "";
  const status = String(offer.stock_status || "").toLowerCase();
  const rawCount = offer.stock_count;
  const count = rawCount == null ? NaN : Number(rawCount);
  if (status === "out" || status === "sold_out" || status === "oos" || (Number.isFinite(count) && count <= 0)) {
    return "无货";
  }
  if (status === "in_stock" || status === "in") {
    if (Number.isFinite(count) && count > 0) {
      return count >= 10000 ? "库存 9999+" : `库存 ${Math.trunc(count)}`;
    }
    return "有货";
  }
  return "库存未知";
}

export function formatFeeTag(offer) {
  if (!offer) return "";
  if (offer.usingUsdt) return "USDT 价";
  if (offer.usdt_only) return "仅收 USDT";
  const fee = Number(offer.fee);
  if (Number.isFinite(fee) && fee > 0) return `含费 ¥${formatMoney(fee)}`;
  if (offer.usdt_price != null) return `USDT ¥${formatMoney(offer.usdt_price)}`;
  return "";
}

export function formatRelativeTime(isoString, nowMs = Date.now()) {
  if (!isoString) return "";
  const ts = Date.parse(isoString);
  if (!Number.isFinite(ts)) return "";
  const diffMin = Math.max(0, Math.floor((nowMs - ts) / 60000));
  if (diffMin < 1) return "刚刚更新";
  if (diffMin < 60) return `${diffMin} 分钟前更新`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} 小时前更新`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} 天前更新`;
}

export function skuUrl(sku) {
  return `${SITE_ORIGIN}/sku/${encodeURIComponent(sku)}`;
}
