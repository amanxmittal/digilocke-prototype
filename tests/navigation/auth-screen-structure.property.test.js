/**
 * Property 2: Authentication screen structural consistency
 * Validates: Requirements 14.1, 14.2, 14.5, 14.6
 *
 * For any HTML file in the desktop authentication flow set, the page SHALL contain:
 * - A grid container with grid-template-columns: 1.1fr 1fr and min-height: 100vh
 * - A brand panel with the DigiLocker logo, name, headline, description, and two trust badges
 * - A right-panel action content container with width: min(420px, 90%)
 * - References to ../assets/ds.css, desktop.css, and ../assets/app.js
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

const AUTH_SCREENS = [
  '01-splash.html',
  '02-onboarding.html',
  '03-login.html',
  '04-otp.html',
  '05-mpin.html',
  '60-enter-mobile.html',
  '61-enter-aadhaar-vid.html',
  '63-forgot-dob.html',
  '64-set-mpin.html',
  '65-verify-method.html',
  '66-add-mobile.html',
  '67-select-profile.html',
  '68-link-aadhaar-signup.html',
  '69-signup-aadhaar.html',
  '70-signup-vid.html',
  '52-signup.html',
];

describe('Feature: desktop-navigation-flows, Property 2: Authentication screen structural consistency', () => {
  // **Validates: Requirements 14.1, 14.2, 14.5, 14.6**

  it('every auth screen has grid container with 1.1fr 1fr and min-height:100vh', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...AUTH_SCREENS),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');

          // Requirement 14.1: grid-template-columns: 1.1fr 1fr
          expect(html).toMatch(/grid-template-columns:\s*1\.1fr\s+1fr/);

          // Requirement 14.1: min-height: 100vh
          expect(html).toMatch(/min-height:\s*100vh/);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every auth screen has brand panel with logo, name, headline, description, and trust badges', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...AUTH_SCREENS),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');

          // Requirement 14.2: DigiLocker name
          expect(html).toContain('DigiLocker');

          // Requirement 14.2: Headline text (h1 tag present in brand panel)
          expect(html).toMatch(/<h1[^>]*>/);

          // Requirement 14.2: Description paragraph
          expect(html).toMatch(/<p[^>]*>.*<\/p>/s);

          // Requirement 14.2: Two trust badges
          expect(html).toContain('End-to-end encrypted');
          expect(html).toContain('Government of India');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every auth screen has right-panel with width:min(420px,90%)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...AUTH_SCREENS),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');

          // Requirement 14.5: right-panel width constraint
          expect(html).toMatch(/width:\s*min\(\s*420px\s*,\s*90%\s*\)/);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every auth screen references ../assets/ds.css, desktop.css, and ../assets/app.js', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...AUTH_SCREENS),
        (filename) => {
          const filePath = path.join(DESKTOP_DIR, filename);
          const html = fs.readFileSync(filePath, 'utf-8');

          // Requirement 14.6: shared asset references
          expect(html).toContain('../assets/ds.css');
          expect(html).toContain('desktop.css');
          expect(html).toContain('../assets/app.js');
        }
      ),
      { numRuns: 100 }
    );
  });
});
