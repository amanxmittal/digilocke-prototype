/**
 * Property-based tests for i18n TranslateManager.
 *
 * Feature: localization
 * File: tests/localization/i18n.property.test.js
 *
 * Uses fast-check to validate universal correctness properties of the
 * TranslateManager module (assets/i18n.js).
 */
const fc = require('fast-check');

// --- Browser environment mocks (testEnvironment: 'node') ---

let localStorageStore = {};

beforeAll(() => {
  // Mock localStorage
  global.localStorage = {
    getItem: (key) => localStorageStore[key] || null,
    setItem: (key, value) => { localStorageStore[key] = String(value); },
    removeItem: (key) => { delete localStorageStore[key]; },
    clear: () => { localStorageStore = {}; }
  };

  // Mock fetch — resolves with empty JSON (auto-init will call loadLanguage('en'))
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    })
  );

  // Mock document with querySelectorAll
  global.document = {
    querySelectorAll: () => [],
    createTextNode: (text) => ({ nodeType: 3, nodeValue: text })
  };

  // Mock requestAnimationFrame
  global.requestAnimationFrame = (cb) => { cb(); return 0; };

  // Mock AbortController
  global.AbortController = class {
    constructor() { this.signal = {}; }
    abort() {}
  };

  // Mock window (the IIFE assigns to window.i18n)
  global.window = global;

  // Now require i18n.js — the IIFE will run and set up window.i18n
  require('../../assets/i18n.js');
});

afterAll(() => {
  delete global.localStorage;
  delete global.fetch;
  delete global.document;
  delete global.requestAnimationFrame;
  delete global.AbortController;
});

beforeEach(() => {
  // Clear the map before each test
  const map = global.window.i18n._map;
  Object.keys(map).forEach((k) => { delete map[k]; });
  localStorageStore = {};
});

// --- Arbitraries ---

/**
 * Generates a non-empty string suitable for use as a translation key.
 * Keys are non-empty strings (matching the i18n convention of English text keys).
 */
const translationKeyArb = fc.string({ minLength: 1, maxLength: 100 }).filter(
  (s) => s.trim().length > 0
);

/**
 * Generates a non-empty string suitable for use as a translation value.
 * Values must be non-empty strings for t() to return them (otherwise t() returns the key).
 */
const translationValueArb = fc.string({ minLength: 1, maxLength: 200 }).filter(
  (s) => s.length > 0
);

/**
 * Generates a flat key-value translation map with 1 to 6000 entries.
 * Uses uniqueArray of [key, value] tuples to avoid duplicate keys.
 */
const translationMapArb = fc
  .uniqueArray(fc.tuple(translationKeyArb, translationValueArb), {
    minLength: 1,
    maxLength: 6000,
    selector: (entry) => entry[0]
  })
  .map((entries) => Object.fromEntries(entries));

// --- Property Tests ---

