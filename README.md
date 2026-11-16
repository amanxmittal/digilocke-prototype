# DigiLocker Wallet — Core Blueprint Prototype (redesign2)

A curated, self-contained HTML/CSS/JS clickable prototype of the **core wallet flows**
that will drive the Kotlin Multiplatform (KMP) build. This is the blueprint layer: it
reuses the current production app's **locked API contracts and calling sequences**, and
the **Address-update feature is intentionally excluded**.

## How to view
Open `index.html` in a browser for the review board (all screens in device frames), or
open any file in `screens/` directly. Everything is static — no build step.

## Design system
- `assets/ds.css` and `assets/app.js` are the proven DigiLocker · UX4G design system
  (Noto Sans, DigiLocker indigo `#3E0DF5` + amber `#FF8F00`, Bootstrap-5 semantic tokens).
- Dark mode, text scaling (A-/A/A+), high-contrast, focus-visible, reduced-motion, and
  48dp touch targets are built in.

## Authentication flow
Splash → Onboarding → Sign in reuse the original `digilocker-redesign` designs. The
sign-in page offers a **returning-user** quick unlock, **Mobile**, **Aadhaar / VID**, and
**Saral Mode (सरल मोड)**. Signup is reached automatically when no account exists — the
user never explicitly picks "sign in" vs "sign up" (mirrors v2's single `LoginSignupActivity`).

- **Returning user** (profile already on device / found in DB): "Continue as …" → **Biometric** (if enabled — no MPIN) or **MPIN** (if biometric not enabled) → Dashboard.
- **Mobile flow:** enter number → account exists → **MPIN** → **OTP** → Dashboard. No account → **Signup**.
- **Aadhaar flow:** enter Aadhaar → **MPIN** → choose **Aadhaar OTP** or **Face authentication (Aadhaar FaceRD)** → Dashboard. No account → **Signup**. *(Face RD is offered as an alternative to OTP after MPIN.)*
- **VID flow:** enter VID → **OTP** → account exists → **MPIN** → Dashboard. No account → **Signup**.
- **Saral Mode:** voice-first, picture-led, bilingual Easy Mode (`E1`–`E7`).

Details grounded in v2:
- **Mobile:** SIM 1 / SIM 2 are shown by default (v2 reads active subscriptions); a
  **"Try with a different number"** action reveals manual entry. When the number has one or
  more accounts, a **profile-selection** screen (`67-select-profile`) lists them — a single
  number can hold multiple Aadhaar-verified and non-Aadhaar profiles (mirrors v2's
  `SelectLoginProfileActivity`). Picking a profile → **MPIN** → **OTP** → Home.
- **Aadhaar:** enter Aadhaar → **verify MPIN** → **choose verification** (`65-verify-method`):
  **Aadhaar OTP** (→ OTP screen) or **Face authentication** (→ UIDAI **Aadhaar FaceRD**
  Registered-Device app, which returns a signed PID; no raw image leaves the device).
  On success → Home.
- **Forgot MPIN** (`verifyDob` → OTP → `signupSetPin`): from the MPIN screen →
  **Verify DOB** (`63-forgot-dob`) → **OTP** → **Set new MPIN** (`64-set-mpin`) → Dashboard.
  The set-PIN screen enforces v2's rules (6 digits, not sequential, no 3+ identical in a
  row, no mirrored/repeated patterns) and offers biometric enable. An Aadhaar-OTP reset
  alternate is also linked. No API contract or sequence changed.

Screens `04-otp` and `05-mpin` chain via a `#next=` hash so the same screens serve every
ordering (Mobile/Aadhaar = MPIN→OTP, VID = OTP→MPIN).

## Screen map
The review board (`index.html`) lists **every flow separately, start to finish, in this
order** — sign-in, returning user, sign-up, forgot PIN, switch account, add-another-person,
notifications, dashboard, TOTP, then each feature area:

