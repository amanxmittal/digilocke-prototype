/**
 * Property-based test for "Back to Wallet" link on fetch-flow pages.
 *
 * Feature: desktop-navigation-enhancements, Property 3: Back to Wallet link on fetch-flow pages
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 *
 * For any page in the document fetching flow, a link containing a left-arrow icon
 * and the text "Back to Wallet" with href 07-wallet.html SHALL exist in the content
 * area before the page <h1> heading.
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

describe('Feature: desktop-navigation-enhancements, Property 3: Back to Wallet link on fetch-flow pages', () => {
  // **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

  it('every fetch-flow page has a .back-link with href "07-wallet.html"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...FETCH_FLOW_PAGES),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          const backLink = $('a.back-link[href="07-wallet.html"]');
          expect(backLink.length).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('the back-link contains a span with data-ic="back" (left-arrow icon)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...FETCH_FLOW_PAGES),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          const backLink = $('a.back-link[href="07-wallet.html"]');
          const icon = backLink.find('span[data-ic="back"]');
          expect(icon.length).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('the back-link text includes "Back to Wallet"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...FETCH_FLOW_PAGES),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          const backLink = $('a.back-link[href="07-wallet.html"]');
          const linkText = backLink.text();
          expect(linkText).toContain('Back to Wallet');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('the back-link is positioned before the <h1> in the DOM', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...FETCH_FLOW_PAGES),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          const content = $('.content');
          const backLink = content.find('a.back-link[href="07-wallet.html"]');
          const h1 = content.find('h1');

          expect(backLink.length).toBeGreaterThanOrEqual(1);
          expect(h1.length).toBeGreaterThanOrEqual(1);

          // Verify DOM position: back-link appears before h1
          // Get the indices of both elements within the content's children/descendants
          const allElements = content.find('*');
          const backLinkIndex = allElements.index(backLink.first());
          const h1Index = allElements.index(h1.first());

          expect(backLinkIndex).toBeLessThan(h1Index);
        }
      ),
      { numRuns: 100 }
    );
  });
});
