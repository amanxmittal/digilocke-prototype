# DigiLocker Screen Analysis — Part 1 (Splash, Onboarding, Login)

## Design System Tokens (Global Reference)

### Colors
- **Primary**: `#3E0DF5` (DigiLocker Indigo)
- **Primary-700**: `#2F08C2`
- **Primary-600**: `#4B22E0`
- **Primary-100**: `#E6E0FE`
- **Primary-50**: `#F2EFFE`
- **Secondary (Amber)**: `#FF8F00`
- **Gradient**: `linear-gradient(135deg, #5B2BF5 0%, #3E0DF5 100%)`
- **Background**: `#F3F4F8`
- **Surface**: `#FFFFFF`
- **Ink**: `#1B1D29`
- **Ink-2**: `#495057`
- **Ink-3**: `#6c757d`
- **Hair (border)**: `#E7E9F0`
- **Success**: `#198754`
- **Warning**: `#ffc107`
- **Danger**: `#dc3545`

### Typography (Noto Sans)
- **Display**: 30sp, weight 800, line-height 1.12, letter-spacing -0.4
- **H1**: 24sp, weight 800, line-height 1.18, letter-spacing -0.3
- **H2**: 20sp, weight 700, line-height 1.22
- **H3**: 17sp, weight 700
- **Body**: 15sp
- **Small**: 13sp
- **Caption**: 11.5sp

### Spacing (4dp base)
- s1=4, s2=8, s3=12, s4=16, s5=20, s6=24, s8=32, s10=40, s12=48

### Radii
- sm=8, default=12, lg=16, xl=22, 2xl=28, pill=999

### Elevation
- e1: `0 1px 2px rgba(27,29,41,.06), 0 1px 3px rgba(27,29,41,.05)`
- e2: `0 6px 16px rgba(27,29,41,.08)`
- e3: `0 16px 40px rgba(27,29,41,.12)`

---

## Screen 1: Splash (01-splash.html)

### Purpose & User Context
First screen shown on app launch. Displays brand identity, tagline, and a single CTA to begin the onboarding flow.

### Component Hierarchy
```
SplashScreen
├── StatusBar (system)
├── Box (full screen, centered content)
│   ├── RadialGradientBackground
│   ├── AppIconBox (92dp, rounded 28dp, gradient background, lock icon)
│   ├── Text("DigiLocker") — display style
│   ├── Text("Your documents. Verified. Always with you.") — muted
│   ├── Row(shield icon + "Government of India · MeitY") — caption
│   └── Button("Get started") — positioned near bottom
```

