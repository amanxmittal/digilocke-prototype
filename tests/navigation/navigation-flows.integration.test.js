/**
 * Integration tests for all desktop navigation flows.
 * Validates: Requirements 1.7, 2.7, 3.7, 4.6, 5.7, 6.6, 7.6, 8.7, 9.6, 10.7, 11.8, 12.7, 13.10
 *
 * These tests read actual HTML files and verify href attributes and hash parameters
 * form correct navigation flow chains as specified in the design document.
 */

const fs = require('fs');
const path = require('path');

const DESKTOP_DIR = path.resolve(__dirname, '../../desktop');

/**
 * Helper: read an HTML file from the desktop directory
 */
function readScreen(filename) {
  const filePath = path.join(DESKTOP_DIR, filename);
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Helper: extract all href values from HTML content
 */
function extractHrefs(html) {
  const matches = [];
  const regex = /href="([^"]+)"/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

/**
 * Helper: check if HTML contains a specific href value
 */
function containsHref(html, href) {
  return html.includes(`href="${href}"`);
}

/**
 * Helper: check if HTML contains an onclick navigation to a target
 */
function containsOnclickNav(html, target) {
  return html.includes(`location='${target}'`) || html.includes(`location="${target}"`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Flow 1: Splash → Onboarding → Login
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 1: Splash & Onboarding', () => {
  let splashHtml, onboardingHtml;

  beforeAll(() => {
    splashHtml = readScreen('01-splash.html');
    onboardingHtml = readScreen('02-onboarding.html');
  });

  test('01-splash "Get started" links to 02-onboarding.html', () => {
    expect(containsHref(splashHtml, '02-onboarding.html')).toBe(true);
  });

  test('01-splash "Sign in here" links to 03-login.html', () => {
    expect(containsHref(splashHtml, '03-login.html')).toBe(true);
  });

  test('02-onboarding "Continue" links to 03-login.html', () => {
    expect(containsHref(onboardingHtml, '03-login.html')).toBe(true);
  });

  test('02-onboarding "Skip" links to 03-login.html', () => {
    const skipLinks = onboardingHtml.match(/href="03-login.html"/g);
    // Should have at least 2 references (Continue + Skip)
    expect(skipLinks.length).toBeGreaterThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flow 2: Mobile Sign-In complete chain
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 2: Mobile Sign-In', () => {
  let loginHtml, enterMobileHtml, selectProfileHtml, mpinHtml, otpHtml;

  beforeAll(() => {
    loginHtml = readScreen('03-login.html');
    enterMobileHtml = readScreen('60-enter-mobile.html');
    selectProfileHtml = readScreen('67-select-profile.html');
    mpinHtml = readScreen('05-mpin.html');
    otpHtml = readScreen('04-otp.html');
  });

  test('03-login links to 60-enter-mobile.html (Mobile number option)', () => {
    expect(containsHref(loginHtml, '60-enter-mobile.html')).toBe(true);
  });

  test('60-enter-mobile links to 67-select-profile.html (existing profile)', () => {
    expect(containsHref(enterMobileHtml, '67-select-profile.html')).toBe(true);
  });

  test('67-select-profile links to 05-mpin.html#next=04-otp.html', () => {
    expect(containsHref(selectProfileHtml, '05-mpin.html#next=04-otp.html')).toBe(true);
  });

  test('05-mpin has nextTarget() resolver that defaults to 06-home.html', () => {
    expect(mpinHtml).toContain('nextTarget()');
    expect(mpinHtml).toContain("'06-home.html'");
  });

  test('04-otp has nextTarget() resolver that defaults to 06-home.html', () => {
    expect(otpHtml).toContain('nextTarget()');
    expect(otpHtml).toContain("'06-home.html'");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flow 3: Aadhaar Sign-In complete chain
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 3: Aadhaar Sign-In', () => {
  let loginHtml, aadhaarVidHtml, verifyMethodHtml;

  beforeAll(() => {
    loginHtml = readScreen('03-login.html');
    aadhaarVidHtml = readScreen('61-enter-aadhaar-vid.html');
    verifyMethodHtml = readScreen('65-verify-method.html');
  });

  test('03-login links to 61-enter-aadhaar-vid.html (Aadhaar/VID option)', () => {
    expect(containsHref(loginHtml, '61-enter-aadhaar-vid.html')).toBe(true);
  });

  test('61-enter-aadhaar-vid navigates to 65-verify-method.html when Aadhaar mode', () => {
    expect(aadhaarVidHtml).toContain("window.location='65-verify-method.html'");
  });

  test('65-verify-method links to 04-otp.html#next=05-mpin.html', () => {
    expect(containsHref(verifyMethodHtml, '04-otp.html#next=05-mpin.html')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flow 4: VID Sign-In complete chain
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 4: VID Sign-In', () => {
  let aadhaarVidHtml;

  beforeAll(() => {
    aadhaarVidHtml = readScreen('61-enter-aadhaar-vid.html');
  });

  test('61-enter-aadhaar-vid navigates to 04-otp.html#next=05-mpin.html when VID mode', () => {
    expect(aadhaarVidHtml).toContain("window.location='04-otp.html#next=05-mpin.html'");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flow 5: Returning User MPIN flow
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 5: Returning User MPIN', () => {
  let loginHtml, mpinHtml;

  beforeAll(() => {
    loginHtml = readScreen('03-login.html');
    mpinHtml = readScreen('05-mpin.html');
  });

  test('03-login "Continue as" card links to 05-mpin.html', () => {
    expect(containsHref(loginHtml, '05-mpin.html')).toBe(true);
  });

  test('05-mpin defaults to 06-home.html when no hash is present', () => {
    // The nextTarget function defaults to 06-home.html
    expect(mpinHtml).toContain("'06-home.html'");
  });

  test('05-mpin has "Forgot MPIN?" link to 63-forgot-dob.html', () => {
    expect(containsHref(mpinHtml, '63-forgot-dob.html')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flows 6-7: Mobile Signup (Aadhaar path and Skip path)
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 6: Mobile Signup – Aadhaar Path', () => {
  let enterMobileHtml, linkAadhaarHtml, setMpinHtml;

  beforeAll(() => {
    enterMobileHtml = readScreen('60-enter-mobile.html');
    linkAadhaarHtml = readScreen('68-link-aadhaar-signup.html');
    setMpinHtml = readScreen('64-set-mpin.html');
  });

  test('60-enter-mobile links to 04-otp.html#next=68-link-aadhaar-signup.html (new user)', () => {
    expect(containsHref(enterMobileHtml, '04-otp.html#next=68-link-aadhaar-signup.html')).toBe(true);
  });

  test('68-link-aadhaar "Link & Continue" links to 04-otp.html#next=64-set-mpin.html', () => {
    expect(containsHref(linkAadhaarHtml, '04-otp.html#next=64-set-mpin.html')).toBe(true);
  });

  test('64-set-mpin has nextTarget() resolver defaulting to 06-home.html', () => {
    expect(setMpinHtml).toContain('nextTarget()');
    expect(setMpinHtml).toContain("'06-home.html'");
  });
});

describe('Flow 7: Mobile Signup – Skip Aadhaar Path', () => {
  let linkAadhaarHtml, signupHtml;

  beforeAll(() => {
    linkAadhaarHtml = readScreen('68-link-aadhaar-signup.html');
    signupHtml = readScreen('52-signup.html');
  });

  test('68-link-aadhaar "Skip for now" links to 52-signup.html', () => {
    expect(containsHref(linkAadhaarHtml, '52-signup.html')).toBe(true);
  });

  test('52-signup "Continue" links to 64-set-mpin.html', () => {
    expect(containsHref(signupHtml, '64-set-mpin.html')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flows 8-9: Aadhaar/VID Signup with nested hash chaining
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 8: Aadhaar Signup with nested hash chaining', () => {
  let signupAadhaarHtml, addMobileHtml;

  beforeAll(() => {
    signupAadhaarHtml = readScreen('69-signup-aadhaar.html');
    addMobileHtml = readScreen('66-add-mobile.html');
  });

  test('69-signup-aadhaar links to 04-otp.html#next=64-set-mpin.html%23next=66-add-mobile.html', () => {
    expect(containsHref(signupAadhaarHtml, '04-otp.html#next=64-set-mpin.html%23next=66-add-mobile.html')).toBe(true);
  });

  test('66-add-mobile "Send OTP" links to 04-otp.html#next=06-home.html', () => {
    expect(containsHref(addMobileHtml, '04-otp.html#next=06-home.html')).toBe(true);
  });
});

describe('Flow 9: VID Signup with nested hash chaining', () => {
  let signupVidHtml;

  beforeAll(() => {
    signupVidHtml = readScreen('70-signup-vid.html');
  });

  test('70-signup-vid links to 04-otp.html#next=64-set-mpin.html%23next=66-add-mobile.html', () => {
    expect(containsHref(signupVidHtml, '04-otp.html#next=64-set-mpin.html%23next=66-add-mobile.html')).toBe(true);
  });

  test('70-signup-vid back link navigates to 03-login.html', () => {
    expect(containsHref(signupVidHtml, '03-login.html')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flow 10: Forgot PIN flow
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 10: Forgot PIN', () => {
  let mpinHtml, forgotDobHtml;

  beforeAll(() => {
    mpinHtml = readScreen('05-mpin.html');
    forgotDobHtml = readScreen('63-forgot-dob.html');
  });

  test('05-mpin "Forgot MPIN?" links to 63-forgot-dob.html', () => {
    expect(containsHref(mpinHtml, '63-forgot-dob.html')).toBe(true);
  });

  test('63-forgot-dob "Continue" links to 04-otp.html#next=64-set-mpin.html', () => {
    expect(containsHref(forgotDobHtml, '04-otp.html#next=64-set-mpin.html')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flows 11-12: Switch Account and Add Account flows
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 11: Switch Account', () => {
  let switchAccountHtml;

  beforeAll(() => {
    switchAccountHtml = readScreen('75-switch-account.html');
  });

  test('75-switch-account non-active profile links to 05-mpin.html#next=06-home.html', () => {
    expect(containsHref(switchAccountHtml, '05-mpin.html#next=06-home.html')).toBe(true);
  });

  test('75-switch-account has "Add a profile on this number" navigating to 78-add-profile-samenumber.html', () => {
    expect(containsOnclickNav(switchAccountHtml, '78-add-profile-samenumber.html')).toBe(true);
  });

  test('75-switch-account has "Add another person\'s account" navigating to 76-add-account-identity.html', () => {
    expect(containsOnclickNav(switchAccountHtml, '76-add-account-identity.html')).toBe(true);
  });
});

describe('Flow 12: Add Account', () => {
  let addAccountHtml, addAccountMpinHtml, addAccountDoneHtml;

  beforeAll(() => {
    addAccountHtml = readScreen('76-add-account-identity.html');
    addAccountMpinHtml = readScreen('77-add-account-mpin.html');
    addAccountDoneHtml = readScreen('77-add-account-done.html');
  });

  test('76-add-account-identity "Send OTP" links to 04-otp.html#next=77-add-account-mpin.html', () => {
    expect(containsHref(addAccountHtml, '04-otp.html#next=77-add-account-mpin.html')).toBe(true);
  });

  test('77-add-account-mpin "Confirm" links to 77-add-account-done.html', () => {
    expect(containsHref(addAccountMpinHtml, '77-add-account-done.html')).toBe(true);
  });

  test('77-add-account-done "Back to Switch account" links to 75-switch-account.html', () => {
    expect(containsHref(addAccountDoneHtml, '75-switch-account.html')).toBe(true);
  });

  test('77-add-account-done "Stay on my account" links to 06-home.html', () => {
    expect(containsHref(addAccountDoneHtml, '06-home.html')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flow 13: Notifications flow
// ─────────────────────────────────────────────────────────────────────────────
describe('Flow 13: Notifications', () => {
  let homeHtml;

  beforeAll(() => {
    homeHtml = readScreen('06-home.html');
  });

  test('06-home bell icon links to 14-notifications.html', () => {
    expect(containsHref(homeHtml, '14-notifications.html')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Desktop Exclusions
// ─────────────────────────────────────────────────────────────────────────────
describe('Desktop Exclusions', () => {
  let verifyMethodHtml, enterMobileHtml, mpinHtml, signupAadhaarHtml;

  beforeAll(() => {
    verifyMethodHtml = readScreen('65-verify-method.html');
    enterMobileHtml = readScreen('60-enter-mobile.html');
    mpinHtml = readScreen('05-mpin.html');
    signupAadhaarHtml = readScreen('69-signup-aadhaar.html');
  });

  test('65-verify-method does NOT contain Face authentication option', () => {
    const lowerHtml = verifyMethodHtml.toLowerCase();
    expect(lowerHtml).not.toContain('face auth');
    expect(lowerHtml).not.toContain('face recognition');
    // Should not have a face verification card/link
    expect(lowerHtml).not.toMatch(/href="[^"]*face[^"]*"/);
  });

  test('60-enter-mobile does NOT contain SIM selection UI', () => {
    const lowerHtml = enterMobileHtml.toLowerCase();
    expect(lowerHtml).not.toContain('select sim');
    expect(lowerHtml).not.toContain('sim card');
    expect(lowerHtml).not.toContain('sim selection');
    expect(lowerHtml).not.toContain('choose sim');
  });

  test('05-mpin does NOT contain biometric/face login option', () => {
    const lowerHtml = mpinHtml.toLowerCase();
    expect(lowerHtml).not.toContain('face id');
    expect(lowerHtml).not.toContain('fingerprint');
    expect(lowerHtml).not.toContain('biometric');
    // Should not have a face auth link
    expect(lowerHtml).not.toMatch(/href="[^"]*face[^"]*"/);
  });

  test('69-signup-aadhaar does NOT contain Face authentication option', () => {
    const lowerHtml = signupAadhaarHtml.toLowerCase();
    expect(lowerHtml).not.toContain('face auth');
    expect(lowerHtml).not.toContain('face recognition');
    expect(lowerHtml).not.toMatch(/href="[^"]*face[^"]*"/);
  });
});
