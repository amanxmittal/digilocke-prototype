/**
 * Feature: desktop-navigation-enhancements, Property 1: Sidebar "Get Document" item structure and position
 *
 * **Validates: Requirements 1.1, 1.2, 1.4**
 *
 * For any desktop page HTML file that contains a sidebar (.navi), the sidebar SHALL contain
 * a link with text "Get Document" pointing to 11-fetch.html, positioned in the DOM after
 * the "Wallet" link and before the "Drive" link.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

// Gather all HTML files in the desktop directory that contain a sidebar nav
const allHtmlFiles = fs.readdirSync(DESKTOP_DIR)
  .filter(f => f.endsWith('.html'));

const pagesWithSidebar = allHtmlFiles.filter(filename => {
  const html = fs.readFileSync(path.join(DESKTOP_DIR, filename), 'utf-8');
  return html.includes('class="navi"');
});

describe('Feature: desktop-navigation-enhancements, Property 1: Sidebar "Get Document" item structure and position', () => {
  // **Validates: Requirements 1.1, 1.2, 1.4**

  // Precondition: we have pages with sidebars to test
  it('should find desktop pages with a sidebar nav', () => {
    expect(pagesWithSidebar.length).toBeGreaterThan(0);
  });

  it('every page with a sidebar contains a "Get Document" link with href "11-fetch.html"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pagesWithSidebar),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          // Requirement 1.1: Sidebar SHALL display a "Get Document" navigation item
          const getDocLink = $('.navi a').filter(function () {
            return $(this).text().trim().includes('Get Document');
          });
          expect(getDocLink.length).toBeGreaterThanOrEqual(1);

          // Requirement 1.2: Link SHALL navigate to 11-fetch.html
          const href = getDocLink.first().attr('href');
          expect(href).toBe('11-fetch.html');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('"Get Document" is positioned after "Wallet" and before "Drive" in sidebar DOM order', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...pagesWithSidebar),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(html);

          const navLinks = $('.navi a');
          let walletIndex = -1;
          let getDocIndex = -1;
          let driveIndex = -1;

          navLinks.each(function (i) {
            const text = $(this).text().trim();
            if (text.includes('Wallet')) walletIndex = i;
            if (text.includes('Get Document')) getDocIndex = i;
            if (text.includes('Drive')) driveIndex = i;
          });

          // Requirement 1.4: positioned after Wallet and before Drive
          expect(walletIndex).toBeGreaterThanOrEqual(0);
          expect(getDocIndex).toBeGreaterThanOrEqual(0);
          expect(driveIndex).toBeGreaterThanOrEqual(0);
          expect(getDocIndex).toBeGreaterThan(walletIndex);
          expect(getDocIndex).toBeLessThan(driveIndex);
        }
      ),
      { numRuns: 100 }
    );
  });
});
