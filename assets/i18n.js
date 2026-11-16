/* ============================================================
   i18n — TranslateManager singleton
   Provides multi-language support for the DigiLocker prototype.
   Load via: <script src="../assets/i18n.js"></script>
   ============================================================ */

(function () {
  'use strict';

  var _map = {};
  var _loading = null;
  var _requestId = 0;

  var _config = {
    serverBaseUrl: '/language',
    fallbackBasePath: 'assets/language',
    timeout: 5000,
    storageKey: 'dl-language',
    supportedLanguages: ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te']
  };

  /**
   * Get the currently active language code.
   * Reads from localStorage; defaults to 'en' if absent or invalid.
   * @returns {string}
   */
  function getActiveLanguage() {
    try {
      var stored = localStorage.getItem(_config.storageKey);
      if (stored && _config.supportedLanguages.indexOf(stored) !== -1) {
        return stored;
      }
    } catch (e) { /* localStorage unavailable */ }
    return 'en';
  }

  /**
   * Synchronous translation lookup.
   * @param {string} key - The English source text key
   * @returns {string} Translated value, or key itself if not found / empty
   */
  function t(key) {
    var value = _map[key];
    if (value && typeof value === 'string' && value.length > 0) {
      return value;
    }
    return key;
  }

  /**
   * Load a language JSON file into the in-memory map.
   * Attempts server fetch first, falls back to local asset, preserves map on double failure.
   * Implements concurrent-call deduplication (last call wins).
   * @param {string} languageCode
   * @returns {Promise<void>}
   */
  function loadLanguage(languageCode) {
    // Validate language code
    if (_config.supportedLanguages.indexOf(languageCode) === -1) {
      return Promise.reject(new Error('Unsupported language: ' + languageCode));
    }

    // Concurrent deduplication: increment request ID, capture for this call
    var thisRequestId = ++_requestId;
    _loading = thisRequestId;

    /**
     * Attempt to fetch from the server with a 5000ms timeout.
     * @returns {Promise<Object>} parsed JSON
     */
    function fetchFromServer() {
      var controller = new AbortController();
      var timeoutId = setTimeout(function () {
        controller.abort();
      }, _config.timeout);

      return fetch(_config.serverBaseUrl + '/' + languageCode + '.json', {
        signal: controller.signal
      })
        .then(function (response) {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error('Server returned ' + response.status);
          }
          return response.json();
        })
        .catch(function (err) {
          clearTimeout(timeoutId);
          throw err;
        });
    }

    /**
     * Attempt to fetch from the local fallback path.
     * @returns {Promise<Object>} parsed JSON
     */
    function fetchFromFallback() {
      return fetch(_config.fallbackBasePath + '/' + languageCode + '.json')
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Fallback returned ' + response.status);
          }
          return response.json();
        });
    }

    return fetchFromServer()
      .catch(function () {
        // Server failed — try fallback
        return fetchFromFallback();
      })
      .then(function (parsed) {
        // Check dedup: if a newer call has been made, discard this result
        if (_loading !== thisRequestId) {
          return;
        }

        // Replace _map contents in-place (keep same object reference)
        Object.keys(_map).forEach(function (k) { delete _map[k]; });
        Object.assign(_map, parsed);

        // Persist language choice to localStorage
        try {
          localStorage.setItem(_config.storageKey, languageCode);
        } catch (e) { /* localStorage unavailable */ }

        // Automatically apply translations to the DOM
        applyTranslations();
      })
      .catch(function () {
        // Double failure: both server and fallback failed
        // Check dedup before logging
        if (_loading !== thisRequestId) {
          return;
        }

        // Retain existing _map, log warning, resolve (don't reject)
        console.warn('i18n: failed to load ' + languageCode);
      });
  }

  /**
   * Apply translations to all marked DOM elements.
   * Processes data-i18n, data-i18n-placeholder, data-i18n-aria attributes.
   * All DOM writes are batched in a single requestAnimationFrame to prevent
   * flash of untranslated content.
   */
  function applyTranslations() {
    requestAnimationFrame(function () {
      // 1. Handle data-i18n elements: replace first direct text node
      var i18nElements = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < i18nElements.length; i++) {
        var el = i18nElements[i];
        var key = el.getAttribute('data-i18n');
        var translated = t(key);

        // If translation is missing (t returns the key itself), warn and skip
        if (translated === key) {
          console.warn('i18n: missing key "' + key + '"');
          continue;
        }

        // Replace only the first direct text node, preserving child elements
        var childNodes = el.childNodes;
        var textNodeFound = false;
        for (var j = 0; j < childNodes.length; j++) {
          if (childNodes[j].nodeType === 3) { // Node.TEXT_NODE
            childNodes[j].nodeValue = translated;
            textNodeFound = true;
            break;
          }
        }
        // If no text node exists, insert one at the beginning
        if (!textNodeFound) {
          el.insertBefore(document.createTextNode(translated), el.firstChild);
        }
      }

      // 2. Handle data-i18n-placeholder elements
      var placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
      for (var p = 0; p < placeholderElements.length; p++) {
        var plEl = placeholderElements[p];
        var plKey = plEl.getAttribute('data-i18n-placeholder');
        plEl.placeholder = t(plKey);
      }

      // 3. Handle data-i18n-aria elements
      var ariaElements = document.querySelectorAll('[data-i18n-aria]');
      for (var a = 0; a < ariaElements.length; a++) {
        var ariaEl = ariaElements[a];
        var ariaKey = ariaEl.getAttribute('data-i18n-aria');
        ariaEl.setAttribute('aria-label', t(ariaKey));
      }
    });
  }

  /**
   * Fetch the list of available languages.
   * Tries server endpoint first, falls back to bundled locale_list.json.
   * @returns {Promise<Array<{code: string, name: string, colorCode: string, hash: string}>>}
   */
  function getLanguageList() {
    var serverUrl = _config.serverBaseUrl + '/locale_list.json';
    var fallbackUrl = _config.fallbackBasePath + '/locale_list.json';

    function parseLanguageList(data) {
      var list = data.multiLanguageListNew;
      if (!Array.isArray(list)) {
        throw new Error('i18n: invalid language list format');
      }
      return list.map(function (item) {
        return {
          code: item.code,
          name: item.name,
          colorCode: item.colorCode,
          hash: item.hash
        };
      });
    }

    function fetchFromServer() {
      var controller;
      var timeoutId;
      var signal;

      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        signal = controller.signal;
      }

      timeoutId = setTimeout(function () {
        if (controller) controller.abort();
      }, _config.timeout);

      var options = {};
      if (signal) options.signal = signal;

      return fetch(serverUrl, options)
        .then(function (response) {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error('i18n: server returned ' + response.status);
          }
          return response.json();
        })
        .then(function (data) {
          return parseLanguageList(data);
        })
        .catch(function (err) {
          clearTimeout(timeoutId);
          throw err;
        });
    }

    function fetchFromFallback() {
      return fetch(fallbackUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('i18n: fallback returned ' + response.status);
          }
          return response.json();
        })
        .then(function (data) {
          return parseLanguageList(data);
        });
    }

    return fetchFromServer().catch(function () {
      return fetchFromFallback();
    }).catch(function () {
      return Promise.reject(new Error('i18n: failed to load language list'));
    });
  }

  // Expose the singleton on window
  window.i18n = {
    loadLanguage: loadLanguage,
    t: t,
    applyTranslations: applyTranslations,
    getLanguageList: getLanguageList,
    getActiveLanguage: getActiveLanguage,
    _map: _map,
    _loading: _loading,
    _config: _config
  };

  // Auto-initialize: load persisted language on script inclusion
  (function init() {
    var stored;
    try {
      stored = localStorage.getItem(_config.storageKey);
    } catch (e) {
      stored = null;
    }

    if (stored && _config.supportedLanguages.indexOf(stored) !== -1) {
      loadLanguage(stored);
    } else if (stored) {
      // Invalid code in localStorage — sanitize to 'en'
      try {
        localStorage.setItem(_config.storageKey, 'en');
      } catch (e) { /* ignore */ }
      loadLanguage('en');
    } else {
      // No stored preference — default to English
      loadLanguage('en');
    }
  })();

})();