| # | Flow | Screens (start → end) |
|---|---|---|
| ① | Sign-in — Mobile | 01 splash · 02 onboarding · 03 sign-in · 60 mobile · 67 choose-profile · 05 MPIN · 04 OTP · 06 home |
| ① | Sign-in — Aadhaar (OTP) | 01 · 02 · 03 · 61 aadhaar · 65 choose-verify → OTP · 04 OTP · 05 MPIN · 06 home |
| ① | Sign-in — Aadhaar (Face/RD) | 01 · 02 · 03 · 61 aadhaar · 65 choose-verify → Face · 62 face-auth · 05 MPIN · 06 home |
| ① | Sign-in — VID | 01 · 02 · 03 · 61 VID · 04 OTP · 05 MPIN · 06 home |
| ② | Returning user — Biometric | 03 sign-in → 05 (auto fingerprint/face) → 06 home |
| ② | Returning user — MPIN | 03 sign-in → 05 (keypad entry) → 06 home | | 03 sign-in (“Continue as …”) · 05 MPIN (auto-biometric or keypad) · 06 home |
| ③ | Sign-up — Mobile | 01 · 02 · 03 · 60 mobile · 04 OTP · **68 link-Aadhaar (Skip)** → *Aadhaar entered:* 04 OTP · 64 MPIN · 06 home; *or Skip:* **52 details** (Name/DOB/Gender/Email) · 64 MPIN · 06 home |
| ③ | Sign-up — Aadhaar (OTP) | 01 · 02 · 03 · **69 signup-aadhaar** → OTP · 04 OTP · 64 MPIN (no details page) · **66 set-mobile (mandatory)** · 04 verify-mobile · 06 home |
| ③ | Sign-up — Aadhaar (Face/RD) | 01 · 02 · 03 · **69 signup-aadhaar** → Face · 62 face-auth · 64 MPIN (no details page) · **66 set-mobile (mandatory)** · 04 verify-mobile · 06 home |
| ③ | Sign-up — VID | 01 · 02 · 03 · **70 signup-vid** · 04 OTP · 64 MPIN (no details page) · **66 set-mobile (mandatory)** · 04 verify-mobile · 06 home |
| ④ | Forgot PIN | 05 MPIN (“Forgot?”) · 63 verify-DOB · 04 OTP · 64 set-new-MPIN · 06 home |
| ⑤ | Switch account (same number) | 21 account · **75 switch-account hub** · 78 add-profile-same-number → 04 OTP · 64 set-MPIN · 05 MPIN (no OTP) · 06 home |
| ⑥ | Add another person's account (existing users only) | 75 hub → **76** their Aadhaar/VID · 04 OTP (their mobile) · **77-mpin** their existing MPIN · 77-done · 06 home |
| ⑦ | Notifications | 06 home (bell) · 20 notifications |
| ⑧ | Post-login dashboard | 06 home (identity health, wallet, promo banner, ad slot, quick actions, services) |
| ⑨ | TOTP — DigiLocker Authenticator | 21 account · **79 authenticator** (60s rotating code) · 23 scan → **80 qr-login-approval** |
| ⑩ | Your document / wallet | 07 wallet · 08 document detail · 09 share · 10 show-ID · 11 fetch (discovery/browse) · 11b category detail · 11c browse by state · 11d confirm & fetch |
| ⑪ | Drive | 12 drive · 15 file · 14 upload |
| ⑫ | eSign | 30 esign |
| ⑬ | Nominee / Nominator | 17 nominee hub · 71 add-nominee · 72 view-nominee · 73 nominator-locker |
| ⑭ | Scan QR code | 23 scan · 80 qr-login-approval (web-login path) |
| ⑮ | Consent manager | 16 consent |
| ⑯ | Verifiable credential | 19 vc-wallet |
| ⑰ | Health locker | 18 health |
| ⑱ | Activity | 13 activity |
| ⑲ | Account | 21 account · 22 settings |
| ⑳ | Saral Mode | E1 welcome · E2 home · E3 show · E4 papers · E5 get · E6 talk · E7 help |