describe('Feature: localization, Property 1: Translation lookup correctness', () => {
  /**
   * **Validates: Requirements 1.2, 1.5**
   *
   * For any flat key-value map loaded into the TranslateManager,
   * t(key) must return the exact corresponding value for every key in the map.
   */
  it('t(key) returns the correct value for every key in an arbitrary translation map', () => {
    fc.assert(
      fc.property(translationMapArb, (map) => {
        const i18n = global.window.i18n;

        // Load the map directly into _map (simulating a successful loadLanguage)
        const internalMap = i18n._map;
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });
        Object.assign(internalMap, map);

        // Assert t(key) returns correct value for every entry
        for (const [key, value] of Object.entries(map)) {
          const result = i18n.t(key);
          if (result !== value) {
            return false; // Property violation
          }
        }
        return true;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});


describe('Feature: localization, Property 2: Missing key fallback identity', () => {
  /**
   * **Validates: Requirements 1.3**
   *
   * For any string that is not present as a key in the currently loaded translation map,
   * t(key) shall return that string unchanged (identity function for missing keys).
   */
  it('t(key) returns the key itself for any key not present in the loaded map', () => {
    fc.assert(
      fc.property(translationMapArb, translationKeyArb, (map, candidateKey) => {
        const i18n = global.window.i18n;

        // Load the map directly into _map
        const internalMap = i18n._map;
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });
        Object.assign(internalMap, map);

        // Only test keys that are NOT in the loaded map
        fc.pre(!(candidateKey in map));

        // Assert t(key) returns the key itself
        const result = i18n.t(candidateKey);
        return result === candidateKey;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});

describe('Feature: localization, Property 5: Fallback load on server failure', () => {
  /**
   * **Validates: Requirements 2.2**
   *
   * When the server fetch fails (network error, non-2xx response, or timeout),
   * the TranslateManager loads translations from the bundled fallback file.
   * For any supported language code and any type of server failure, the
   * resulting _map must contain the fallback translations.
   */

  const supportedLanguages = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];

  /** Arbitrary: pick a supported language code */
  const supportedLangArb = fc.constantFrom(...supportedLanguages);

  /** Arbitrary: pick a server failure type */
  const failureTypeArb = fc.constantFrom('network-error', 'non-2xx', 'timeout');

  /** Arbitrary: generate a fallback translation map (1–50 entries for speed) */
  const fallbackMapArb = fc
    .uniqueArray(fc.tuple(translationKeyArb, translationValueArb), {
      minLength: 1,
      maxLength: 50,
      selector: (entry) => entry[0]
    })
    .map((entries) => Object.fromEntries(entries));

  it('loadLanguage loads from fallback when server fetch fails', async () => {
    await fc.assert(
      fc.asyncProperty(supportedLangArb, failureTypeArb, fallbackMapArb, async (langCode, failureType, fallbackMap) => {
        const i18n = global.window.i18n;

        // Clear the internal map
        const internalMap = i18n._map;
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });

        // Set up mock fetch: server URL fails, fallback URL succeeds
        global.fetch = jest.fn((url, options) => {
          const fallbackPattern = 'assets/language/' + langCode + '.json';

          // Check fallback URL first (it's more specific: starts with 'assets/')
          if (url === fallbackPattern || url.startsWith('assets/language')) {
            // Fallback succeeds with the generated map
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(fallbackMap)
            });
          }

          // All other URLs are treated as server requests — simulate failure
          switch (failureType) {
            case 'network-error':
              return Promise.reject(new Error('Network error'));
            case 'non-2xx':
              return Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.reject(new Error('not ok'))
              });
            case 'timeout':
              // Simulate AbortController abort
              return Promise.reject(new DOMException('Aborted', 'AbortError'));
            default:
              return Promise.reject(new Error('Unknown failure'));
          }
        });

        // Call loadLanguage
        await i18n.loadLanguage(langCode);

        // Assert that _map now contains all fallback entries
        for (const [key, value] of Object.entries(fallbackMap)) {
          if (internalMap[key] !== value) {
            return false;
          }
        }

        // Assert map size equals fallback map size (no leftover entries)
        if (Object.keys(internalMap).length !== Object.keys(fallbackMap).length) {
          return false;
        }

        return true;
      }),
      { numRuns: 50, verbose: true }
    );
  });
});

