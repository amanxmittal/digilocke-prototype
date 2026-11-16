/**
 * Unit tests for avatar dropdown structure
 *
 * **Validates: Requirements 4.3, 4.4, 4.7**
 *
 * Parses a representative desktop page (07-wallet.html) and verifies:
 * - Dropdown contains "Logout" as the last menu item
 * - "Logout" item links to the login page (01-login.html)
 * - Dropdown contains user name element with text content
 * - Dropdown contains email element with text content
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');
const REPRESENTATIVE_PAGE = path.join(DESKTOP_DIR, '07-wallet.html');

describe('Avatar dropdown structure (Requirements 4.3, 4.4, 4.7)', () => {
  let $;

  beforeAll(() => {
    const html = fs.readFileSync(REPRESENTATIVE_PAGE, 'utf-8');
    $ = cheerio.load(html);
  });

  describe('Logout menu item (Requirement 4.3, 4.4)', () => {
    it('dropdown contains a "Logout" menu item', () => {
      const logoutItem = $('.avatar-dropdown a[role="menuitem"]').filter(function () {
        return $(this).text().trim().includes('Logout');
      });
      expect(logoutItem.length).toBe(1);
    });

    it('"Logout" is the last menu item in the dropdown', () => {
      const menuItems = $('.avatar-dropdown a[role="menuitem"]');
      const lastItem = menuItems.last();
      expect(lastItem.text().trim()).toContain('Logout');
    });

    it('"Logout" links to the login page (01-login.html)', () => {
      const logoutItem = $('.avatar-dropdown a[role="menuitem"]').filter(function () {
        return $(this).text().trim().includes('Logout');
      });
      expect(logoutItem.attr('href')).toBe('01-login.html');
    });
  });

  describe('User name and email elements (Requirement 4.7)', () => {
    it('dropdown contains a user name element with text content', () => {
      const nameEl = $('.avatar-dropdown__name');
      expect(nameEl.length).toBe(1);
      expect(nameEl.text().trim().length).toBeGreaterThan(0);
    });

    it('dropdown contains an email element with text content', () => {
      const emailEl = $('.avatar-dropdown__email');
      expect(emailEl.length).toBe(1);
      expect(emailEl.text().trim().length).toBeGreaterThan(0);
    });

    it('user name element is inside the dropdown header', () => {
      const nameEl = $('.avatar-dropdown__header .avatar-dropdown__name');
      expect(nameEl.length).toBe(1);
    });

    it('email element is inside the dropdown header', () => {
      const emailEl = $('.avatar-dropdown__header .avatar-dropdown__email');
      expect(emailEl.length).toBe(1);
    });
  });
});
