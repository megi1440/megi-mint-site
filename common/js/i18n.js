/*
 * MEGI MINT shared language controller.
 * Language preference order: valid ?lang= > saved choice > English.
 * Use data-i18n="namespace.key" for text, data-i18n-aria-label for accessible names.
 * Later app modules may call register(lang, { "app.key": "..." }) and listen to
 * "megi:languagechange" (event.detail.language) to re-render dynamic content.
 */
(function () {
  "use strict";

  var supported = ["en", "ko", "ja"];
  var storageKey = "megi-mint-language";
  var messages = { en: {}, ko: {}, ja: {} };
  var ready = false;

  function isSupported(value) { return supported.indexOf(value) !== -1; }
  function readSaved() {
    try { return window.localStorage.getItem(storageKey); } catch (e) { return null; }
  }
  function save(value) {
    try { window.localStorage.setItem(storageKey, value); } catch (e) { /* storage disabled */ }
  }
  function readFromUrl() {
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      return isSupported(q) ? q : null;
    } catch (e) { return null; }
  }

  var language = readFromUrl() || (isSupported(readSaved()) ? readSaved() : "en");
  document.documentElement.lang = language;
  if (readFromUrl()) save(language);

  function getLanguage() { return language; }
  function translate(key, fallback) {
    if (Object.prototype.hasOwnProperty.call(messages[language], key)) return messages[language][key];
    if (Object.prototype.hasOwnProperty.call(messages.en, key)) return messages.en[key];
    return typeof fallback === "string" ? fallback : key;
  }
  function applyTranslations(root) {
    var scope = root || document;
    var rules = [
      ["data-i18n", "textContent"],
      ["data-i18n-aria-label", "aria-label"],
      ["data-i18n-title", "title"],
      ["data-i18n-alt", "alt"],
      ["data-i18n-content", "content"],
      ["data-i18n-placeholder", "placeholder"]
    ];
    rules.forEach(function (rule) {
      var elements = scope.querySelectorAll("[" + rule[0] + "]");
      elements.forEach(function (el) {
        var key = el.getAttribute(rule[0]);
        if (!key) return;
        if (rule[1] === "textContent") el.textContent = translate(key, el.textContent);
        else el.setAttribute(rule[1], translate(key, el.getAttribute(rule[1]) || ""));
      });
    });
    scope.querySelectorAll(".mm-language-select").forEach(function (el) {
      el.value = language;
    });
    document.documentElement.lang = language;
  }
  function register(lang, dictionary) {
    if (!isSupported(lang) || !dictionary || typeof dictionary !== "object") return;
    Object.keys(dictionary).forEach(function (key) {
      if (typeof dictionary[key] === "string") messages[lang][key] = dictionary[key];
    });
    if (ready && lang === language) applyTranslations();
  }
  function setLanguage(next) {
    if (!isSupported(next)) return false;
    var changed = next !== language;
    language = next;
    save(language);

    // A page entered with ?lang=ko must not switch back to ko on refresh
    // after the visitor chooses another language.
    try {
      var url = new URL(window.location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.set("lang", language);
        window.history.replaceState(window.history.state, "", url.href);
      }
    } catch (e) { /* navigation URL unavailable */ }

    if (ready) applyTranslations();
    if (changed) window.dispatchEvent(new CustomEvent("megi:languagechange", {
      detail: { language: language }
    }));
    return true;
  }
  function init() {
    if (ready) return;
    ready = true;
    document.querySelectorAll(".mm-language-select").forEach(function (select) {
      select.addEventListener("change", function () { setLanguage(select.value); });
    });
    applyTranslations();
  }

  window.MEGI_MINT_I18N = {
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    t: translate,
    register: register,
    apply: applyTranslations,
    supported: supported.slice()
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