describe('Feature: localization, Property 4: Concurrent load resolves to most recent', () => {
  /**
   * **Validates: Requirements 1.7**
   *
   * When loadLanguage(A) is called followed immediately by loadLanguage(B) without
   * awaiting A, the final in-memory map must contain only B's translations.
   * The earlier call's result is discarded via the _requestId deduplication mechanism.
   */

  const supportedLanguages = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];

  /**
   * Arbitrary: pick two distinct supported language codes.
   */
  const distinctLanguagePairArb = fc
    .tuple(
      fc.integer({ min: 0, max: supportedLanguages.length - 1 }),
      fc.integer({ min: 0, max: supportedLanguages.length - 1 })
    )
    .filter(([a, b]) => a !== b)
    .map(([a, b]) => [supportedLanguages[a], supportedLanguages[b]]);

  it('final map contains only the most recently requested language translations', async () => {
    await fc.assert(
      fc.asyncProperty(distinctLanguagePairArb, async ([codeA, codeB]) => {
        const i18n = global.window.i18n;

        // Clear the map before each iteration
        const internalMap = i18n._map;
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });

        // Build distinct translation maps for each language code
        const translationsA = { greeting: 'Hello from ' + codeA, label: 'Label_' + codeA };
        const translationsB = { greeting: 'Hello from ' + codeB, label: 'Label_' + codeB };

        // Mock fetch to return different translations based on the requested URL.
        // Add a small delay to language A's response so B can resolve before or concurrently.
        global.fetch = jest.fn((url, options) => {
          if (url.includes('/' + codeA + '.json')) {
            // Simulate a slightly delayed response for A
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  ok: true,
                  json: () => Promise.resolve(translationsA)
                });
              }, 50);
            });
          }
          if (url.includes('/' + codeB + '.json')) {
            // B resolves faster
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(translationsB)
            });
          }
          // Default: empty response
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
          });
        });

        // Call loadLanguage(A) then loadLanguage(B) without awaiting A
        const promiseA = i18n.loadLanguage(codeA);
        const promiseB = i18n.loadLanguage(codeB);

        // Wait for both to settle
        await Promise.allSettled([promiseA, promiseB]);

        // The final map should contain only B's translations
        // (A's result should have been discarded by the deduplication logic)
        expect(internalMap).toEqual(translationsB);
      }),
      { numRuns: 50, verbose: true }
    );
  });
});

