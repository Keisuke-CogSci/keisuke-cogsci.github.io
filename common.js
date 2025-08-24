document.addEventListener("DOMContentLoaded", () => {
  const here = new URL(location.href);
  const isEN = here.pathname.startsWith("/en/");

  // 現在ページ ⇄ 対応ページ のパスを計算
  const jaPath = isEN ? here.pathname.replace(/^\/en(\/|$)/, "/") || "/" : here.pathname || "/";
  const enPath = isEN ? here.pathname || "/en/" : "/en" + (here.pathname === "/" ? "/" : here.pathname);

  // 404 等を避けるための軽い正規化
  function normalize(p) {
    return p.replace(/\/{2,}/g, "/");
  }

  // 断続的に試すローダ（最初に読めたものを採用）
  async function loadFragment(paths, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    for (const path of paths) {
      try {
        const res = await fetch(path, { cache: "no-store" });
        if (res.ok) {
          const html = await res.text();
          target.innerHTML = html;
          return true;
        }
      } catch (_) { /* next candidate */ }
    }
    return false;
  }

  const headerCandidates = isEN ? ["/en/header.html", "/header.html"] : ["/header.html", "/en/header.html"];
  const footerCandidates = isEN ? ["/en/footer.html", "/footer.html"] : ["/footer.html", "/en/footer.html"];

  loadFragment(headerCandidates, "header-placeholder").then(() => {

    const toJa = document.getElementById("to-ja");
    const toEn = document.getElementById("to-en");
    if (toJa) toJa.setAttribute("href", normalize(jaPath + here.search));
    if (toEn) toEn.setAttribute("href", normalize(enPath + here.search));

    const englishLink = document.querySelector("#english-link");
    if (englishLink) englishLink.setAttribute("href", normalize(enPath + here.search));

    // ハンバーガーメニュー
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");
    if (menuToggle && navMenu) {
      const toggle = () => navMenu.classList.toggle("active");
      menuToggle.addEventListener("click", toggle);
      menuToggle.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") toggle();
      });
    }
  });

  // フッタ読込（英語版が無ければ日本語にフォールバック）
  loadFragment(footerCandidates, "footer-placeholder");

  (function ensureHrefLang() {
    const head = document.querySelector("head");
    if (!head) return;
    const exists = head.querySelector('link[rel="alternate"][hreflang]');
    if (exists) return; // 既にあるなら何もしない

    const site = (p) => normalize((location.origin || "") + p);
    const pair = [
      { rel: "alternate", hreflang: "ja", href: site(jaPath) },
      { rel: "alternate", hreflang: "en", href: site(enPath) },
      { rel: "alternate", hreflang: "x-default", href: site("/en/") },
      { rel: "canonical", href: site(isEN ? enPath : jaPath) }
    ];

    for (const attrs of pair) {
      const link = document.createElement("link");
      Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
      head.appendChild(link);
    }
  })();
});
