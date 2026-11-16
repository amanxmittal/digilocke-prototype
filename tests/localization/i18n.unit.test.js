/**
 * Unit tests for assets/i18n.js — TranslateManager singleton skeleton
 * Covers: t(key) lookup, getActiveLanguage(), _config structure
 */

const fs = require('fs');
const path = require('path');

// Simulate a browser-like environment
function loadI18n(storageOverride) {
  // Reset window and localStorage mock
  const storage = storageOverride || {};
  global.window = global.window || {};
  global.localStorage = {
    getItem: function (k) { return storage[k] !== undefined ? storage[k] : null; },
    setItem: function (k, v) { storage[k] = String(v); },
    removeItem: function (k) { delete storage[k]; }
  };

  // Provide browser globals needed by the IIFE auto-init
  if (!global.AbortController) {
    global.AbortController = class {
      constructor() { this.signal = {}; }
      abort() {}
    };
  }
  if (!global.fetch) {
    global.fetch = jest.fn().mockRejectedValue(new Error('no mock'));
  }
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = jest.fn(function (cb) { cb(); });
  }
  if (!global.document) {
    global.document = { querySelectorAll: jest.fn().mockReturnValue([]) };
  }

  // Clear any previous i18n
  delete global.window.i18n;

  // Load the script by evaluating it
  const code = fs.readFileSync(
    path.resolve(__dirname, '../../assets/i18n.js'),
    'utf-8'
  );
  eval(code);
  return global.window.i18n;
}