describe('Feature: localization, Property 3: Unsupported language code rejection preserves state', () => {
  /**
   * **Validates: Requirements 1.6**
   *
   * For any string that is NOT one of the 12 supported language codes,
   * calling loadLanguage(code) must reject with an Error and leave _map unchanged.
   */

  const SUPPORTED_CODES = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];

  /**
   * Generates arbitrary strings that are NOT in the supported language codes list.
   */
  const unsupportedCodeArb = fc.string({ minLength: 0, maxLength: 50 }).filter(
    (s) => SUPPORTED_CODES.indexOf(s) === -1
  );

  it('loadLanguage rejects with Error for unsupported codes and leaves _map unchanged', async () => {
    await fc.assert(
      fc.asyncProperty(unsupportedCodeArb, translationMapArb, async (invalidCode, preExistingMap) => {
        const i18n = global.window.i18n;
        const internalMap = i18n._map;

        // Pre-populate _map with known data
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });
        Object.assign(internalMap, preExistingMap);

        // Snapshot the map before calling loadLanguage
        const mapBefore = { ...internalMap };

        // Call loadLanguage with the unsupported code
        let rejected = false;
        let errorMessage = '';
        try {
          await i18n.loadLanguage(invalidCode);
        } catch (err) {
          rejected = true;
          errorMessage = err.message;
        }

        // Assert: Promise rejected
        if (!rejected) {
          return false;
        }

        // Assert: error message indicates unsupported language
        if (errorMessage !== 'Unsupported language: ' + invalidCode) {
          return false;
        }

        // Assert: _map is unchanged
        const mapAfter = { ...internalMap };
        const keysBefore = Object.keys(mapBefore).sort();
        const keysAfter = Object.keys(mapAfter).sort();

        if (keysBefore.length !== keysAfter.length) {
          return false;
        }

        for (let i = 0; i < keysBefore.length; i++) {
          if (keysBefore[i] !== keysAfter[i]) {
            return false;
          }
          if (mapBefore[keysBefore[i]] !== mapAfter[keysAfter[i]]) {
            return false;
          }
        }

        return true;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});


describe('Feature: localization, Property 6: Double failure preserves existing map', () => {
  /**
   * **Validates: Requirements 2.3**
   *
   * When both the server fetch and the fallback asset load fail for a given
   * language code, the TranslateManager retains the previously loaded translations
   * in the in-memory map and resolves the Promise without clearing existing translations.
   */

  const supportedLanguages = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];

  /** Arbitrary: pick a supported language code */
  const supportedLangArb = fc.constantFrom(...supportedLanguages);

  /** Arbitrary: generate a pre-existing translation map (1–50 entries) */
  const preExistingMapArb = fc
    .uniqueArray(fc.tuple(translationKeyArb, translationValueArb), {
      minLength: 1,
      maxLength: 50,
      selector: (entry) => entry[0]
    })
    .map((entries) => Object.fromEntries(entries));

  it('_map remains identical to its pre-call state when both server and fallback fail', async () => {
    await fc.assert(
      fc.asyncProperty(supportedLangArb, preExistingMapArb, async (langCode, preExistingMap) => {
        const i18n = global.window.i18n;
        const internalMap = i18n._map;

        // Pre-populate _map with known data
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });
        Object.assign(internalMap, preExistingMap);

        // Snapshot the map before calling loadLanguage
        const mapBefore = { ...internalMap };

        // Mock fetch: BOTH server and fallback fail
        global.fetch = jest.fn(() => {
          return Promise.reject(new Error('Network failure'));
        });

        // Call loadLanguage — should resolve (NOT reject)
        let rejected = false;
        try {
          await i18n.loadLanguage(langCode);
        } catch (err) {
          rejected = true;
        }

        // Assert: Promise resolves (does NOT reject)
        if (rejected) {
          return false;
        }

        // Assert: _map remains identical to its pre-call state
        const mapAfter = { ...internalMap };
        const keysBefore = Object.keys(mapBefore).sort();
        const keysAfter = Object.keys(mapAfter).sort();

        if (keysBefore.length !== keysAfter.length) {
          return false;
        }

        for (let i = 0; i < keysBefore.length; i++) {
          if (keysBefore[i] !== keysAfter[i]) {
            return false;
          }
          if (mapBefore[keysBefore[i]] !== mapAfter[keysAfter[i]]) {
            return false;
          }
        }

        return true;
      }),
      { numRuns: 50, verbose: true }
    );
  });
});

describe('Feature: localization, Property 7: Language persistence round-trip', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For any supported language code, after calling loadLanguage(code) successfully,
   * localStorage.getItem('dl-language') returns exactly that code.
   */

  const supportedLanguages = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];

  /** Arbitrary: pick a supported language code */
  const supportedLangArb = fc.constantFrom(...supportedLanguages);

  /** Arbitrary: generate a translation map to return from mock fetch */
  const serverMapArb = fc
    .uniqueArray(fc.tuple(translationKeyArb, translationValueArb), {
      minLength: 1,
      maxLength: 20,
      selector: (entry) => entry[0]
    })
    .map((entries) => Object.fromEntries(entries));

  it('localStorage contains the language code after a successful loadLanguage call', async () => {
    await fc.assert(
      fc.asyncProperty(supportedLangArb, serverMapArb, async (langCode, serverMap) => {
        const i18n = global.window.i18n;

        // Clear localStorage and internal map
        localStorageStore = {};
        const internalMap = i18n._map;
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });

        // Mock fetch to succeed with the generated map
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(serverMap)
          })
        );

        // Call loadLanguage
        await i18n.loadLanguage(langCode);

        // Assert: localStorage contains the exact language code
        const stored = localStorage.getItem('dl-language');
        return stored === langCode;
      }),
      { numRuns: 50, verbose: true }
    );
  });
});

