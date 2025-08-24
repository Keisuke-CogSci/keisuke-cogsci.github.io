document.addEventListener("DOMContentLoaded", () => {

  const script = document.currentScript || document.querySelector('script[src*="common.js"]');
  const basePath = (() => {
    try {
      const u = new URL(script.src, location.origin);
      return u.pathname.replace(/\/common\.js.*$/, "");
    } catch { return ""; }
  })();

  const here = new URL(location.href);
  const isEN = here.pathname.startsWith(`${basePath}/en/`) || here.pathname === `${basePath}/en`;

  async function loadFragment(paths, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    for (const p of paths) {
      try {
        const res = await fetch(p, { cache: "no-store" });
        if (res.ok) {
          target.innerHTML = await res.text();
          return true;
        }
      } catch { /* try next */ }
    }
  }

  const headerCandidates = isEN
    ? [`${basePath}/en/header.html`, `${basePath}/header.html`]
    : [`${basePath}/header.html`, `${basePath}/en/header.html`];
  const footerCandidates = isEN
    ? [`${basePath}/en/footer.html`, `${basePath}/footer.html`]
    : [`${basePath}/footer.html`, `${basePath}/en/footer.html`];

  loadFragment(headerCandidates, "header-placeholder").then(() => {

    const aJa = document.getElementById("to-ja");
    const aEn = document.getElementById("to-en");
    const norm = (p) => p.replace(/\/{2,}/g, "/");

    const jaPath = isEN
      ? norm(here.pathname.replace(new RegExp(`^${basePath}/en(\\/|$)`), `${basePath}/`)) || `${basePath}/`
      : here.pathname || `${basePath}/`;
    const enPath = isEN
      ? here.pathname
      : norm(`${basePath}/en${here.pathname === `${basePath}/` ? "/" : here.pathname.replace(basePath, "")}`);

    if (aJa) aJa.href = jaPath + here.search;
    if (aEn) aEn.href = enPath + here.search;

    // 旧ID対応
    const englishLink = document.getElementById("english-link");
    if (englishLink) englishLink.href = enPath + here.search;

    // ハンバーガー
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

  loadFragment(footerCandidates, "footer-placeholder");
});