describe('i18n singleton skeleton', () => {
  let i18n;

  beforeEach(() => {
    i18n = loadI18n();
  });

  describe('API surface', () => {
    test('exposes loadLanguage as a function', () => {
      expect(typeof i18n.loadLanguage).toBe('function');
    });

    test('exposes t as a function', () => {
      expect(typeof i18n.t).toBe('function');
    });

    test('exposes applyTranslations as a function', () => {
      expect(typeof i18n.applyTranslations).toBe('function');
    });

    test('exposes getLanguageList as a function', () => {
      expect(typeof i18n.getLanguageList).toBe('function');
    });

    test('exposes getActiveLanguage as a function', () => {
      expect(typeof i18n.getActiveLanguage).toBe('function');
    });
  });

  describe('_config', () => {
    test('has correct serverBaseUrl', () => {
      expect(i18n._config.serverBaseUrl).toBe('/language');
    });

    test('has correct fallbackBasePath', () => {
      expect(i18n._config.fallbackBasePath).toBe('assets/language');
    });

    test('has timeout of 5000', () => {
      expect(i18n._config.timeout).toBe(5000);
    });

    test('has storageKey dl-language', () => {
      expect(i18n._config.storageKey).toBe('dl-language');
    });

    test('has all 12 supported language codes', () => {
      expect(i18n._config.supportedLanguages).toEqual(
        ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te']
      );
    });
  });

  describe('_map and _loading', () => {
    test('_map is an empty object initially', () => {
      expect(i18n._map).toEqual({});
    });

    test('_loading is null initially', () => {
      expect(i18n._loading).toBeNull();
    });
  });

  describe('t(key)', () => {
    test('returns the key itself when map is empty', () => {
      expect(i18n.t('Home')).toBe('Home');
    });

    test('returns translated value when key exists in map', () => {
      i18n._map['Home'] = 'होम';
      expect(i18n.t('Home')).toBe('होम');
    });

    test('returns key when value is empty string', () => {
      i18n._map['Settings'] = '';
      expect(i18n.t('Settings')).toBe('Settings');
    });

    test('returns key when key is not in map', () => {
      i18n._map['Home'] = 'होम';
      expect(i18n.t('Documents')).toBe('Documents');
    });

    test('returns translated value for keys with spaces', () => {
      i18n._map['Sign In'] = 'साइन इन';
      expect(i18n.t('Sign In')).toBe('साइन इन');
    });
  });

  describe('getActiveLanguage()', () => {
    test('returns en when localStorage is empty', () => {
      expect(i18n.getActiveLanguage()).toBe('en');
    });

    test('returns stored language code when valid', () => {
      localStorage.setItem('dl-language', 'hi');
      expect(i18n.getActiveLanguage()).toBe('hi');
    });

    test('returns en when stored value is not a supported code', () => {
      localStorage.setItem('dl-language', 'xx');
      expect(i18n.getActiveLanguage()).toBe('en');
    });

    test('returns en when stored value is empty string', () => {
      localStorage.setItem('dl-language', '');
      expect(i18n.getActiveLanguage()).toBe('en');
    });

    test('recognizes all 12 supported codes', () => {
      var codes = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];
      codes.forEach(function (code) {
        localStorage.setItem('dl-language', code);
        expect(i18n.getActiveLanguage()).toBe(code);
      });
    });
  });

  describe('stub methods', () => {
    test('applyTranslations does not throw', () => {
      expect(() => i18n.applyTranslations()).not.toThrow();
    });
  });

  describe('initialization sequence (IIFE auto-init)', () => {
    beforeEach(() => {
      // Clean up before each test in this describe
      delete global.fetch;
      delete global.AbortController;
      delete global.document;
      delete global.requestAnimationFrame;
    });

    afterEach(() => {
      delete global.fetch;
      delete global.AbortController;
      delete global.document;
      delete global.requestAnimationFrame;
    });

    test('calls fetch (loadLanguage) automatically on script load with no stored language', () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ Home: 'Home' })
      });
      global.fetch = fetchMock;
      global.AbortController = class {
        constructor() { this.signal = {}; }
        abort() {}
      };
      global.requestAnimationFrame = jest.fn(function (cb) { cb(); });
      global.document = { querySelectorAll: jest.fn().mockReturnValue([]) };

      // Load i18n with empty storage (no stored language)
      loadI18n({});

      // The IIFE should have called fetch for en.json (default language)
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock.mock.calls[0][0]).toBe('/language/en.json');
    });

    test('calls loadLanguage with stored language from localStorage on init', () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ Home: 'होम' })
      });
      global.fetch = fetchMock;
      global.AbortController = class {
        constructor() { this.signal = {}; }
        abort() {}
      };
      global.requestAnimationFrame = jest.fn(function (cb) { cb(); });
      global.document = { querySelectorAll: jest.fn().mockReturnValue([]) };

      // Load i18n with 'hi' stored
      loadI18n({ 'dl-language': 'hi' });

      // The IIFE should have called fetch for hi.json (stored language)
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock.mock.calls[0][0]).toBe('/language/hi.json');
    });

    test('defaults to en when localStorage has invalid language code', () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ Home: 'Home' })
      });
      global.fetch = fetchMock;
      global.AbortController = class {
        constructor() { this.signal = {}; }
        abort() {}
      };
      global.requestAnimationFrame = jest.fn(function (cb) { cb(); });
      global.document = { querySelectorAll: jest.fn().mockReturnValue([]) };

      // Load i18n with invalid code
      loadI18n({ 'dl-language': 'zz' });

      // Should sanitize to 'en' and load English
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock.mock.calls[0][0]).toBe('/language/en.json');
    });
  });

  describe('requestAnimationFrame batching', () => {
    test('applyTranslations calls requestAnimationFrame exactly once per invocation', () => {
      const rafMock = jest.fn(function (cb) { cb(); });
      global.requestAnimationFrame = rafMock;
      global.document = { querySelectorAll: jest.fn().mockReturnValue([]) };

      rafMock.mockClear();
      i18n.applyTranslations();

      expect(rafMock).toHaveBeenCalledTimes(1);
      expect(typeof rafMock.mock.calls[0][0]).toBe('function');
    });

    test('applyTranslations batches all DOM writes inside the rAF callback', () => {
      const callOrder = [];
      const rafMock = jest.fn(function (cb) {
        callOrder.push('raf-start');
        cb();
        callOrder.push('raf-end');
      });
      global.requestAnimationFrame = rafMock;

      const querySelectorAllMock = jest.fn().mockReturnValue([]);
      global.document = { querySelectorAll: querySelectorAllMock };

      i18n.applyTranslations();

      // querySelectorAll calls should happen inside raf callback
      expect(callOrder[0]).toBe('raf-start');
      expect(querySelectorAllMock).toHaveBeenCalled();
    });
  });

  describe('timeout behavior (AbortController)', () => {
    test('loadLanguage sets a 5000ms timeout via setTimeout for abort', async () => {
      const abortMock = jest.fn();
      global.AbortController = class {
        constructor() {
          this.signal = { aborted: false };
          this.abort = abortMock;
        }
      };

      global.fetch = jest.fn().mockRejectedValue(new Error('aborted'));

      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      const promise = i18n.loadLanguage('hi');

      // Find the setTimeout call with 5000ms
      const timeoutCall = setTimeoutSpy.mock.calls.find(call => call[1] === 5000);
      expect(timeoutCall).toBeDefined();
      expect(timeoutCall[1]).toBe(5000);

      await promise;
      setTimeoutSpy.mockRestore();
    });

    test('loadLanguage clears timeout when fetch succeeds before 5000ms', async () => {
      global.AbortController = class {
        constructor() {
          this.signal = { aborted: false };
          this.abort = jest.fn();
        }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ Home: 'होम' })
      });

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      await i18n.loadLanguage('hi');

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('getLanguageList()', () => {
    beforeEach(() => {
      // Override the defaults set by loadI18n for these specific tests
      global.AbortController = class {
        constructor() { this.signal = {}; }
        abort() {}
      };
    });

    afterEach(() => {
      delete global.fetch;
    });

    test('returns language list from server when available', async () => {
      const mockData = {
        multiLanguageListNew: [
          { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' },
          { code: 'hi', name: 'हिंदी', colorCode: '2196F3', hash: 'hi_v1' }
        ]
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await i18n.getLanguageList();
      expect(result).toEqual([
        { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' },
        { code: 'hi', name: 'हिंदी', colorCode: '2196F3', hash: 'hi_v1' }
      ]);
      expect(global.fetch).toHaveBeenCalledWith(
        '/language/locale_list.json',
        expect.objectContaining({})
      );
    });

    test('falls back to local file when server fails', async () => {
      const fallbackData = {
        multiLanguageListNew: [
          { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' }
        ]
      };

      let callCount = 0;
      global.fetch = jest.fn().mockImplementation((url) => {
        callCount++;
        if (callCount === 1) {
          // Server fails
          return Promise.reject(new Error('Network error'));
        }
        // Fallback succeeds
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fallbackData)
        });
      });

      const result = await i18n.getLanguageList();
      expect(result).toEqual([
        { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' }
      ]);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('falls back when server returns non-2xx', async () => {
      const fallbackData = {
        multiLanguageListNew: [
          { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' }
        ]
      };

      let callCount = 0;
      global.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ ok: false, status: 500 });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fallbackData)
        });
      });

      const result = await i18n.getLanguageList();
      expect(result).toEqual([
        { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' }
      ]);
    });

    test('rejects when both server and fallback fail', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(i18n.getLanguageList()).rejects.toThrow('i18n: failed to load language list');
    });

    test('maps only code, name, colorCode, hash fields from response', async () => {
      const mockData = {
        multiLanguageListNew: [
          { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1', extraField: 'ignored' }
        ]
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await i18n.getLanguageList();
      expect(result[0]).toEqual({ code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' });
      expect(result[0].extraField).toBeUndefined();
    });

    test('falls back when server returns invalid JSON structure', async () => {
      const fallbackData = {
        multiLanguageListNew: [
          { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' }
        ]
      };

      let callCount = 0;
      global.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // Server returns invalid structure (no multiLanguageListNew)
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ someOtherField: [] })
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fallbackData)
        });
      });

      const result = await i18n.getLanguageList();
      expect(result).toEqual([
        { code: 'en', name: 'English', colorCode: 'FFB54A', hash: 'en_v1' }
      ]);
    });
  });
});
