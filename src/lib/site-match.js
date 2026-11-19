export const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const HOST_TO_PROVIDER = [
  { test: (h) => h === "chatgpt.com" || h.endsWith(".chatgpt.com") || h === "openai.com" || h.endsWith(".openai.com"), providerId: "gpt" },
  { test: (h) => h === "claude.ai" || h.endsWith(".claude.ai") || h === "anthropic.com" || h.endsWith(".anthropic.com"), providerId: "claude" },
  { test: (h) => h === "gemini.google.com" || h === "one.google.com", providerId: "gemini" },
  { test: (h) => h === "grok.com" || h.endsWith(".grok.com") || h === "x.ai" || h.endsWith(".x.ai"), providerId: "grok" },
];

// 只匹配明确的订阅 / 升级 / 价格 / 账单路径或锚点，普通对话页绝不打扰
const UPGRADE_PATH_RE = /(?:^|\/)(?:pricing|upgrade|plans|billing|subscribe|subscriptions|google-ai-plans|ai-plans)(?:\/|$)/i;
const UPGRADE_HASH_RE = /^#(?:pricing|upgrade|plans|subscribe|billing)\b/i;
const UPGRADE_QUERY_RE = /(?:^|[?&])(?:pricing|upgrade|plan)=/i;

export function detectOfficialUpgradePage(urlString) {
  if (!urlString) return null;
  let url;
  try {
    url = new URL(urlString);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();
  const matched = HOST_TO_PROVIDER.find((entry) => entry.test(host));
  if (!matched) return null;

  const isUpgrade =
    UPGRADE_PATH_RE.test(url.pathname) ||
    UPGRADE_HASH_RE.test(url.hash) ||
    UPGRADE_QUERY_RE.test(url.search);

  if (!isUpgrade) return null;
  return { providerId: matched.providerId };
}

export function isDismissed(dismissedAt, nowMs = Date.now()) {
  if (!dismissedAt) return false;
  return nowMs - Number(dismissedAt) < DISMISS_TTL_MS;
}
