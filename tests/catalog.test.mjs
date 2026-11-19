import test from "node:test";
import assert from "node:assert/strict";
import {
  buildProviderCards,
  formatFeeTag,
  formatMoney,
  formatRelativeTime,
  formatStockLabel,
  matchProvider,
  rankOffers,
  skuUrl,
} from "../src/lib/catalog.js";

test("matchProvider classifies core models consistently with shuita.xyz", () => {
  assert.equal(matchProvider("gpt", "gpt_plus_topup"), true);
  assert.equal(matchProvider("claude", "claude_pro"), true);
  assert.equal(matchProvider("gemini", "gemini_pro"), true);
  assert.equal(matchProvider("gemini", "antigravity"), true);
  assert.equal(matchProvider("grok", "grok_super"), true);
  assert.equal(matchProvider("grok", "cursor_pro"), true);
  assert.equal(matchProvider("gpt", "claude_pro"), false);
});

test("buildProviderCards picks highest-priority SKU per provider and respects pinnedSkus", () => {
  const products = [
    { sku: "gpt_plus_shared", name: "ChatGPT Plus 共享", min_price: 25, merchants: 10 },
    { sku: "gpt_plus_topup", name: "ChatGPT Plus 代充", min_price: 118, merchants: 18 },
    { sku: "claude_5x", name: "Claude Max 5x", min_price: 680, merchants: 5 },
    { sku: "claude_pro", name: "Claude Pro", min_price: 135, merchants: 12 },
    { sku: "gemini_pro", name: "Gemini Pro", min_price: 38, merchants: 9 },
    { sku: "grok_super", name: "SuperGrok", min_price: 180, merchants: 7 },
    { sku: "grok_plus", name: "Grok Plus", min_price: 88, merchants: 4 },
  ];

  const defaultCards = buildProviderCards(products);
  assert.deepEqual(
    defaultCards.map((c) => [c.provider.id, c.selected?.sku]),
    [
      ["gpt", "gpt_plus_topup"],
      ["claude", "claude_pro"],
      ["gemini", "gemini_pro"],
      ["grok", "grok_plus"],
    ],
  );

  const pinnedCards = buildProviderCards(products, { claude: "claude_5x", grok: "grok_super" });
  assert.equal(pinnedCards.find((c) => c.provider.id === "claude")?.selected?.sku, "claude_5x");
  assert.equal(pinnedCards.find((c) => c.provider.id === "grok")?.selected?.sku, "grok_super");
});

test("rankOffers prioritizes in-stock offers and respects RMB vs USDT mode", () => {
  const offers = [
    { shop_name: "断货低价店", price: 80, stock_status: "out" },
    { shop_name: "人民币低价店", price: 110, usdt_price: 108, stock_status: "in" },
    { shop_name: "USDT 优惠店", price: 120, usdt_price: 99, stock_status: "in" },
  ];

  const rmbRanked = rankOffers(offers, false, 3);
  assert.deepEqual(
    rmbRanked.map((o) => o.shop_name),
    ["人民币低价店", "USDT 优惠店", "断货低价店"],
  );

  const usdtRanked = rankOffers(offers, true, 3);
  assert.deepEqual(
    usdtRanked.map((o) => o.shop_name),
    ["USDT 优惠店", "人民币低价店", "断货低价店"],
  );
  assert.equal(usdtRanked[0].effectivePrice, 99);
  assert.equal(usdtRanked[0].usingUsdt, true);
});

test("formatting helpers handle money, fees, relative time, and URLs", () => {
  assert.equal(formatMoney(118), "118");
  assert.equal(formatMoney(118.5), "118.5");
  assert.equal(formatFeeTag({ fee: 2.5 }), "含费 ¥2.5");
  assert.equal(formatFeeTag({ usdt_only: true }), "仅收 USDT");
  assert.equal(formatFeeTag({ usingUsdt: true }), "USDT 价");
  assert.equal(formatStockLabel({ stock_status: "in_stock", stock_count: 28 }), "库存 28");
  assert.equal(formatStockLabel({ stock_status: "in_stock", stock_count: 15000 }), "库存 9999+");
  assert.equal(formatStockLabel({ stock_status: "in_stock", stock_count: null }), "有货");
  assert.equal(formatStockLabel({ stock_status: "out", stock_count: 0 }), "无货");
  assert.equal(formatStockLabel({ stock_status: "unknown" }), "库存未知");
  assert.equal(formatRelativeTime("2026-11-19T08:30:00Z", Date.parse("2026-11-19T08:42:00Z")), "12 分钟前更新");
  assert.equal(skuUrl("gpt_plus_topup"), "https://shuita.xyz/sku/gpt_plus_topup");
});
