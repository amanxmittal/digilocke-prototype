/**
 * Feature: desktop-navigation-enhancements, Property 2: Sidebar "Get Document" active state on fetch-flow pages
 *
 * For any page in the document fetching flow (11-fetch.html, 11b-category.html, 11c-state.html, 11d-confirm.html),
 * the "Get Document" sidebar link SHALL have the active class (`on`), and no other sidebar link in the "Main" group
 * SHALL have the active class.
 *
 * **Validates: Requirements 1.3**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

const FETCH_FLOW_PAGES = [
  '11-fetch.html',
  '11b-category.html',
  '11c-state.html',
  '11d-confirm.html',
];

// The "Main" group links in the sidebar (by their text content)
const MAIN_GROUP_LINKS = ['Dashboard', 'Wallet', 'Get Document', 'Drive', 'Nominee', 'Consent'];

describe('Feature: desktop-navigation-enhancements, Property 2: Sidebar "Get Document" active state on fetch-flow pages', () => {
  // **Validates: Requirements 1.3**

  it('on every fetch-flow page, "Get Document" link has the "on" class', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...FETCH_FLOW_PAGES),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          const nav = $('nav.navi');
          const getDocLink = nav.find('a').filter(function () {
            return $(this).text().trim() === 'Get Document';
          });

          expect(getDocLink.length).toBeGreaterThan(0);
          expect(getDocLink.hasClass('on')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('on every fetch-flow page, no other Main group link has the "on" class', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...FETCH_FLOW_PAGES),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          const nav = $('nav.navi');

          // Get all links in the Main group (links appearing before the second .grp divider)
          const allLinks = nav.find('a');
          const mainGroupLinks = [];

          allLinks.each(function () {
            const text = $(this).text().trim();
            if (MAIN_GROUP_LINKS.includes(text)) {
              mainGroupLinks.push($(this));
            }
          });

          // Verify no other Main group link (besides "Get Document") has the "on" class
          mainGroupLinks.forEach((link) => {
            const text = link.text().trim();
            if (text !== 'Get Document') {
              expect(link.hasClass('on')).toBe(false);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
