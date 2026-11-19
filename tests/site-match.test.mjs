import test from "node:test";
import assert from "node:assert/strict";
import { DISMISS_TTL_MS, detectOfficialUpgradePage, isDismissed } from "../src/lib/site-match.js";

test("detectOfficialUpgradePage matches upgrade/pricing routes on the 4 official sites", () => {
  assert.deepEqual(detectOfficialUpgradePage("https://chatgpt.com/#pricing"), { providerId: "gpt" });
  assert.deepEqual(detectOfficialUpgradePage("https://chatgpt.com/pricing"), { providerId: "gpt" });
  assert.deepEqual(detectOfficialUpgradePage("https://openai.com/chatgpt/pricing/"), { providerId: "gpt" });
  assert.deepEqual(detectOfficialUpgradePage("https://claude.ai/upgrade"), { providerId: "claude" });
  assert.deepEqual(detectOfficialUpgradePage("https://claude.ai/settings/billing"), { providerId: "claude" });
  assert.deepEqual(detectOfficialUpgradePage("https://www.anthropic.com/pricing"), { providerId: "claude" });
  assert.deepEqual(detectOfficialUpgradePage("https://gemini.google.com/u/0/upgrade"), { providerId: "gemini" });
  assert.deepEqual(detectOfficialUpgradePage("https://one.google.com/about/google-ai-plans/"), { providerId: "gemini" });
  assert.deepEqual(detectOfficialUpgradePage("https://grok.com/plans"), { providerId: "grok" });
  assert.deepEqual(detectOfficialUpgradePage("https://grok.com/?pricing=true"), { providerId: "grok" });
});

test("detectOfficialUpgradePage never triggers on regular chat pages or unrelated sites", () => {
  assert.equal(detectOfficialUpgradePage("https://chatgpt.com/"), null);
  assert.equal(detectOfficialUpgradePage("https://chatgpt.com/c/abc-123"), null);
  assert.equal(detectOfficialUpgradePage("https://claude.ai/new"), null);
  assert.equal(detectOfficialUpgradePage("https://claude.ai/chat/12345"), null);
  assert.equal(detectOfficialUpgradePage("https://gemini.google.com/app"), null);
  assert.equal(detectOfficialUpgradePage("https://grok.com/"), null);
  assert.equal(detectOfficialUpgradePage("https://example.com/pricing"), null);
});

test("isDismissed respects 7-day quiet period", () => {
  const now = Date.parse("2026-11-19T12:00:00Z");
  assert.equal(isDismissed(null, now), false);
  assert.equal(isDismissed(now - 1000, now), true);
  assert.equal(isDismissed(now - DISMISS_TTL_MS - 1, now), false);
});
