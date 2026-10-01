document.documentElement.classList.add("js");

(function () {
  var header = document.querySelector(".site-header");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatAppNumber(index) {
    return String(index + 1).padStart(2, "0");
  }

  function getAppAccent(app, index) {
    var palette = Array.isArray(window.MEGI_MINT_APP_ACCENTS) ? window.MEGI_MINT_APP_ACCENTS : [];
    var fallback = palette.length ? palette[index % palette.length] : { accent1: "#FFF4D8", accent2: "#EEE9FF" };

    return {
      accent1: app.accent1 || fallback.accent1,
      accent2: app.accent2 || fallback.accent2
    };
  }

  function applyAppAccent(element, app, index) {
    var accent = getAppAccent(app, index);
    element.style.setProperty("--app-accent-1", accent.accent1);
    element.style.setProperty("--app-accent-2", accent.accent2);
  }

  function renderApps() {
    var grid = document.getElementById("app-grid");
    var mobileList = document.getElementById("mobile-app-list");
    var count = document.getElementById("product-count");
    var apps = Array.isArray(window.MEGI_MINT_APPS) ? window.MEGI_MINT_APPS : [];

    if (count) {
      var label = apps.length === 1 ? "PRODUCT" : "PRODUCTS";
      count.textContent = String(apps.length).padStart(2, "0") + " " + label;
    }

    if (grid) grid.innerHTML = "";
    if (mobileList) mobileList.innerHTML = "";

    apps.forEach(function (app, index) {
      var number = formatAppNumber(index);

      if (grid) {
        var privacyLink = app.privacyUrl
          ? '<a href="' + escapeHtml(app.privacyUrl) + '" class="text-link">개인정보처리방침</a>'
          : "";
        var article = document.createElement("article");
        article.className = "app-card";
        article.dataset.appId = app.id || "";
        applyAppAccent(article, app, index);
        article.innerHTML =
          '<span class="app-number">' + number + '</span>' +
          '<div class="app-icon-wrap">' +
            '<img src="' + escapeHtml(app.image) + '" alt="' + escapeHtml(app.imageAlt || (app.name + " 앱 심볼")) + '" class="app-icon">' +
          '</div>' +
          '<div class="app-copy">' +
            '<p class="app-kicker">' + escapeHtml(app.category) + '</p>' +
            '<h3>' + escapeHtml(app.name) + '</h3>' +
            '<span class="app-name-en">' + escapeHtml(app.nameEn) + '</span>' +
            '<p class="app-tagline">' + escapeHtml(app.tagline) + '</p>' +
            '<p class="app-description">' + escapeHtml(app.description) + '</p>' +
          '</div>' +
          '<div class="app-actions">' +
            '<a href="' + escapeHtml(app.appUrl) + '" class="app-link">앱 소개 <span aria-hidden="true">↗</span></a>' +
            privacyLink +
          '</div>';
        grid.appendChild(article);
      }

      if (mobileList) {
        var row = document.createElement("a");
        row.className = "mobile-app-row";
        row.href = app.appUrl;
        row.dataset.appId = app.id || "";
        applyAppAccent(row, app, index);
        row.setAttribute("aria-label", app.name + " 앱 소개 보기");
        row.innerHTML =
          '<span class="mobile-app-icon-wrap">' +
            '<img src="' + escapeHtml(app.image) + '" alt="" class="mobile-app-icon">' +
          '</span>' +
          '<span class="mobile-app-copy">' +
            '<strong>' + escapeHtml(app.name) + '</strong>' +
            '<span>' + escapeHtml(app.nameEn) + '</span>' +
          '</span>' +
          '<span class="mobile-app-chevron" aria-hidden="true">›</span>';
        mobileList.appendChild(row);
      }
    });
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  function setupRevealMotion() {
    var targets = document.querySelectorAll(
      ".apps-heading, .apps-meta, .app-card, .mobile-app-row, .about-title, .about-copy, .footer-inner"
    );

    targets.forEach(function (el, index) {
      el.classList.add("reveal-target");
      el.style.setProperty("--reveal-delay", Math.min(index * 45, 180) + "ms");
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  renderApps();
  updateHeader();
  setupRevealMotion();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();
