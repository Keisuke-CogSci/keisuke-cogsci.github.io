document.addEventListener("DOMContentLoaded", () => {
    // ヘッダーをロード
    fetch("/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

            // 英語版リンクの動的設定
            const currentPath = window.location.pathname;
            const englishLink = document.querySelector("#english-link");
            if (englishLink) {
                englishLink.href = `/en${currentPath}`;
            }

            // ハンバーガーメニューの動作を設定
            const menuToggle = document.querySelector(".menu-toggle");
            const navMenu = document.querySelector("nav ul");

            menuToggle.addEventListener("click", () => {
                navMenu.classList.toggle("active"); // メニューの開閉
            });

            // キーボード操作対応
            menuToggle.addEventListener("keypress", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    navMenu.classList.toggle("active");
                }
            });
        });

    // フッターをロード
    fetch("/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});
