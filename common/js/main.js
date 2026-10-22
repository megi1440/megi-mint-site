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

  function getLanguage() {
    return window.MEGI_MINT_I18N ? window.MEGI_MINT_I18N.getLanguage() : "en";
  }

  function t(key, fallback) {
    return window.MEGI_MINT_I18N ? window.MEGI_MINT_I18N.t(key, fallback) : fallback;
  }

  function formatMessage(key, replacements, fallback) {
    var result = t(key, fallback);
    Object.keys(replacements).forEach(function (name) {
      result = result.split("{" + name + "}").join(String(replacements[name]));
    });
    return result;
  }

  function getAppLocale(app, lang) {
    var locales = app.locales || {};
    return locales[lang] || locales.en || {
      name: app.name || "", nameSecondary: app.nameEn || "",
      category: app.category || "", tagline: app.tagline || "",
      description: app.description || "", imageAlt: app.imageAlt || ""
    };
  }

  function updatePageDescription() {
    var description = document.querySelector('meta[name="description"]');
    if (description) description.content = t("home.meta.description", description.content);
  }

  function renderApps() {
    var grid = document.getElementById("app-grid");
    var mobileList = document.getElementById("mobile-app-list");
    var count = document.getElementById("product-count");
    var apps = Array.isArray(window.MEGI_MINT_APPS) ? window.MEGI_MINT_APPS : [];
    var lang = getLanguage();

    if (count) {
      var countKey = apps.length === 1 ? "home.apps.countSingle" : "home.apps.countPlural";
      count.textContent = formatMessage(countKey, { count: String(apps.length).padStart(2, "0") }, "{count} PRODUCTS");
    }

    if (grid) grid.innerHTML = "";
    if (mobileList) mobileList.innerHTML = "";

    apps.forEach(function (app, index) {
      var number = formatAppNumber(index);
      var display = getAppLocale(app, lang);
      var name = display.name || "";
      var nameSecondary = display.nameSecondary || "";

      if (grid) {
        var privacyLink = app.privacyUrl
          ? '<a href="' + escapeHtml(app.privacyUrl) + '" class="text-link">' + escapeHtml(t("home.apps.linkPrivacy", "Privacy policy")) + '</a>'
          : "";
        var article = document.createElement("article");
        article.className = "app-card";
        article.dataset.appId = app.id || "";
        applyAppAccent(article, app, index);
        article.innerHTML =
          '<span class="app-number">' + number + '</span>' +
          '<div class="app-icon-wrap">' +
            '<img src="' + escapeHtml(app.image) + '" alt="' + escapeHtml(display.imageAlt || name) + '" class="app-icon">' +
          '</div>' +
          '<div class="app-copy">' +
            '<p class="app-kicker">' + escapeHtml(display.category || "") + '</p>' +
            '<h3>' + escapeHtml(name) + '</h3>' +
            '<span class="app-name-en">' + escapeHtml(nameSecondary) + '</span>' +
            '<p class="app-tagline">' + escapeHtml(display.tagline || "") + '</p>' +
            '<p class="app-description">' + escapeHtml(display.description || "") + '</p>' +
          '</div>' +
          '<div class="app-actions">' +
            '<a href="' + escapeHtml(app.appUrl) + '" class="app-link">' + escapeHtml(t("home.apps.linkDetail", "View app")) + ' <span aria-hidden="true">↗</span></a>' +
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
        row.setAttribute("aria-label", formatMessage("home.apps.mobileLabel", { name: name }, "View {name} details"));
        row.innerHTML =
          '<span class="mobile-app-icon-wrap">' +
            '<img src="' + escapeHtml(app.image) + '" alt="" class="mobile-app-icon">' +
          '</span>' +
          '<span class="mobile-app-copy">' +
            '<strong>' + escapeHtml(name) + '</strong>' +
            '<span>' + escapeHtml(nameSecondary) + '</span>' +
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
  updatePageDescription();
  window.addEventListener("megi:languagechange", function () {
    renderApps();
    updatePageDescription();
  });
  updateHeader();
  setupRevealMotion();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();
