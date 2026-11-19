# Chrome Web Store 上架审核文案与隐私政策草稿

本文档用于辅助填写 Chrome Web Store 开发者后台的 **Privacy Practices（隐私权设置）** 与 **Store Listing（商店详情）**，并附带可直接部署至主站的隐私政策草稿。

---

## 1. 单一用途说明（Single Purpose Description）

**English (Recommended for Review):**
> Provides real-time price comparison for major AI subscription plans (ChatGPT, Claude, Gemini, Grok) synced from shuita.xyz, with an optional minimal price-reference pill on official upgrade/pricing pages.

**中文参考：**
> 为主流 AI 订阅服务（ChatGPT、Claude、Gemini、Grok）提供来自 shuita.xyz 的实时比价参考，并在官网升级/定价页面提供可选的极简低价提示浮窗。

---

## 2. 权限合理性说明（Permission Justifications）

### `storage`
> Used exclusively to store local price cache (10-minute TTL), user-selected preferred SKUs, the global toggle for the on-page price pill, and 7-day dismissal timestamps in `chrome.storage.local`. No personal data is stored or synced.

### `host_permissions` (`https://shuita.xyz/*`)
> Used solely by the background service worker to fetch public JSON price feeds (`/api/mcp/index.json` and `/api/mcp/sku/<sku>.json`) from shuita.xyz.

### `content_scripts` (ChatGPT / OpenAI / Claude / Anthropic / Gemini / Google One / Grok / xAI)
> Injected only to inspect the current page URL (`window.location.href`) and detect official pricing, upgrade, or billing routes. When matched, it renders a non-intrusive, dismissible Shadow DOM pill in the bottom-right corner showing the lowest available reference price. It does not read, modify, or transmit any chat content, form inputs, account credentials, or DOM data.

### Remote Code（是否使用远程代码）
- 选择：**No, I am not using Remote code**
- 说明：扩展仅从 `https://shuita.xyz/api/mcp/*.json` 拉取纯 JSON 价格数据，所有执行逻辑均打包在本地扩展包内。

---

## 3. 数据使用声明（Data Usage）

在 Chrome Web Store 后台勾选 **不收集** 以下任何用户数据（全部留空/不勾选）：
- Personally identifiable information
- Health information
- Financial and payment information
- Authentication information
- Personal communications
- Location
- Web history
- User activity
- Website content

并在底部的 **Developer Disclosures（开发者声明）** 全部勾选确认（不向第三方出售或传输数据、不用于与单一用途无关的广告或信用评估）。

---

## 4. 隐私政策草稿（可发布至 `https://shuita.xyz/privacy`）

### 中文版

**水獭 AI 比价浏览器扩展隐私政策**

最后更新日期：2026 年 11 月

「水獭 AI 比价」浏览器扩展（以下简称「本扩展」）尊重并保护用户隐私。本扩展遵循最小权限原则，仅提供 AI 订阅服务的公开价格查询与参考功能。

1. **我们收集哪些信息**
   本扩展**不收集、不存储、不上传**任何个人身份信息（PII）、账号凭据、浏览历史、网页表单内容或 AI 对话内容。

2. **本地存储（`chrome.storage.local`）**
   本扩展仅在您的浏览器本地保存以下非个人数据：
   - 公开价格行情缓存（10 分钟有效期）；
   - 您主动选择的常用套餐规格（SKU）；
   - 官网浮窗总开关状态及关闭后的 7 天静默时间戳。
   上述数据仅保存在您的本地设备中，不会上传至任何服务器。

3. **网络请求**
   本扩展的后台服务（Service Worker）仅向 `https://shuita.xyz` 发起只读请求，用于获取公开的套餐价格 JSON 数据，请求中不包含任何用户标识或当前浏览页面信息。

4. **官网页面脚本（Content Script）**
   本扩展仅在指定的 AI 服务官网域名运行，且仅在浏览器地址栏匹配升级、定价或账单路径时展示右下角价格参考浮窗。本扩展不会读取您的聊天记录、页面输入或账户信息，也不会篡改官网原有结账流程。

5. **联系我们**
   如对本隐私政策有任何疑问，请通过 `https://shuita.xyz` 页面底部的联系方式与我们取得联系。

---

### English Version

**Privacy Policy for Shuita AI Price Comparison Extension**

Last Updated: November 2026

The "水獭 AI 比价" (Shuita AI Price Comparison) browser extension ("the Extension") respects your privacy and is designed with data minimization in mind.

1. **Information We Do Not Collect**
   The Extension does **not** collect, store, or transmit any personally identifiable information (PII), authentication credentials, browsing history, form inputs, or AI chat conversations.

2. **Local Storage**
   The Extension uses `chrome.storage.local` solely on your device to store:
   - Cached public pricing JSON data (10-minute TTL);
   - Your selected preferred SKU plans;
   - The global toggle state for the floating price pill and its 7-day dismissal timestamps.
   This data never leaves your browser.

3. **Network Requests**
   The background service worker only sends read-only `GET` requests to `https://shuita.xyz` to retrieve public pricing feeds (`/api/mcp/index.json` and `/api/mcp/sku/*.json`). No user identifiers or visited URLs are transmitted.

4. **Content Scripts on Official AI Websites**
   Content scripts run only on specified AI provider domains and check the current URL path to display an optional, dismissible price-reference pill on pricing, upgrade, or billing pages. They do not read page content, chat messages, or payment forms.

5. **Contact**
   If you have questions about this privacy policy, please contact us via the support link listed on `https://shuita.xyz`.
