import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FIREFOX_GECKO_SETTINGS, buildFirefoxManifest } from "../scripts/package-firefox.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("buildFirefoxManifest converts MV3 service_worker to Firefox scripts and keeps source immutable", () => {
  const raw = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  const snapshot = JSON.stringify(raw);

  const ff = buildFirefoxManifest(raw);

  assert.equal(JSON.stringify(raw), snapshot);
  assert.deepEqual(ff.background, {
    scripts: ["src/background.js"],
    type: "module",
  });
  assert.equal("service_worker" in ff.background, false);
  assert.deepEqual(ff.browser_specific_settings?.gecko, FIREFOX_GECKO_SETTINGS);
  assert.equal(ff.version, raw.version);
});
