# DigiLocker Screen Analysis — Part 2 (MPIN, Home)

## Screen 4: MPIN (05-mpin.html)

### Purpose & User Context
Authentication screen with two modes: biometric-first (fingerprint/face) or MPIN keypad entry. Used for both returning user unlock and account switching.

### Component Hierarchy
```
MpinScreen
├── StatusBar
├── Column(centered, padding-top 64dp)
│   ├── [BiometricView] (conditional)
│   │   ├── BiometricHero (112dp circle, pulsing animation)
│   │   │   └── Fingerprint icon (large)
│   │   ├── Text("Unlock DigiLocker") — h1
│   │   ├── Text("Use your fingerprint or face...") — body, ink2
│   │   └── TextLink("Use MPIN instead")
│   │
│   ├── [PinView] (conditional)
│   │   ├── AvatarBox (64dp, rounded 20dp, lock icon or initials)
│   │   ├── Text("Enter your MPIN") — h1
│   │   ├── Text("6-digit PIN keeps your wallet locked.") — body, ink2
│   │   ├── PinDots (6 dots, filled state)
│   │   ├── NumericKeypad (3x4 grid)
│   │   ├── BiometricEnableRow (toggle switch)
│   │   │   ├── Fingerprint icon
│   │   │   ├── Text("Enable biometric login for next time")
│   │   │   └── Switch toggle
│   │   └── TextLink("Forgot MPIN?")
```

### Layout Structure
```kotlin
Scaffold {
    Column(
        modifier = Modifier.fillMaxSize().padding(top = 64.dp),
        horizontalAlignment = CenterHorizontally
    ) {
        // Conditional: BiometricView OR PinView
        AnimatedVisibility(showBiometric) {
            BiometricView(...)
        }
        AnimatedVisibility(showPin) {
            Column(horizontalAlignment = CenterHorizontally) {
                // Avatar
                // Heading
                // Subtitle
                // Pin dots row (justify center, gap 14dp)
                // Keypad (LazyVerticalGrid 3 columns, max-width 280dp)
                // Enable biometric row
                // Forgot link
            }
        }
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Biometric hero circle | onClick | Triggers biometric scan animation |
| "Use MPIN instead" link | onClick | Shows keypad view, hides bio view |
| Keypad buttons 0-9 | onClick | Fills pin dots |
| Keypad backspace | onClick | Removes last dot |
| Enable biometric switch | toggle | Sets localStorage flag |
| "Forgot MPIN?" link | onClick | `63-forgot-dob.html` |
| PIN completion (6 digits) | auto-trigger | Navigates to `next` param (default `06-home.html`) |

### Visual Design Details
- **Biometric hero**: 112dp circle, background `--dl-primary-50`, color `--dl-primary`, pulsing animation (box-shadow expand/fade)
- **Pin avatar**: 64dp, borderRadius 20dp, background `--dl-primary-50`, color `--dl-primary` (or gradient + white for switch-account)
- **Pin dots**: 16dp circles, 2px border primary, filled with primary when active, gap 14dp
- **Keypad**: 3-column grid, gap 12dp, buttons 56dp height, borderRadius 16dp, white bg, border, shadow e1, font 21sp weight 700
- **Enable bio row**: flex row, background `--surface`, border 1.5px `--hair`, borderRadius 14dp, padding 13px 14dp, shadow e1
- **Switch**: 48x28dp, borderRadius pill, off=`--g300`, on=`--dl-primary`, thumb 22dp circle

### State Variations
1. **Biometric-first** (returning user + biometric enabled): Shows biometric view, auto-triggers scan
2. **MPIN keypad** (returning user + no biometric): Shows keypad, hides "Forgot MPIN?"
3. **Normal MPIN** (in-flow from mobile/Aadhaar): Shows keypad + enable bio row + "Forgot MPIN?"
4. **Switch account**: Personalized heading with name, avatar shows initials with gradient, hides enable bio row and forgot link
5. **Pin filling states**: 0-6 dots filled progressively
6. **Biometric scanning**: Hero circle pulses with animation

### Icons & Images
- `fp` (fingerprint) — biometric hero, enable bio row
- `lock` — pin avatar (default)
- `back` — keypad delete button

### Bottom Sheets / Dialogs / Overlays
- None

### Accessibility
- Delete button: `aria-label="Delete"`
- Toast notifications for biometric confirmation

### Key Logic (for ViewModel)
- URL params: `ctx=returning`, `switchTo=Name`, `init=XX`, `#next=target.html`
- localStorage: `dl-biometric-enabled`, `dl-active-profile-name`, `dl-active-profile-init`
- Auto-navigation on 6th digit entry (380ms delay)
- Biometric scan animation: 1200ms then navigate