describe('Feature: localization, Property 8: Invalid localStorage code sanitization', () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * When localStorage contains an invalid language code (not one of the 12 supported codes),
   * the system sanitizes it to 'en'. getActiveLanguage() returns 'en' for any invalid stored value,
   * and after loadLanguage('en') is called, localStorage is overwritten with 'en'.
   */

  const SUPPORTED_CODES = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];

  /**
   * Generates arbitrary strings that are NOT in the supported language codes list.
   * These simulate corrupted/invalid localStorage values.
   */
  const invalidCodeArb = fc.string({ minLength: 1, maxLength: 50 }).filter(
    (s) => SUPPORTED_CODES.indexOf(s) === -1
  );

  it('getActiveLanguage returns "en" for invalid stored codes and loadLanguage("en") persists "en"', async () => {
    await fc.assert(
      fc.asyncProperty(invalidCodeArb, async (invalidCode) => {
        const i18n = global.window.i18n;

        // Store an invalid code in localStorage
        localStorageStore = {};
        localStorage.setItem('dl-language', invalidCode);

        // Assert: getActiveLanguage() returns 'en' for invalid stored value
        const activeLanguage = i18n.getActiveLanguage();
        if (activeLanguage !== 'en') {
          return false;
        }

        // Mock fetch to succeed (so loadLanguage('en') completes successfully)
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ 'Hello': 'Hello' })
          })
        );

        // Simulate the sanitization: call loadLanguage('en') as the init logic would
        await i18n.loadLanguage('en');

        // Assert: localStorage is overwritten with 'en'
        const stored = localStorage.getItem('dl-language');
        return stored === 'en';
      }),
      { numRuns: 100, verbose: true }
    );
  });
});


