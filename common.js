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
        });

    // フッターをロード
    fetch("/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});