---

## Screen 5: Home (06-home.html)

### Purpose & User Context
Main dashboard after authentication. Shows identity health score, wallet preview, quick actions, services grid, promotional carousels, and bottom navigation. The primary hub for all app features.

### Component Hierarchy
```
HomeScreen
├── StatusBar
├── Scaffold
│   ├── Content (scrollable)
│   │   ├── HeaderRow
│   │   │   ├── Row
│   │   │   │   ├── Avatar(initials, 46dp, gradient, rounded 14dp)
│   │   │   │   └── Column("Namaste 🙏" muted + name h3)
│   │   │   └── Row(gap=8dp)
│   │   │       ├── IconButton(globe/language)
│   │   │       ├── IconButton(scan)
│   │   │       └── IconButton(bell + red dot badge)
│   │   │
│   │   ├── IdentityHealthCard (gradient card)
│   │   │   ├── Row("IDENTITY HEALTH" cap + "Strong" badge)
│   │   │   ├── Row(score "92/100" + progress bar)
│   │   │   └── Text(summary line)
│   │   │
│   │   ├── WarningCard (left border amber)
│   │   │   ├── Icon (clock, amber bg)
│   │   │   ├── Column(title + subtitle)
│   │   │   └── Button("Renew", small)
│   │   │
│   │   ├── SectionHeader("OFFERS & UPDATES FOR YOU")
│   │   ├── HorizontalScrollRow (promo cards)
│   │   │   ├── PromoCard(Authenticator, purple gradient)
│   │   │   ├── PromoCard(VC Wallet, teal gradient)
│   │   │   └── PromoCard(Nominee, pink gradient)
│   │   │
│   │   ├── SectionHeader("GOVERNMENT SERVICES")
│   │   ├── HorizontalScrollRow (govt cards)
│   │   │   ├── GovtCard(myScheme, green gradient)
│   │   │   ├── GovtCard(DIKSHA, orange gradient)
│   │   │   └── GovtCard(Vande Bharat, navy gradient)
│   │   │
│   │   ├── SectionHeader("Your wallet" + "See all" link)
│   │   ├── DocumentCard(Aadhaar, tier1, full-width)
│   │   ├── Grid(2 columns)
│   │   │   ├── DocumentCard(PAN, compact)
│   │   │   └── DocumentCard(Licence, compact)
│   │   │
│   │   ├── SectionHeader("Quick actions")
│   │   ├── QuickActionGrid(4 columns)
│   │   │   ├── QA(Show ID, qr icon)
│   │   │   ├── QA(Share, share icon)
│   │   │   ├── QA(Get document, plus icon)
│   │   │   └── QA(Scan, scan icon)
│   │   │
│   │   ├── SectionHeader("Services")
│   │   └── ServicesGrid(4 columns, 2 rows)
│   │       ├── Service(Drive), Service(Health)
│   │       ├── Service(Credentials), Service(Consent)
│   │       ├── Service(Nominee), Service(eSign)
│   │       ├── Service(Activity), Service(Account)
│   │
│   ├── AccessibilityFAB
│   ├── AccessibilityPanel
│   ├── LanguageBottomSheet
│   └── BottomNavigationBar
│       ├── Tab(Home, active)
│       ├── Tab(Wallet)
│       ├── CenterFAB(Scan/Verify)
│       ├── Tab(Activity)
│       └── Tab(Account)
```

