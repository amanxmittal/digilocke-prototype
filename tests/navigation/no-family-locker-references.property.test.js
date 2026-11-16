/**
 * Property Test: No Family Locker References on Any Desktop Page
 *
 * Feature: desktop-navigation-enhancements, Property 4: No Family Locker references on any desktop page
 *
 * **Validates: Requirements 3.2, 3.3**
 *
 * For any desktop page HTML file (excluding the redirect page 11-family.html itself),
 * no anchor element href, iframe src, or clickable element SHALL reference 11-family.html.
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const fc = require('fast-check');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

// Glob all HTML files from the desktop directory, excluding 11-family.html
const allHtmlFiles = fs.readdirSync(DESKTOP_DIR)
  .filter(f => f.endsWith('.html') && f !== '11-family.html');

// Pre-load all page DOMs for property testing
const pages = allHtmlFiles.map(file => ({
  file,
  $: cheerio.load(fs.readFileSync(path.join(DESKTOP_DIR, file), 'utf-8')),
}));

describe('Property 4: No Family Locker references on any desktop page', () => {
  it('no anchor element href references 11-family.html on any desktop page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: pages.length - 1 }),
        (index) => {
          const { file, $ } = pages[index];
          const familyLinks = $('a[href*="11-family.html"]');
          expect(familyLinks.length).toBe(0);
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  it('no iframe src references 11-family.html on any desktop page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: pages.length - 1 }),
        (index) => {
          const { file, $ } = pages[index];
          const familyIframes = $('iframe[src*="11-family.html"]');
          expect(familyIframes.length).toBe(0);
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  it('no clickable element references 11-family.html on any desktop page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: pages.length - 1 }),
        (index) => {
          const { file, $ } = pages[index];

          // Check onclick attributes for references to 11-family.html
          const clickableWithOnclick = $('[onclick*="11-family.html"]');
          expect(clickableWithOnclick.length).toBe(0);

          // Check buttons/elements with data attributes referencing 11-family.html
          const elementsWithDataHref = $('[data-href*="11-family.html"]');
          expect(elementsWithDataHref.length).toBe(0);

          // Check any element with href (covers <a>, <area>, <link> etc.)
          const anyHref = $('[href*="11-family.html"]');
          expect(anyHref.length).toBe(0);
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });
});