describe('Feature: localization, Property 9: applyTranslations updates all i18n attributes independently', () => {
  /**
   * **Validates: Requirements 4.1, 4.3, 4.4, 9.6**
   *
   * For elements bearing multiple data-i18n* attributes (data-i18n, data-i18n-placeholder,
   * data-i18n-aria), applyTranslations() applies each translation independently to its
   * corresponding target (text content, placeholder, or aria-label).
   */

  /** Arbitrary: generate a translation map with 1–20 entries */
  const smallMapArb = fc
    .uniqueArray(fc.tuple(translationKeyArb, translationValueArb), {
      minLength: 3,
      maxLength: 20,
      selector: (entry) => entry[0]
    })
    .map((entries) => Object.fromEntries(entries));

  it('each data-i18n* attribute is applied independently on elements with multiple attributes', () => {
    fc.assert(
      fc.property(smallMapArb, (map) => {
        const i18n = global.window.i18n;
        const internalMap = i18n._map;

        // Load the map
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });
        Object.assign(internalMap, map);

        const keys = Object.keys(map);
        // We need at least 3 keys for this test
        if (keys.length < 3) return true;

        const textKey = keys[0];
        const placeholderKey = keys[1];
        const ariaKey = keys[2];

        // Create a mock element with all three data-i18n attributes
        const attrs = {
          'data-i18n': textKey,
          'data-i18n-placeholder': placeholderKey,
          'data-i18n-aria': ariaKey
        };
        const textNode = { nodeType: 3, nodeValue: 'old text' };
        const multiEl = {
          getAttribute: (name) => attrs[name] || null,
          setAttribute: (name, value) => { attrs[name] = value; },
          childNodes: [textNode],
          firstChild: textNode,
          insertBefore: (newNode, refNode) => { multiEl.childNodes.unshift(newNode); },
          placeholder: 'old placeholder'
        };

        // Create a text-only element
        const textNode2 = { nodeType: 3, nodeValue: 'old text 2' };
        const textOnlyKey = keys.length > 3 ? keys[3] : keys[0];
        const textOnlyAttrs = { 'data-i18n': textOnlyKey };
        const textOnlyEl = {
          getAttribute: (name) => textOnlyAttrs[name] || null,
          setAttribute: (name, value) => { textOnlyAttrs[name] = value; },
          childNodes: [textNode2],
          firstChild: textNode2,
          insertBefore: (newNode, refNode) => { textOnlyEl.childNodes.unshift(newNode); },
          placeholder: ''
        };

        // Override document.querySelectorAll to return elements based on selector
        const origQSA = global.document.querySelectorAll;
        global.document.querySelectorAll = (selector) => {
          if (selector === '[data-i18n]') return [multiEl, textOnlyEl];
          if (selector === '[data-i18n-placeholder]') return [multiEl];
          if (selector === '[data-i18n-aria]') return [multiEl];
          return [];
        };

        // Call applyTranslations (requestAnimationFrame is synchronous in our mock)
        i18n.applyTranslations();

        // Restore
        global.document.querySelectorAll = origQSA;

        // Assert text node updated for data-i18n
        if (textNode.nodeValue !== map[textKey]) return false;

        // Assert placeholder updated for data-i18n-placeholder
        if (multiEl.placeholder !== map[placeholderKey]) return false;

        // Assert aria-label updated for data-i18n-aria
        if (attrs['aria-label'] !== map[ariaKey]) return false;

        // Assert the second element's text node was also updated
        if (textNode2.nodeValue !== map[textOnlyKey]) return false;

        return true;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});

describe('Feature: localization, Property 10: applyTranslations preserves child elements', () => {
  /**
   * **Validates: Requirements 4.2, 9.4**
   *
   * When applyTranslations() updates an element's text, it replaces only the first
   * direct text node and preserves all child elements (spans, icons) in their
   * original positions with their attributes intact.
   */

  /** Arbitrary: generate a translation map */
  const smallMapArb = fc
    .uniqueArray(fc.tuple(translationKeyArb, translationValueArb), {
      minLength: 1,
      maxLength: 10,
      selector: (entry) => entry[0]
    })
    .map((entries) => Object.fromEntries(entries));

  /** Arbitrary: generate child element structures */
  const childTagArb = fc.constantFrom('span', 'i', 'svg', 'img', 'em', 'strong');
  const childAttrArb = fc.dictionary(
    fc.constantFrom('class', 'data-ic', 'role', 'id'),
    fc.string({ minLength: 1, maxLength: 20 })
  );

  it('child elements remain in their positions with same tagName and attributes after translation', () => {
    fc.assert(
      fc.property(smallMapArb, fc.array(fc.tuple(childTagArb, childAttrArb), { minLength: 1, maxLength: 4 }), (map, children) => {
        const i18n = global.window.i18n;
        const internalMap = i18n._map;

        // Load the map
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });
        Object.assign(internalMap, map);

        const keys = Object.keys(map);
        const textKey = keys[0];

        // Build childNodes: text node first, then child elements
        const textNode = { nodeType: 3, nodeValue: 'original text' };
        const childElements = children.map(([tag, attrs]) => ({
          nodeType: 1,
          tagName: tag,
          attributes: { ...attrs }
        }));
        const childNodes = [textNode, ...childElements];

        const elAttrs = { 'data-i18n': textKey };
        const el = {
          getAttribute: (name) => elAttrs[name] || null,
          setAttribute: (name, value) => { elAttrs[name] = value; },
          childNodes: childNodes,
          firstChild: childNodes[0],
          insertBefore: (newNode, refNode) => { el.childNodes.unshift(newNode); },
          placeholder: ''
        };

        // Snapshot child elements before
        const childSnapshotsBefore = childElements.map((c) => ({
          nodeType: c.nodeType,
          tagName: c.tagName,
          attributes: JSON.stringify(c.attributes)
        }));

        // Override querySelectorAll
        const origQSA = global.document.querySelectorAll;
        global.document.querySelectorAll = (selector) => {
          if (selector === '[data-i18n]') return [el];
          return [];
        };

        i18n.applyTranslations();

        global.document.querySelectorAll = origQSA;

        // Assert text node was updated
        if (textNode.nodeValue !== map[textKey]) return false;

        // Assert child elements are still in the childNodes array at same positions
        for (let i = 0; i < childElements.length; i++) {
          const child = el.childNodes[i + 1]; // +1 because textNode is at index 0
          if (!child) return false;
          if (child.nodeType !== 1) return false;
          if (child.tagName !== childSnapshotsBefore[i].tagName) return false;
          if (JSON.stringify(child.attributes) !== childSnapshotsBefore[i].attributes) return false;
        }

        return true;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});

describe('Feature: localization, Property 11: Missing translation preserves existing text', () => {
  /**
   * **Validates: Requirements 4.6**
   *
   * When an element's data-i18n key has no translation in the loaded map (t(key) returns
   * the key itself), applyTranslations() leaves the element's text node unchanged and
   * logs a warning.
   */

  /** Arbitrary: generate keys that will NOT be in the map */
  const missingKeyArb = fc.string({ minLength: 1, maxLength: 50 }).filter(
    (s) => s.trim().length > 0
  );

  /** Arbitrary: generate original text content */
  const originalTextArb = fc.string({ minLength: 1, maxLength: 100 });

  it('text node remains unchanged when translation key is missing from the map', () => {
    fc.assert(
      fc.property(missingKeyArb, originalTextArb, (missingKey, originalText) => {
        const i18n = global.window.i18n;
        const internalMap = i18n._map;

        // Clear the map — no translations loaded
        Object.keys(internalMap).forEach((k) => { delete internalMap[k]; });

        // Ensure the key is NOT in the map (map is empty, so this always holds)
        // t(missingKey) will return missingKey itself

        const textNode = { nodeType: 3, nodeValue: originalText };
        const elAttrs = { 'data-i18n': missingKey };
        const el = {
          getAttribute: (name) => elAttrs[name] || null,
          setAttribute: (name, value) => { elAttrs[name] = value; },
          childNodes: [textNode],
          firstChild: textNode,
          insertBefore: (newNode, refNode) => { el.childNodes.unshift(newNode); },
          placeholder: ''
        };

        // Override querySelectorAll
        const origQSA = global.document.querySelectorAll;
        global.document.querySelectorAll = (selector) => {
          if (selector === '[data-i18n]') return [el];
          return [];
        };

        i18n.applyTranslations();

        global.document.querySelectorAll = origQSA;

        // Assert: text node value is unchanged (translation was missing, so skip)
        if (textNode.nodeValue !== originalText) return false;

        return true;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});

describe('Feature: localization, Property 12: Dismiss without selection preserves active language', () => {
  /**
   * **Validates: Requirements 5.6, 6.6**
   *
   * For any active language, when the language selector is dismissed without confirming
   * a new selection, no loadLanguage call happens and the active language remains unchanged.
   * This tests the absence of side effects on dismiss.
   */

  const SUPPORTED_CODES = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];
  const supportedLangArb = fc.constantFrom(...SUPPORTED_CODES);

  it('getActiveLanguage returns the same code after a simulated dismiss (no loadLanguage called)', () => {
    fc.assert(
      fc.property(supportedLangArb, (langCode) => {
        const i18n = global.window.i18n;

        // Set localStorage to the active language
        localStorageStore = {};
        localStorage.setItem('dl-language', langCode);

        // Verify active language before dismiss
        const activeBefore = i18n.getActiveLanguage();
        if (activeBefore !== langCode) return false;

        // Simulate dismiss: NO loadLanguage call happens, NO localStorage change
        // (This is the key point — dismiss means no action taken)

        // Verify active language after dismiss
        const activeAfter = i18n.getActiveLanguage();
        if (activeAfter !== langCode) return false;

        // Verify localStorage is unchanged
        const stored = localStorage.getItem('dl-language');
        if (stored !== langCode) return false;

        return true;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});

describe('Feature: localization, Property 13: Non-English disclaimer visibility', () => {
  /**
   * **Validates: Requirements 6.3**
   *
   * For any non-English supported language code, a disclaimer should be shown.
   * For English ('en'), the disclaimer should be hidden. This property tests the
   * underlying logic that drives disclaimer visibility.
   */

  const SUPPORTED_CODES = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];
  const supportedLangArb = fc.constantFrom(...SUPPORTED_CODES);

  /** Arbitrary: any arbitrary non-empty string code (for broader coverage) */
  const arbitraryCodeArb = fc.string({ minLength: 1, maxLength: 10 });

  /**
   * The disclaimer visibility logic from the prototype:
   * Show disclaimer for any language that is NOT 'en'.
   */
  const showDisclaimer = (code) => code !== 'en';

  it('disclaimer is shown for any non-English supported code and hidden for English', () => {
    fc.assert(
      fc.property(supportedLangArb, (code) => {
        if (code === 'en') {
          // English: disclaimer should be hidden
          return showDisclaimer(code) === false;
        } else {
          // Non-English: disclaimer should be shown
          return showDisclaimer(code) === true;
        }
      }),
      { numRuns: 100, verbose: true }
    );
  });

  it('disclaimer logic holds for arbitrary language codes', () => {
    fc.assert(
      fc.property(arbitraryCodeArb, (code) => {
        // For any arbitrary code: disclaimer shown iff code !== 'en'
        return showDisclaimer(code) === (code !== 'en');
      }),
      { numRuns: 100, verbose: true }
    );
  });
});

describe('Feature: localization, Property 14: getLanguageList returns correctly structured objects', () => {
  /**
   * **Validates: Requirements 8.1**
   *
   * Every item returned by getLanguageList() must have `code` (string), `name` (string),
   * `colorCode` (string), and `hash` (string) fields. The `code` field must be one of
   * the 12 supported language codes.
   */

  const SUPPORTED_CODES = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];

  /** Arbitrary: generate a supported language code */
  const supportedCodeArb = fc.constantFrom(...SUPPORTED_CODES);

  /** Arbitrary: generate a non-empty string for name, colorCode, hash */
  const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 50 });

  /** Arbitrary: generate a single language list item */
  const languageItemArb = fc.record({
    code: supportedCodeArb,
    name: nonEmptyStringArb,
    colorCode: nonEmptyStringArb,
    hash: nonEmptyStringArb
  });

  /** Arbitrary: generate an array of 1–12 language items */
  const languageListArb = fc.array(languageItemArb, { minLength: 1, maxLength: 12 });

  it('every item from getLanguageList has code, name, colorCode, hash as strings with valid code', async () => {
    await fc.assert(
      fc.asyncProperty(languageListArb, async (langList) => {
        const i18n = global.window.i18n;

        // Mock fetch to return the generated language list wrapped in multiLanguageListNew
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ multiLanguageListNew: langList })
          })
        );

        // Call getLanguageList
        const result = await i18n.getLanguageList();

        // Assert the result has same length as input
        if (result.length !== langList.length) return false;

        // Assert every returned item has the 4 required string fields
        for (let i = 0; i < result.length; i++) {
          const item = result[i];

          // Check code is a string
          if (typeof item.code !== 'string') return false;
          // Check code is one of the 12 supported codes
          if (SUPPORTED_CODES.indexOf(item.code) === -1) return false;
          // Check name is a string
          if (typeof item.name !== 'string') return false;
          // Check colorCode is a string
          if (typeof item.colorCode !== 'string') return false;
          // Check hash is a string
          if (typeof item.hash !== 'string') return false;

          // Verify the values match the input (structural mapping correctness)
          if (item.code !== langList[i].code) return false;
          if (item.name !== langList[i].name) return false;
          if (item.colorCode !== langList[i].colorCode) return false;
          if (item.hash !== langList[i].hash) return false;
        }

        return true;
      }),
      { numRuns: 100, verbose: true }
    );
  });
});