Rules implemented per the latest spec:
- **Sign-in Aadhaar** is bifurcated into an **OTP** journey and a **Face (RD)** journey. Order:
  enter Aadhaar → **choose verify** → OTP *or* Face → **MPIN** → Home.
- **Sign-up Mobile** keeps a **details page** (`52-signup`: Name/DOB/Gender/Email) since the user
  already gave a mobile number — no separate set-mobile step. A **Link Aadhaar** step
  (`68-link-aadhaar-signup`) offers **Skip**: entering Aadhaar + OTP skips the details page;
  tapping **Skip** goes to the manual details page instead.
- **Sign-up Aadhaar (OTP and Face are separate flows) / VID** use **dedicated entry screens**
  (`69-signup-aadhaar`, `70-signup-vid`), skip the details page entirely (name/DOB come from
  Aadhaar), and make **Set mobile mandatory — no Skip button** (`66-add-mobile`).

### Biometric unlock (grounded in v2's `EnterSecurityPinActivity` + `SetSecurityPinActivity`)
- **Enable:** whenever MPIN is entered/created (`05-mpin`, `64-set-mpin`), an **"Enable biometric
  unlock"** row is shown (mirrors `cvEnableBiometric`/`cbFingerprint`). Checking it persists a
  `dl-biometric-enabled` flag — analogous to v2 writing `PreferenceKeys.BIOMETRIC_LOGIN_ENABLED`
  after confirming the device's screen-lock credential.
- **Returning-user quick unlock** (`03-login` → "Continue as …"): if biometric is enabled,
  `05-mpin?ctx=returning` skips the keypad and **auto-prompts biometric** (mirrors v2's
  `checkDeviceLock()` firing automatically for the `loginProfile` flow when
  `biometricLoginEnabled == "true"`), with a "Use MPIN instead" fallback and **no Forgot-MPIN
  link** (matches v2 hiding `tvForgotPin` for `loginProfile`). If biometric is **not** enabled,
  it falls back to the keypad with the enable-checkbox.
- **In-flow MPIN** (mobile/Aadhaar/VID sign-in, Forgot-MPIN): always shows the keypad, the
  enable-checkbox (if not already enabled), and **Forgot MPIN?** — matching v2's `login` /
  `verifyIdentity` / `switchAccount` / `verifyOtp` paths, which always show `cvEnableBiometric`
  and `tvForgotPin`.
- **Settings → Biometric unlock** toggle reflects and updates the same persisted flag.

## Contract-fidelity notes (why these flows look the way they do)
These screens are shaped to fit the **existing** backend, not the other way around:
- **11 Get a document** shows the real issuer-pull sequence: raise request → poll status →
  receive → file into wallet (mirrors `requestIdForGettingDocument → pullRequest → list → pdf`).
- **03/04/05 Auth** keeps OTP and MPIN as distinct steps (maps to `login_verify_pin` and the
  OTP verify endpoints); token refresh is transparent (401 → refresh → retry).
- **09 Share / 10 Show-ID** default to minimal disclosure (Age-over-18, not DOB) and an
  offline device-signed token for Show-ID.
- **14 Upload** sends encrypted `path`+`name` (drive multipart contract).
- **16 Consent** reflects get/update/revoke consent APIs; **18 Health** reflects ABHA/ABDM.

### Nominee & Nominator (grounded in v2's `NomineeNewActivity` + related screens)
v2 has two distinct roles, and the hub shows a **second tab only when it applies to you**:
- **My Nominees** (`17-nominee`, tab 1) — people **you've** added who could access your locker.
  Capped at 5 (`(count/5)`); tapping a row opens read-only detail (`72-view-nominee`); the
  overflow menu offers **View** / **Remove nominee** (with confirm, mirrors
  `NomineeListActionCallBack.showActionDialog`). **Add a nominee** first checks you have a
  linked mobile — v2 blocks and prompts mobile verification otherwise
  (`BottomSheetForNonMobileUsers`).
