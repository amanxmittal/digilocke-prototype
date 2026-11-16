/**
 * Bug Condition Exploration Property Test
 *
 * Feature: desktop-wallet-and-getdoc-fix
 * Property 1: Bug Condition — Dashboard Wallet Uniform Grid & Missing Document Navigation
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 *
 * This test encodes the EXPECTED (fixed) behavior. It MUST FAIL on unfixed code,
 * confirming that the bugs exist. Once the fix is applied, this test should PASS.
 *
 * Bug A: Dashboard wallet section should use .wallet-dash (not .cardgrid),
 *         Aadhaar card should be full-width featured, PAN & DL side-by-side.
 * Bug B: Document .lrow items should be <a> tags with href="11d-confirm.html".
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const fc = require('fast-check');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

// Load HTML files
const homeHtml = fs.readFileSync(path.join(DESKTOP_DIR, '06-home.html'), 'utf-8');
const categoryHtml = fs.readFileSync(path.join(DESKTOP_DIR, '11b-category.html'), 'utf-8');
const fetchHtml = fs.readFileSync(path.join(DESKTOP_DIR, '11-fetch.html'), 'utf-8');

// Parse into DOM
const $home = cheerio.load(homeHtml);
const $category = cheerio.load(categoryHtml);
const $fetch = cheerio.load(fetchHtml);

describe('Bug Condition A — Dashboard Wallet Featured Layout (06-home.html)', () => {
  it('wallet section should use .wallet-dash class instead of .cardgrid', () => {
    // Find the "Your wallet" section heading and its sibling grid container
    const walletHeading = $home('h2.h2:contains("Your wallet")');
    expect(walletHeading.length).toBeGreaterThan(0);

    // .wallet-dash is a sibling of the heading's parent .between div, not a descendant
    const headingParent = walletHeading.closest('.between');
    const walletSection = headingParent.nextAll('.wallet-dash');
    const cardgridSection = headingParent.nextAll('.cardgrid');

    // Expected: wallet-dash exists, cardgrid does NOT exist after wallet heading
    expect(walletSection.length).toBeGreaterThan(0);
    expect(cardgridSection.length).toBe(0);
  });

  it('Aadhaar .cred card should have grid-column: 1 / -1 or .cred-featured class', () => {
    // Find the Aadhaar card (first .cred with sk-aadhaar class or containing "Aadhaar" text)
    const aadhaarCard = $home('.cred.sk-aadhaar');
    expect(aadhaarCard.length).toBeGreaterThan(0);

    // It should have a .cred-featured class OR inline style with grid-column: 1 / -1
    const hasFeaturedClass = aadhaarCard.hasClass('cred-featured');
    const inlineStyle = aadhaarCard.attr('style') || '';
    const hasGridColumnSpan = inlineStyle.includes('grid-column') && inlineStyle.includes('1 / -1');

    expect(hasFeaturedClass || hasGridColumnSpan).toBe(true);
  });

  it('PAN and DL cards should be consecutive siblings (share a row in 2-col grid)', () => {
    // Find PAN and DL cards
    const panCard = $home('.cred.sk-pan');
    const dlCard = $home('.cred.sk-dl');

    expect(panCard.length).toBeGreaterThan(0);
    expect(dlCard.length).toBeGreaterThan(0);

    // They should be consecutive siblings (PAN immediately followed by DL)
    const panNext = panCard.next();
    expect(panNext.hasClass('sk-dl')).toBe(true);

    // Neither PAN nor DL should have a full-width span (no cred-featured, no grid-column: 1 / -1)
    const panHasFeatured = panCard.hasClass('cred-featured');
    const dlHasFeatured = dlCard.hasClass('cred-featured');
    const panStyle = panCard.attr('style') || '';
    const dlStyle = dlCard.attr('style') || '';

    expect(panHasFeatured).toBe(false);
    expect(dlHasFeatured).toBe(false);
    expect(panStyle.includes('grid-column')).toBe(false);
    expect(dlStyle.includes('grid-column')).toBe(false);
  });
});

describe('Bug Condition B — Document Item Navigation (11b-category.html)', () => {
  it('all .lrow document items should be <a> tags with href="11d-confirm.html"', () => {
    // Get all .lrow elements inside the .card container
    const lrows = $category('.card .lrow');
    expect(lrows.length).toBeGreaterThan(0);

    // Property: For ALL .lrow elements, assert they are <a> tags with correct href
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: lrows.length - 1 }),
        (index) => {
          const el = $category(lrows[index]);
          const tagName = el.prop('tagName').toLowerCase();
          const href = el.attr('href');

          // Each .lrow must be an <a> tag
          expect(tagName).toBe('a');
          // Each .lrow must link to 11d-confirm.html
          expect(href).toBe('11d-confirm.html');
        }
      ),
      { numRuns: 20, verbose: true }
    );
  });
});

describe('Bug Condition B — Document Item Navigation (11-fetch.html)', () => {
  it('all trending/popular .lrow items should be <a> tags with href="11d-confirm.html"', () => {
    // The trending and popular sections are inside .two > div > .card
    // Get the .two section which contains trending and popular
    const twoSection = $fetch('.two');
    expect(twoSection.length).toBeGreaterThan(0);

    // Get all .lrow elements within the .two section (trending + popular)
    const lrows = twoSection.find('.lrow');
    expect(lrows.length).toBeGreaterThan(0);

    // Property: For ALL trending/popular .lrow elements, assert they are <a> tags
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: lrows.length - 1 }),
        (index) => {
          const el = $fetch(lrows[index]);
          const tagName = el.prop('tagName').toLowerCase();
          const href = el.attr('href');

          // Each .lrow must be an <a> tag
          expect(tagName).toBe('a');
          // Each .lrow must link to 11d-confirm.html
          expect(href).toBe('11d-confirm.html');
        }
      ),
      { numRuns: 30, verbose: true }
    );
  });
});
