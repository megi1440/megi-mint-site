/*
 * OneulChai-only privacy policy document loader.
 * One public address: privacy/oneulchai.html
 * Policy text: apps/oneulchai/privacy/{en,ko,ja}.html
 * No dependencies beyond the site's shared language controller.
 */
(function () {
  "use strict";
  var root = document.getElementById("policy-content");
  if (!root || !window.MEGI_MINT_I18N) return;

  var i18n = window.MEGI_MINT_I18N;
  var base = "../apps/oneulchai/privacy/";
  var metadata = {
    en: { name: "DayDelta", heading: "Privacy Policy", description: "DayDelta privacy policy and how your information is handled.", loading: "Loading privacy policy…", error: "Unable to load the privacy policy. Read it directly using a link below." },
    ko: { name: "오늘차이", heading: "개인정보처리방침", description: "오늘차이 개인정보처리방침 및 정보 처리 안내", loading: "개인정보처리방침을 불러오는 중…", error: "개인정보처리방침을 불러오지 못했어요. 아래 링크에서 직접 확인할 수 있습니다." },
    ja: { name: "今日のちがい", heading: "プライバシーポリシー", description: "今日のちがいのプライバシーポリシーと情報の取り扱い", loading: "プライバシーポリシーを読み込み中…", error: "ポリシーを読み込めませんでした。以下のリンクから直接確認してください。" }
  };
  var cache = Object.create(null);
  var serial = 0;
  var controller = null;

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function fallback(message) {
    root.innerHTML = '<p class="policy-status" role="status">' + escapeHtml(message) + '</p>' +
      '<p class="policy-fallback-links">' +
      '<a href="' + base + 'en.html">English</a> · ' +
      '<a href="' + base + 'ko.html">한국어</a> · ' +
      '<a href="' + base + 'ja.html">日本語</a></p>';
  }
  function render(language, markup) {
    // Only this project's checked-in, same-origin HTML documents are loaded.
    root.innerHTML = markup;
    root.setAttribute("aria-busy", "false");
    document.title = metadata[language].name + " " + metadata[language].heading + " | MEGI MINT";
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", metadata[language].description);
    var appName = document.getElementById("policy-app-name");
    if (appName) appName.textContent = metadata[language].name;
  }
  async function load(language) {
    if (!Object.prototype.hasOwnProperty.call(metadata, language)) language = "en";
    var current = ++serial;
    if (controller) controller.abort();
    controller = typeof AbortController === "function" ? new AbortController() : null;
    root.setAttribute("aria-busy", "true");
    if (Object.prototype.hasOwnProperty.call(cache, language)) {
      render(language, cache[language]);
      return;
    }
    fallback(metadata[language].loading);
    try {
      var options = controller ? { signal: controller.signal } : {};
      var response = await fetch(base + language + ".html", options);
      if (!response.ok) throw new Error("Privacy policy HTTP " + response.status);
      var html = await response.text();
      if (current !== serial) return;
      var parsed = new DOMParser().parseFromString(html, "text/html");
      var section = parsed.getElementById("policy-fragment");
      if (!section || !section.querySelector(".policy-card")) {
        throw new Error("Privacy policy markup is incomplete");
      }
      cache[language] = section.innerHTML;
      render(language, section.innerHTML);
    } catch (error) {
      if (current !== serial || (error && error.name === "AbortError")) return;
      fallback(metadata[language].error);
      root.setAttribute("aria-busy", "false");
      console.error("OneulChai privacy policy:", error);
    }
  }

  function init() {
    load(i18n.getLanguage());
    window.addEventListener("megi:languagechange", function (event) {
      load(event.detail.language);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