- **Access as Nominee** (`17-nominee`, tab 2) — accounts where **someone else** added you as
  their nominee. This tab only renders if the `nominatorList` API returns at least one entry
  with `access_enabled = Y` (mirrors `NomineeNewActivity.getNominatorList` → `setUpBothTabs` vs
  `setUpOneTab`). Each row: **enabled** → opens the nominator's locker
  (`73-nominator-locker`, Issued Documents / Drive tabs, read-only, mirrors `NominatorActivity`
  + `FragmentNominatorIssued`/`FragmentNominatorDrive`); **not enabled** → an "Access not
  granted" alert (mirrors `NominatorRecyclerAdapter`'s locked-row dialog), never opens the locker.
- **Add nominee** (`71-add-nominee`) collects Name, DOB, **Gender** (Male/Female/Other),
  **Relationship** (options filtered by the selected gender, mirrors v2's `relationsMale` /
  `relationsFemale` / `relations` arrays), the nominee's Mobile, Aadhaar, and optional Email.
  Submitting sends an OTP to **your own** registered mobile (not the nominee's) — mirrors
  `sendOTPApi()` reading `PreferenceKeys.MOBILE_NO`. After OTP verify, the account is created
  server-side (`addNominee`) and you're returned to the hub.
- This is a fundamentally different feature from the earlier "Activation rule" (time-bound /
  inactivity-triggered access) shown in an older prototype iteration — that concept does not
  exist in v2 and has been removed in favor of the real nominee/nominator model above.

### Promotion banner & advertisement slot (grounded in v2's dashboard container model)
v2's home dashboard is server-driven: a `container.type` (`topBanner`, `servicesBanner`,
`knowMore`, …) carries `Items`/`Properties` objects with `value` (image), `action`/
`navigation` (click-through target) and `priority` (order) — see `TopBannerFragment`
(clickable image slider → login/profile) and `KnowMoreFragment` (a horizontal "promotions"
carousel). redesign2 adds two **permanent, reusable, server-driven** sections built the
same way:

- **Promotion banner** — a clickable horizontal carousel (`renderPromoBanner()` in
  `assets/app.js`). Each card carries a `cta: {type:'screen'|'url', target}` so tapping it
  navigates directly to the related screen or an external link, exactly like v2's banner
  click-through. Present on both **post-login Home** (`06-home`) and the new **pre-login /
  guest Home** (`74-prelogin-home`, see below).
- **Advertisement slot** — a single, clearly labelled "Advertisement" card
  (`renderAdSlot()`), separate from promotions so sponsored content is never confused with
  DigiLocker's own features (matches v2 keeping `servicesBanner`/`knowMore` separate from
  the ad-only `DynamicTopBannerFragment`). Present on both Home screens.
- **Both sections render nothing when the server has no content** — call
  `renderPromoBanner(id, [])` or `renderAdSlot(id, null)` and the wrapper `display:none`s
  itself with no leftover spacing, mirroring v2's `setUpOneTab()`-style graceful collapse
  when a dashboard container is empty.

### Pre-login / guest home (grounded in v2's guest state)
v2 has a real "browse before signing in" state (`SplashScreenViewModel.getGuestState()`,
`NonAadhaarUserHomeFragment`/`BrowseFragment`). Added **`74-prelogin-home`**: reachable from
Onboarding's **Skip**, shows the same promotion-banner component, a browsable issuer/service
preview, and a persistent **Sign in** action — every interactive item routes to sign-in since
no documents can be fetched without an account.

### Switch Account & Add Account — two distinct models, do not merge them

