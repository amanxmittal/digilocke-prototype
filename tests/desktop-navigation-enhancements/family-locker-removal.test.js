/**
 * Unit tests: Family Locker removal and redirect
 *
 * **Validates: Requirements 3.1, 3.4**
 *
 * - 3.1: Account page excludes Family Locker service card from "Linked services" grid
 * - 3.4: Direct navigation to 11-family.html redirects to Account page
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

describe('Family Locker removal and redirect', () => {
  describe('Requirement 3.1: Account page excludes Family Locker service card', () => {
    let $;

    beforeAll(() => {
      const html = fs.readFileSync(path.join(DESKTOP_DIR, '13-account.html'), 'utf-8');
      $ = cheerio.load(html);
    });

    it('should not have any .serv card linking to 11-family.html', () => {
      const familyCards = $('a.serv[href="11-family.html"]');
      expect(familyCards.length).toBe(0);
    });

    it('should not have any anchor element with href to 11-family.html', () => {
      const familyLinks = $('a[href="11-family.html"]');
      expect(familyLinks.length).toBe(0);
    });

    it('should still contain other .serv cards in the linked services grid', () => {
      const servCards = $('a.serv');
      expect(servCards.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement 3.4: 11-family.html redirects to Account page', () => {
    let html;
    let $;

    beforeAll(() => {
      html = fs.readFileSync(path.join(DESKTOP_DIR, '11-family.html'), 'utf-8');
      $ = cheerio.load(html);
    });

    it('should contain a meta refresh redirect to 13-account.html', () => {
      const metaRefresh = $('meta[http-equiv="refresh"]');
      expect(metaRefresh.length).toBe(1);
      const content = metaRefresh.attr('content');
      expect(content).toMatch(/0;url=13-account\.html/);
    });

    it('should contain a JavaScript redirect to 13-account.html', () => {
      expect(html).toMatch(/location\.replace\(['"]13-account\.html['"]\)/);
    });

    it('should contain at least one redirect mechanism to 13-account.html', () => {
      const hasMetaRedirect = $('meta[http-equiv="refresh"][content*="13-account.html"]').length > 0;
      const hasJsRedirect = /location\.replace\(['"]13-account\.html['"]\)/.test(html);
      expect(hasMetaRedirect || hasJsRedirect).toBe(true);
    });
  });
});
