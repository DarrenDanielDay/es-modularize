/// <reference types="es-module-shims" />
// @ts-check
(function () {
  /**
   * @param {number} n
   */
  Array.prototype.at =
    Array.prototype.at ||
    function at(n) {
      // ToInteger() abstract op
      n = Math.trunc(n) || 0;
      // Allow negative indexing from the end
      if (n < 0) n += this.length;
      // OOB access is guaranteed to return undefined
      if (n < 0 || n >= this.length) return undefined;
      // Otherwise, this is just normal property access
      return this[n];
    };

  /**
   * @param {string} url
   */
  function parseURL(url) {
    var pattern = /^(\w+:\/\/[^/]+)(\/[^\?]*)\??(.*)/;
    var match = url.match(pattern);
    if (!match) {
      throw new Error("Invalid URL : " + url);
    }
    var origin = match[1];
    var pathname = match[2];
    var search = match[3];
    /** @type {Record<string, string>} */
    var params = {};
    var raws = search.split("&");
    for (var i = 0; i < raws.length; i++) {
      var paramMatch = raws[i].match(/(.*?)=(.*)/);
      if (paramMatch) {
        var key = paramMatch[1];
        var value = decodeURIComponent(paramMatch[2]);
        params[key] = value;
      }
    }
    return {
      origin: origin,
      pathname: pathname,
      search: search,
      params: params,
    };
  }
  function navigateToNotSupported() {
    var url = parseURL(location.href);
    var pathname = url.pathname.replace(/\/\w+\/(index\.html)?/, "/not-supported.html");
    var target = url.origin + pathname;
    location.href = target;
  }
  try {
    eval("(()=>{})()");
  } catch (error) {
    return navigateToNotSupported();
  }
  const url = parseURL(location.href);
  var params = url.params;
  var cdnRoot = params.cdn || "https://unpkg.com";
  var registry = params.registry || "https://registry.npmjs.org";
  window.cdnRoot = cdnRoot;
  window.registry = registry;
  window.__ESM_LOADED__ = false;
  function importmapSupportChecks() {
    removeEventListener("DOMContentLoaded", importmapSupportChecks);
    console.log("DCL");
    function checkSupportsCall() {
      return typeof HTMLScriptElement.supports === "function" && HTMLScriptElement.supports("importmap");
    }
    if (window.__ESM_LOADED__) {
      return;
    }
    if (checkSupportsCall()) {
      return;
    }
    var supports = undefined;

    new Promise(function (resolve) {
      Object.defineProperty(HTMLScriptElement, "supports", {
        get: function () {
          return supports;
        },
        set: function (fn) {
          supports = fn;
          resolve(0);
        },
        configurable: true,
        enumerable: true,
      });
    }).then(function () {
      window.__GLOBAL_SCHEDULED_CALLBACK__ = function () {
        delete window.__GLOBAL_SCHEDULED_CALLBACK__;
        if (__ESM_LOADED__ || checkSupportsCall()) {
          return;
        }
        navigateToNotSupported();
      };
      var moduleScript = document.querySelector("script[type='module']");
      if (!(moduleScript instanceof HTMLScriptElement)) {
        console.log("No module script detected.");
        return;
      }
      var callbackScript = document.createElement("script");
      callbackScript.type = "module";
      callbackScript.textContent = "window.__GLOBAL_SCHEDULED_CALLBACK__();";
      moduleScript.after(callbackScript);
    });
  }
  addEventListener("DOMContentLoaded", importmapSupportChecks);
})();