### Layout Structure
```kotlin
Scaffold {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        // Radial gradient background
        Column(horizontalAlignment = CenterHorizontally) {
            // AppIcon
            // Title
            // Subtitle
            // Gov badge row
        }
        // Button pinned to bottom with absolute positioning
        Button(modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 104.dp))
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| "Get started" button | onClick | `02-onboarding.html` |

### Visual Design Details
- Background: `radial-gradient(620px 440px at 50% 26%, #EDE8FE, transparent)` over `--bg`
- App icon: 92x92dp, borderRadius 28dp, gradient background (`--dl-grad`), box-shadow with purple glow
- Icon inside: white lock SVG (48x48)
- Title: Display weight (800, 30sp)
- Subtitle: muted color (`--ink-3`)
- Gov badge: 12sp, row with shield icon, color `--ink-3`
- Button: large variant (`btn lg block`), max-width 240dp

### State Variations
- None — single static state

### Icons & Images
- Lock icon (SVG inline): `<rect x="4" y="10" width="16" height="11" rx="3"/>` + keyhole path
- Shield icon (`data-ic="shield"`)
- Signal bars SVG (statusbar)
- Battery SVG (statusbar)

### Bottom Sheets / Dialogs / Overlays
- None

### Accessibility
- No specific aria attributes on this screen
- Button has implicit button role

---

## Screen 2: Onboarding (02-onboarding.html)

### Purpose & User Context
First of multiple onboarding pages. Shows document card previews (Aadhaar + PAN) and explains the value proposition. User can skip to pre-login home or continue to login.

### Component Hierarchy
```
OnboardingScreen
├── StatusBar
├── Column(padding)
│   ├── Row(SpaceBetween)
│   │   ├── Row(shield icon + "DigiLocker" bold text)
│   │   └── Chip("Skip")
│   ├── IllustrationCard (gradient container)
│   │   ├── DocumentCard(Aadhaar, tier1, full-size)
│   │   └── DocumentCard(PAN, compact, rotated -4deg, 88% width)
│   ├── Text("Every document, verified & ready.") — display
│   ├── Text(description paragraph) — ink2
│   ├── PageDots(currentPage=0, totalPages=3)
│   └── Button("Continue" + chevron icon) — full width, large
```

### Layout Structure
```kotlin
Column(modifier = Modifier.fillMaxSize().padding(horizontal = 18.dp, vertical = 54.dp)) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = SpaceBetween) { /* header */ }
    Spacer(Modifier.height(20.dp))
    Box(/* illustration card with gradient */) {
        Column(horizontalAlignment = CenterHorizontally) {
            DocumentCard(aadhaar)
            DocumentCard(pan, compact, rotated, overlapping)
        }
    }
    Spacer(Modifier.height(32.dp))
    Text(/* display title */)
    Text(/* body description */)
    Spacer(Modifier.height(32.dp))
    PageIndicator(current = 0, total = 3)
    Spacer(Modifier.height(24.dp))
    Button(/* Continue */)
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| "Skip" chip | onClick | `74-prelogin-home.html` |
| "Continue" button | onClick | `03-login.html` |
| Document cards | `event.stopPropagation()` | No navigation (display only) |

### Visual Design Details
- Illustration container: borderRadius 2xl (28dp), padding 22dp, background `linear-gradient(160deg, #F2EFFE, #E9F6FF)`, shadow e1
- Aadhaar card: tier1 size, skin `sk-aadhaar` (`linear-gradient(135deg, #3A1C8C, #3E0DF5 60%, #7C4DFF)`)
- PAN card: compact, skin `sk-pan` (`linear-gradient(135deg, #0E5A63, #0E7C86, #22C7D6)`), rotated -4deg, 88% width, marginTop -150px
- Document cards have: glow overlay, ribbon circle, foil holographic sheen, verified badge (green seal + white background)
- Page dots: 7dp circles, active dot is 24dp wide pill with primary color
- Button: full width, large variant with chevron icon

### State Variations
- Multiple onboarding pages (indicated by 3 dots) — this is page 1
- Dot indicator shows `i.on` for active page

### Icons & Images
- `shield` icon (header)
- `fp` (fingerprint) icon in Aadhaar card emblem
- `doc` icon in PAN card emblem
- `check` icon in verified badges
- `chev` (chevron right) in button

### Bottom Sheets / Dialogs / Overlays
- None

### Accessibility
- No explicit aria-labels on this page beyond implicit button roles

---

## Screen 3: Login (03-login.html)

### Purpose & User Context
Sign-in screen offering multiple authentication routes. Shows a returning user card (quick unlock) plus alternative sign-in methods (mobile, Aadhaar/VID). Also provides Easy Mode and accessibility options.

### Component Hierarchy
```
LoginScreen
├── StatusBar
├── Column(padding)
│   ├── IconButton(back arrow)
│   ├── Text("Sign in to DigiLocker") — h1
│   ├── Text(description) — ink2
│   ├── ReturningUserCard
│   │   ├── Row
│   │   │   ├── Avatar(initials "DN", 44dp, gradient bg)
│   │   │   ├── Column(name + subtitle)
│   │   │   └── Chevron icon
│   ├── Text("Or sign in with") — eyebrow
│   ├── Column(gap=16dp)
│   │   ├── SignInOptionCard(Mobile number)
│   │   │   ├── Phone icon + text + chevron
│   │   └── SignInOptionCard(Aadhaar / VID)
│   │       ├── Fingerprint icon + text + chevron
│   ├── InfoAlert(shield icon + text)
│   ├── GhostButton("सरल मोड · Easy Mode")
│   └── Text("First time here?...") — muted, centered
├── AccessibilityFAB
└── AccessibilityPanel (dialog)
    ├── TextSize selector (A- / A / A+)
    ├── High contrast toggle
    ├── Dark mode toggle
    └── Language change button
```

### Layout Structure
```kotlin
Scaffold {
    Column(modifier = Modifier.verticalScroll(rememberScrollState()).padding(18.dp)) {
        IconButton(onClick = goBack) // back
        Spacer(20.dp)
        Text(/* h1 title */)
        Spacer(8.dp)
        Text(/* description */)
        Spacer(24.dp)
        // Returning user card
        Card(border = primaryBorder, gradient background) { Row { ... } }
        Spacer(24.dp)
        Text("Or sign in with", style = eyebrow)
        Spacer(12.dp)
        Column(verticalArrangement = spacedBy(16.dp)) {
            SignInOptionCard(...)
            SignInOptionCard(...)
        }
        Spacer(24.dp)
        InfoAlert(...)
        Spacer(20.dp)
        GhostButton(...)
        Spacer(16.dp)
        Text(/* first time hint */)
    }
    // Floating accessibility button + panel
    AccessibilityFAB()
    AccessibilityPanel()
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Back button | onClick | `02-onboarding.html` |
| Returning user card | onClick | `05-mpin.html?ctx=returning#next=06-home.html` |
| Mobile number card | onClick | `60-enter-mobile.html` |
| Aadhaar/VID card | onClick | `61-enter-aadhaar-vid.html` |
| Easy Mode button | onClick | `E1-easy-welcome.html` |
| A11y FAB | toggles panel | Opens accessibility panel |
| Text size buttons | onClick | Changes text scale |
| High contrast switch | toggle | Toggles high contrast mode |
| Dark mode switch | toggle | Toggles theme |
| Language button | onClick | Shows toast |

### Visual Design Details
- Returning user card: border `--dl-primary-100`, background `linear-gradient(135deg, #fff, #F7F4FE)`
- Avatar: 44x44dp, borderRadius 13dp, gradient background, white text, weight 800
- Sign-in cards: standard card style (white bg, border, shadow e1), row layout with icon + text + chevron
- Info alert: primary-50 background, primary-700 text
- Ghost button: grey background with ink text
- A11y FAB: 46dp circle, primary background, white icon, white border, positioned bottom-left

### State Variations
- Returning user present vs. not (card visibility)
- Accessibility panel open/closed (`.a11ypanel.open`)
- Text scale variants: sm, normal, lg
- High contrast mode
- Dark mode

### Icons & Images
- `back` (back arrow)
- `chev` (chevron right) — on cards
- `phone` icon (mobile option)
- `fp` (fingerprint) icon (Aadhaar option)
- `shield` icon (info alert)
- `user` icon (Easy Mode button)
- `access` icon (a11y FAB)
- `eye` icon (high contrast)
- `star` icon (dark mode)
- `lang` icon (language)

### Bottom Sheets / Dialogs / Overlays
- **Accessibility Panel**: Positioned as a floating panel (not a bottom sheet), appears above the FAB when toggled. Contains text size, contrast, dark mode, language controls.

### Accessibility
- Back button: `aria-label="Back"`
- A11y FAB: `aria-label="Accessibility options"`, `aria-expanded="false/true"`
- A11y panel: `role="dialog"`, `aria-label="Accessibility"`
- Switch buttons for toggles