### Layout Structure
```kotlin
Scaffold(
    bottomBar = { BottomNavigationBar() }
) {
    Column(modifier = Modifier.verticalScroll(rememberScrollState()).padding(horizontal = 18.dp)) {
        // Header row with avatar + action buttons
        Spacer(24.dp)
        // Identity Health Card
        Spacer(16.dp)
        // Warning Card
        Spacer(24.dp)
        // Section: Offers
        Text(eyebrow)
        LazyRow(horizontalArrangement = spacedBy(12.dp)) { /* promo cards */ }
        Spacer(24.dp)
        // Section: Govt Services
        Text(eyebrow)
        LazyRow(...) { /* govt cards */ }
        Spacer(24.dp)
        // Wallet section
        Row(SpaceBetween) { Text("Your wallet"); TextLink("See all") }
        DocumentCard(aadhaar)
        Row(horizontalArrangement = spacedBy(12.dp)) {
            DocumentCard(pan, compact, Modifier.weight(1f))
            DocumentCard(licence, compact, Modifier.weight(1f))
        }
        Spacer(32.dp)
        // Quick Actions
        LazyVerticalGrid(columns = Fixed(4))
        Spacer(32.dp)
        // Services
        LazyVerticalGrid(columns = Fixed(4))
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Language button | onClick | Opens language bottom sheet |
| Scan button | onClick | `23-scan.html` |
| Bell button | onClick | `20-notifications.html` |
| Warning "Renew" button | onClick | Toast |
| Promo cards | onClick | Toast/navigation |
| Govt cards | href (external) | External URLs |
| "See all" wallet link | onClick | `07-wallet.html` |
| Aadhaar card | onClick | `08-document-detail.html` |
| PAN card | onClick | `08-document-detail.html` |
| Licence card | onClick | `08-document-detail.html` |
| Show ID | onClick | `10-verify.html` |
| Share | onClick | `09-share.html` |
| Get document | onClick | `11-fetch.html` |
| Scan (QA) | onClick | `23-scan.html` |
| Drive | onClick | `12-drive.html` |
| Health | onClick | `18-health.html` |
| Credentials | onClick | `19-vc-wallet.html` |
| Consent | onClick | `16-consent.html` |
| Nominee | onClick | `17-nominee.html` |
| eSign | onClick | `30-esign.html` |
| Activity | onClick | `13-activity.html` |
| Account | onClick | `21-account.html` |
| Bottom nav tabs | onClick | respective screens |
| Center FAB | onClick | `10-verify.html` |

### Visual Design Details
- **Identity Health Card**: borderRadius xl (22dp), padding 14x16, gradient `linear-gradient(135deg, #6366f1, #818cf8 50%, #a5b4fc)`, white text, decorative circle
- **Progress bar**: 5dp height, white/25% opacity bg, white fill gradient
- **Warning card**: standard card with 4dp left border `--warning` color
- **Promo cards**: 240dp min-width, fixed 240dp, borderRadius lg, gradient bg, snap scroll, each has decorative circle
- **Quick action items**: 58dp icon box, borderRadius 18dp, surface bg, border, shadow; 11sp label
- **Bottom nav**: sticky bottom, blur backdrop, border-top, 5 tabs; center FAB 58dp rounded 18dp, gradient, elevated, translated up 16dp
- **Notification badge**: 9dp red dot, absolute positioned top-right of bell icon

### State Variations
- Active profile name/avatar from localStorage
- Language bottom sheet open/closed
- Accessibility panel open/closed
- Notification badge presence
- Promo banner content (server-driven, can be empty)

### Icons & Images
- `home`, `cards`, `scan`, `activity`, `user` (bottom nav)
- `bell` (notifications)
- `check` (health badge, verified badges)
- `clock` (warning card)
- `qr` (Show ID)
- `share`, `plus`, `scan` (quick actions)
- `drive`, `health`, `shield`, `lock`, `family`, `pen`, `activity`, `user` (services)
- Globe SVG (language button — custom inline)
- `fp`, `doc`, `car` (document card emblems)

### Bottom Sheets / Dialogs / Overlays
- **Language Selector Bottom Sheet**: Full overlay (`.cscrim` scrim + `.csheet` panel)
  - Grab handle at top
  - Title "Choose Language"
  - 12-language grid (colored buttons): English, हिंदी, অসমীয়া, বাংলা, ગુજરાતી, ಕನ್ನಡ, മലയാളം, मराठी, ଓଡ଼ିଆ, ਪੰਜਾਬੀ, தமிழ், తెలుగు
  - Disclaimer text (shown for non-English)
  - Confirm button (primary, full-width)
  - Preview-before-confirm pattern
  - Dismiss by tapping scrim

### Accessibility
- Language button: `aria-label="Change language"`
- Scan button: `aria-label="Scan"`
- Bell button: `aria-label="Notifications"`
- Center FAB: `aria-label="Show / Verify"`
- A11y FAB: `aria-label="Accessibility options"`, `aria-expanded`
- A11y panel: `role="dialog"`, `aria-label="Accessibility"`
- Toast: `role="status"`, `aria-live="polite"`
- `data-i18n` attributes on all user-facing strings (i18n support)
