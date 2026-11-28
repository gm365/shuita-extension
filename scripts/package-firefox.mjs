#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const FIREFOX_GECKO_SETTINGS = {
  id: "shuita-extension@shuita.xyz",
  strict_min_version: "121.0",
  data_collection_permissions: {
    required: ["none"],
  },
};

/**
 * 将 Chromium MV3 manifest 转换为兼容 Firefox AMO 的 MV3 manifest，不修改原对象。
 */
export function buildFirefoxManifest(manifest) {
  const next = structuredClone(manifest);
  const workerPath = next.background?.service_worker || "src/background.js";
  const moduleType = next.background?.type || "module";
  next.background = {
    scripts: [workerPath],
    type: moduleType,
  };
  next.browser_specific_settings = {
    ...(next.browser_specific_settings || {}),
    gecko: structuredClone(FIREFOX_GECKO_SETTINGS),
  };
  return next;
}

function copyFiltered(src, dest) {
  fs.cpSync(src, dest, {
    recursive: true,
    filter: (item) => path.basename(item) !== ".DS_Store",
  });
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const manifestPath = path.join(root, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const ffManifest = buildFirefoxManifest(manifest);

  const distDir = path.join(root, "dist");
  fs.mkdirSync(distDir, { recursive: true });
  for (const name of fs.readdirSync(distDir)) {
    if (name.startsWith("shuita-extension-firefox-") && name.endsWith(".zip")) {
      fs.rmSync(path.join(distDir, name));
    }
  }

  const outZip = path.join(distDir, `shuita-extension-firefox-v${ffManifest.version}.zip`);
  const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), "shuita-ext-ff-"));
  try {
    fs.writeFileSync(path.join(stageDir, "manifest.json"), `${JSON.stringify(ffManifest, null, 2)}\n`);
    copyFiltered(path.join(root, "popup.html"), path.join(stageDir, "popup.html"));
    copyFiltered(path.join(root, "icons"), path.join(stageDir, "icons"));
    copyFiltered(path.join(root, "src"), path.join(stageDir, "src"));

    execFileSync("zip", ["-r", outZip, "manifest.json", "popup.html", "icons", "src", "-x", "*/.DS_Store"], {
      cwd: stageDir,
      stdio: "inherit",
    });
  } finally {
    fs.rmSync(stageDir, { recursive: true, force: true });
  }

  const size = fs.statSync(outZip).size;
  console.log(`Built ${outZip} (${size} bytes)`);
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main();
}
