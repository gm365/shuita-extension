(() => {
  const QUICK_UPGRADE_RE = /(?:^|\/)(?:pricing|upgrade|plans|billing|subscribe|subscriptions|google-ai-plans|ai-plans)(?:\/|$)|#(?:pricing|upgrade|plans|subscribe|billing)\b|[?&](?:pricing|upgrade|plan)=/i;

  let hostEl = null;
  let activeProviderId = null;
  let lastUrl = "";
  let settleTimer = null;

  function removePill(animate = false) {
    if (!hostEl) return;
    const target = hostEl;
    hostEl = null;
    activeProviderId = null;
    if (!animate) {
      target.remove();
      return;
    }
    target.style.opacity = "0";
    target.style.transform = "translateY(6px)";
    setTimeout(() => target.remove(), 200);
  }

  function mountPill(offer) {
    if (hostEl && activeProviderId === offer.providerId) return;
    removePill(false);

    const container = document.createElement("div");
    container.id = "shuita-price-pill-host";
    container.style.cssText = [
      "position: fixed",
      "right: 20px",
      "bottom: 20px",
      "z-index: 2147483647",
      "opacity: 0",
      "transform: translateY(8px)",
      "transition: opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      "pointer-events: auto",
    ].join(";");

    const shadow = container.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 7px 10px 7px 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(17, 20, 20, 0.1);
        box-shadow: 0 8px 24px -6px rgba(17, 20, 20, 0.16), 0 2px 6px rgba(17, 20, 20, 0.06);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
        font-size: 12px;
        line-height: 1.2;
        color: #111414;
        -webkit-font-smoothing: antialiased;
      }
      @media (prefers-color-scheme: dark) {
        .pill {
          background: rgba(20, 23, 23, 0.88);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 28px -6px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: #f2f4f4;
        }
      }
      .logo {
        width: 22px;
        height: 22px;
        border-radius: 999px;
        object-fit: cover;
        flex-shrink: 0;
      }
      .copy {
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
        white-space: nowrap;
      }
      .label {
        color: #5b6665;
        font-weight: 500;
      }
      @media (prefers-color-scheme: dark) {
        .label { color: #9ea8a7; }
      }
      .price {
        color: #0f7647;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }
      @media (prefers-color-scheme: dark) {
        .price { color: #34d399; }
      }
      .cta {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        color: #0d7464;
        background: rgba(13, 116, 100, 0.1);
        font-weight: 600;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 999px;
        white-space: nowrap;
        transition: background 140ms ease;
      }
      .cta:hover {
        background: rgba(13, 116, 100, 0.18);
      }
      @media (prefers-color-scheme: dark) {
        .cta {
          color: #2dd4bf;
          background: rgba(45, 212, 191, 0.14);
        }
        .cta:hover {
          background: rgba(45, 212, 191, 0.22);
        }
      }
      .close {
        appearance: none;
        border: 0;
        background: transparent;
        color: #7c8786;
        width: 20px;
        height: 20px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        transition: background 140ms ease, color 140ms ease;
      }
      .close:hover {
        background: rgba(128, 128, 128, 0.16);
        color: inherit;
      }
    `;

    const pill = document.createElement("div");
    pill.className = "pill";
    pill.setAttribute("role", "status");
    pill.setAttribute("aria-label", `水獭比价：${offer.name} 最低 ¥${offer.priceText} 起`);

    const logo = document.createElement("img");
    logo.className = "logo";
    logo.src = chrome.runtime.getURL("icons/icon-48.png");
    logo.width = 22;
    logo.height = 22;
    logo.alt = "";

    const copy = document.createElement("span");
    copy.className = "copy";

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = `${offer.name} · 水獭最低`;

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `¥${offer.priceText}`;

    const suffix = document.createElement("span");
    suffix.className = "label";
    suffix.textContent = "起";

    copy.append(label, price, suffix);

    const cta = document.createElement("a");
    cta.className = "cta";
    cta.href = offer.url;
    cta.target = "_blank";
    cta.rel = "noopener noreferrer";
    cta.textContent = "去比价 ↗";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "close";
    closeBtn.title = "7 天内不再提示";
    closeBtn.setAttribute("aria-label", "关闭提示，7 天内不再显示");
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    closeBtn.addEventListener("click", () => {
      const pid = offer.providerId;
      removePill(true);
      chrome.runtime.sendMessage({ type: "DISMISS_PAGE_OFFER", providerId: pid }, () => {
        void chrome.runtime.lastError;
      });
    });

    pill.append(logo, copy, cta, closeBtn);
    shadow.append(style, pill);
    document.documentElement.appendChild(container);

    hostEl = container;
    activeProviderId = offer.providerId;

    requestAnimationFrame(() => {
      if (hostEl === container) {
        container.style.opacity = "1";
        container.style.transform = "translateY(0)";
      }
    });
  }

  function checkCurrentUrl() {
    const href = location.href;
    if (href === lastUrl) return;
    lastUrl = href;

    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }

    if (!QUICK_UPGRADE_RE.test(location.pathname + location.search + location.hash)) {
      removePill(true);
      return;
    }

    settleTimer = setTimeout(() => {
      if (location.href !== href) return;
      chrome.runtime.sendMessage({ type: "GET_PAGE_OFFER", url: href }, (res) => {
        if (chrome.runtime.lastError || !res?.ok || !res.offer) {
          removePill(true);
          return;
        }
        if (location.href === href) {
          mountPill(res.offer);
        }
      });
    }, 450);
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes["prefs:pillEnabled"]) return;
    const enabled = changes["prefs:pillEnabled"].newValue !== false;
    if (!enabled) {
      removePill(true);
    } else {
      lastUrl = "";
      checkCurrentUrl();
    }
  });

  window.addEventListener("popstate", checkCurrentUrl);
  window.addEventListener("hashchange", checkCurrentUrl);

  // SPA 客户端路由（pushState / replaceState）兜底监听
  setInterval(checkCurrentUrl, 1200);
  checkCurrentUrl();
})();
