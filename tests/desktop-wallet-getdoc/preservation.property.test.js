/**
 * Preservation Property Tests (BEFORE fix implementation)
 *
 * Feature: desktop-wallet-and-getdoc-fix
 * Property 2: Preservation — Wallet Page Grid & Dashboard Non-Wallet & Category Navigation Unchanged
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 *
 * These tests capture existing CORRECT behavior on UNFIXED code.
 * They MUST PASS both before AND after the fix to confirm no regressions.
 *
 * Preservation areas:
 * - 07-wallet.html uses .cardgrid with uniform card sizing (no featured overrides)
 * - 06-home.html quick actions, services grid, and right sidebar are intact
 * - 11-fetch.html category tiles link to 11b-category.html
 * - 11-fetch.html "Browse by State" navigates to 11c-state.html
 * - Sidebar navigation links are intact across all affected pages
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const fc = require('fast-check');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

// Load HTML files
const walletHtml = fs.readFileSync(path.join(DESKTOP_DIR, '07-wallet.html'), 'utf-8');
const homeHtml = fs.readFileSync(path.join(DESKTOP_DIR, '06-home.html'), 'utf-8');
const fetchHtml = fs.readFileSync(path.join(DESKTOP_DIR, '11-fetch.html'), 'utf-8');
const categoryHtml = fs.readFileSync(path.join(DESKTOP_DIR, '11b-category.html'), 'utf-8');

// Parse into DOM
const $wallet = cheerio.load(walletHtml);
const $home = cheerio.load(homeHtml);
const $fetch = cheerio.load(fetchHtml);
const $category = cheerio.load(categoryHtml);

describe('Preservation: 07-wallet.html — Uniform Card Grid (Req 3.1)', () => {
  it('wallet container uses .cardgrid class (NOT .wallet-dash)', () => {
    const cardgrid = $wallet('.cardgrid');
    const walletDash = $wallet('.wallet-dash');

    expect(cardgrid.length).toBeGreaterThan(0);
    expect(walletDash.length).toBe(0);
  });

  it('all .cred cards on 07-wallet.html have NO grid-column override or .cred-featured class', () => {
    const credCards = $wallet('.cardgrid .cred');
    expect(credCards.length).toBeGreaterThan(0);

    // Property: For ALL .cred cards, none should have grid-column style or .cred-featured class
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: credCards.length - 1 }),
        (index) => {
          const card = $wallet(credCards[index]);
          const style = card.attr('style') || '';
          const hasFeaturedClass = card.hasClass('cred-featured');
          const hasGridColumn = style.includes('grid-column');

          expect(hasFeaturedClass).toBe(false);
          expect(hasGridColumn).toBe(false);
        }
      ),
      { numRuns: credCards.length * 3, verbose: true }
    );
  });
});

describe('Preservation: 06-home.html — Non-Wallet Sections (Req 3.2)', () => {
  it('dashboard contains quick actions (.qa) section', () => {
    const quickActions = $home('.qa');
    expect(quickActions.length).toBeGreaterThan(0);
  });

  it('dashboard contains services grid (.servgrid) section', () => {
    const servGrid = $home('.servgrid');
    expect(servGrid.length).toBeGreaterThan(0);
  });

  it('dashboard contains right sidebar with attention, requests, and activity cards', () => {
    // The right sidebar is an <aside> within the .two layout
    const aside = $home('.two aside');
    expect(aside.length).toBeGreaterThan(0);

    // Should contain multiple .card elements (attention, requests, activity)
    const cards = aside.find('.card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Preservation: 11-fetch.html — Category Navigation (Req 3.3, 3.4)', () => {
  it('category tiles are <a> tags linking to 11b-category.html', () => {
    // Category tiles are .serv elements inside the categories .servgrid
    const categoryTiles = $fetch('.servgrid .serv');
    expect(categoryTiles.length).toBeGreaterThan(0);

    // Property: For ALL category tiles, they are <a> tags with href="11b-category.html"
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: categoryTiles.length - 1 }),
        (index) => {
          const tile = $fetch(categoryTiles[index]);
          const tagName = tile.prop('tagName').toLowerCase();
          const href = tile.attr('href');

          expect(tagName).toBe('a');
          expect(href).toBe('11b-category.html');
        }
      ),
      { numRuns: categoryTiles.length * 3, verbose: true }
    );
  });

  it('"Browse by State" card on 11-fetch.html points to 11c-state.html', () => {
    // The Browse by State card has onclick="location='11c-state.html'"
    const browseByState = $fetch('.card[onclick*="11c-state.html"]');
    expect(browseByState.length).toBeGreaterThan(0);

    const onclick = browseByState.attr('onclick');
    expect(onclick).toContain('11c-state.html');
  });
});

describe('Preservation: Sidebar Navigation (Req 3.6)', () => {
  const expectedNavLinks = [
    { href: '06-home.html', text: 'Dashboard' },
    { href: '07-wallet.html', text: 'Wallet' },
    { href: '12-drive.html', text: 'Drive' },
    { href: '04-nominee.html', text: 'Nominee' },
    { href: '07-consent.html', text: 'Consent' },
    { href: '19-health.html', text: 'Health' },
    { href: '05-vc-wallet.html', text: 'Credentials' },
    { href: '12-activity.html', text: 'Activity' },
    { href: '13-account.html', text: 'Account' },
    { href: '15-settings.html', text: 'Settings' },
  ];

  it('sidebar nav links are intact on 06-home.html', () => {
    const navLinks = $home('.navi a');
    expect(navLinks.length).toBeGreaterThanOrEqual(expectedNavLinks.length);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedNavLinks.length - 1 }),
        (index) => {
          const expected = expectedNavLinks[index];
          const link = $home(`.navi a[href="${expected.href}"]`);
          expect(link.length).toBeGreaterThan(0);
          expect(link.text()).toContain(expected.text);
        }
      ),
      { numRuns: expectedNavLinks.length * 2, verbose: true }
    );
  });

  it('sidebar nav links are intact on 11-fetch.html', () => {
    const navLinks = $fetch('.navi a');
    expect(navLinks.length).toBeGreaterThanOrEqual(expectedNavLinks.length);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedNavLinks.length - 1 }),
        (index) => {
          const expected = expectedNavLinks[index];
          const link = $fetch(`.navi a[href="${expected.href}"]`);
          expect(link.length).toBeGreaterThan(0);
          expect(link.text()).toContain(expected.text);
        }
      ),
      { numRuns: expectedNavLinks.length * 2, verbose: true }
    );
  });

  it('sidebar nav links are intact on 11b-category.html', () => {
    const navLinks = $category('.navi a');
    expect(navLinks.length).toBeGreaterThanOrEqual(expectedNavLinks.length);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedNavLinks.length - 1 }),
        (index) => {
          const expected = expectedNavLinks[index];
          const link = $category(`.navi a[href="${expected.href}"]`);
          expect(link.length).toBeGreaterThan(0);
          expect(link.text()).toContain(expected.text);
        }
      ),
      { numRuns: expectedNavLinks.length * 2, verbose: true }
    );
  });
});
