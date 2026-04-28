document.addEventListener("DOMContentLoaded", () => {

  /* ---- アクティブナビリンク ---- */
  const here = location.href;
  document.querySelectorAll("#mainNav a").forEach(a => {
    // Works は外部リンクなのでスキップ
    if (!a.href) return;
    try {
      const aPath = new URL(a.href).pathname.replace(/index\.html$/, "");
      const hPath = new URL(here).pathname.replace(/index\.html$/, "");
      // ホームリンク（index.html）は完全一致のみ
      const isHome = aPath.endsWith("sample_v2/") || aPath.endsWith("sample_v2");
      if (isHome) {
        if (hPath.endsWith("sample_v2/") || hPath.endsWith("sample_v2")) a.classList.add("active");
      } else {
        if (hPath.startsWith(aPath) && aPath.length > 1) a.classList.add("active");
      }
    } catch { /* external link */ }
  });

  /* ---- ハンバーガー ---- */
  const toggle = document.getElementById("menuToggle");
  const nav    = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* ---- スクロールリビール ---- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* ---- アコーディオン（Publications ページ用） ---- */
  window.togglePubSection = function(btn) {
    btn.closest(".pub-section").classList.toggle("open");
  };

});
