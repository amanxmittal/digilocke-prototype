/**
 * Smoke tests for bundled localization assets.
 * Validates: Requirements 2.4, 7.3, 8.4
 */

const path = require('path');
const fs = require('fs');

const SUPPORTED_CODES = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'];
const LANGUAGE_DIR = path.resolve(__dirname, '../../assets/language');

describe('Bundled language JSON files', () => {
  test.each(SUPPORTED_CODES)('%s.json exists and is valid flat JSON', (code) => {
    const filePath = path.resolve(LANGUAGE_DIR, `${code}.json`);

    // File should exist and be readable
    const content = fs.readFileSync(filePath, 'utf-8');

    // Should parse as valid JSON
    const parsed = JSON.parse(content);

    // Should be a flat object (no arrays or nested objects at top level)
    expect(typeof parsed).toBe('object');
    expect(Array.isArray(parsed)).toBe(false);
    expect(parsed).not.toBeNull();

    for (const key of Object.keys(parsed)) {
      const value = parsed[key];
      expect(typeof value).toBe('string');
    }
  });
});

describe('locale_list.json structure', () => {
  test('contains 12 entries with correct structure', () => {
    const filePath = path.resolve(LANGUAGE_DIR, 'locale_list.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    // multiLanguageListNew should be an array of length 12
    expect(Array.isArray(parsed.multiLanguageListNew)).toBe(true);
    expect(parsed.multiLanguageListNew).toHaveLength(12);

    // Each entry should have the required fields with correct types
    const codes = [];
    for (const entry of parsed.multiLanguageListNew) {
      expect(typeof entry.code).toBe('string');
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.colorCode).toBe('string');
      expect(typeof entry.hash).toBe('string');
      codes.push(entry.code);
    }

    // The codes should cover all 12 supported languages
    expect(codes.sort()).toEqual([...SUPPORTED_CODES].sort());
  });
});

describe('HTML pages reference ../assets/i18n.js', () => {
  const htmlFiles = [
    'screens/74-prelogin-home.html',
    'screens/06-home.html',
    'desktop/74-prelogin-home.html',
    'desktop/06-home.html',
  ];

  test.each(htmlFiles)('%s contains a script tag referencing ../assets/i18n.js', (relPath) => {
    const filePath = path.resolve(__dirname, '../../', relPath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Should contain a <script tag that references ../assets/i18n.js
    expect(content).toMatch(/<script[^>]*src=["']\.\.\/assets\/i18n\.js["'][^>]*>/);
  });
});