**Switch Account (same mobile number) — matches v2's `SwitchAccountActivity` exactly.**
v2 re-runs `loginSignupMobile` for the device's stored number (`PreferenceKeys.MOBILE_NO`) 
and lists only the profiles the **server** returns as linked to that number (`user_data[]`, 
Aadhaar-verified sorted first). Tapping a profile goes to `EnterSecurityPinActivity` with 
`from="switchAccount"` — **MPIN only, no OTP** (that mobile number's identity was already 
proven). Adding a new profile here uses v2's bottom-sheet pattern 
(`showCreateNewAccountBottomSheet`, "creates a new account under (‹number›)") → Aadhaar/VID 
entry → OTP (to the shared device number) → set MPIN. redesign2 implements this as:
- **`75-switch-account.html`** (top section, "Profiles on ‹number›") — lists number-linked
  profiles, active one marked, others switch via **`05-mpin.html?switchTo=…`** (MPIN only,
  no biometric-enable nudge, no Forgot-MPIN — matches v2 showing no extra prompts on this
  path).
- **`78-add-profile-samenumber.html`** — the bottom-sheet-equivalent screen → OTP → set MPIN
  → back to the hub with the new profile listed.

**Add Account (any other person, multi-user device sharing) — a deliberate extension
beyond v2.** v2 has no concept of adding a completely unrelated person's account to a
device; this is a **new capability** built for shared-device scenarios (e.g. a kiosk, a
family's shared tablet). It is intentionally **not** scoped to the device's mobile number,
and **only supports an existing DigiLocker user** — there is no "set a new MPIN" branch,
since that would mean creating an account, not adding one:
- **`76-add-account-identity.html`** — enter **that person's own** Aadhaar or VID.
- OTP is sent to **their** Aadhaar-linked mobile (never the device's stored number).
- **`77-add-account-mpin.html`** — **their existing MPIN** (they must already have a
  DigiLocker account with Aadhaar/VID linked and an MPIN set; there is no set-new-MPIN
  path here).
- **`77-add-account-done.html`** confirms the profile now appears under "Other people on
  this device" in the Switch Account hub's second section — visually and structurally
  separate from the number-linked profiles above it.

**Proving the switch is real:** selecting any profile (either section) writes
`dl-active-profile-name`/`dl-active-profile-init` to `localStorage` after MPIN success;
`06-home.html` reads it back and swaps the header name/avatar, so switching visibly changes
whose dashboard you're looking at in the clickable prototype.

**Entry point:** Account (`21-account.html`) → "Switch account" (new row under "Accounts on
this device").

### TOTP · DigiLocker Authenticator (grounded in v2's `AuthenticatorActivity` + QR-login)
v2 ships a built-in TOTP authenticator (`AuthenticatorActivity` + `TOTPGenerator`,
`AuthenticatorViewModel.getTOTPSecretKeyFromServer`): it fetches an AES-GCM-encrypted TOTP
secret once from `Urls.getTotpSecretKey`, decrypts it locally with the device key, then
generates a 6-digit code (`generateTOTP(secret, 6, otpInterval=60)`) that rotates every 60
seconds with a visible countdown, tap-to-copy, and an FAQ bottom sheet. Separately, scanning
a "sign in on web" QR (`QrScannerMLActivity` → `QrLoginApprovalActivity`) shows the
requesting website/device/time and an Allow/Deny action (`QrLoginApprovalViewModel`
encrypts a `{session_id}` payload and posts it to `approve_qr`). redesign2 implements both:
- **`79-authenticator.html`** — the rotating 6-digit code with a 60s progress ring
  (mirrors the TOTP interval + countdown timer), tap-to-copy, and an FAQ card explaining
  what the code is for. Reached from Account → "DigiLocker Authenticator".
- **`80-qr-login-approval.html`** — shows website/device/time and Allow/Deny, reached
  either from Authenticator's "Scan a Sign in on web QR" shortcut or directly from
  **`23-scan.html`**'s "Simulate Sign in on web scan" button (kept separate from the
  existing credential-verification scan action on that screen).

## Excluded
- **Address-update** (`address_*` endpoints) — removed per scope.

## Next step
This prototype is the input to the KMP implementation plan: each screen maps to a shared
`commonMain` repository/use-case call over the existing (locked) API contract, with new
capabilities (Sign-in-with-DigiLocker, verify-a-person, offline VC/ZK, autofill, family,
wallet-to-wallet, sync/push) layered on the new APIs from the API analysis.
