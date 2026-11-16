# DigiLocker — Shared Composables & Navigation Reference

## Reusable Composables Needed (extracted from all screens)

### Core Layout
| Composable | Used In | Description |
|-----------|---------|-------------|
| `DigiLockerScaffold` | All post-auth screens | Scaffold with optional bottom nav, a11y FAB |
| `StickyAppBar` | Wallet, Detail, Fetch, Drive, Account | Blur backdrop, sticky, title + actions |
| `BottomNavigationBar` | Home, Wallet, Account, Activity | 5 tabs with center FAB |
| `StatusBar` | All screens | System clock + signal/battery indicators |

### Navigation Components
| Composable | Description |
|-----------|-------------|
| `BackIconButton` | Standard back navigation (aria-label="Back") |
| `BottomNavTab` | Individual tab in bottom nav |
| `CenterFAB` | Elevated scan/verify button in bottom nav |

### Cards & Containers
| Composable | Description |
|-----------|-------------|
| `DocumentCard` | Rich credential card with gradient skin, glow, ribbon, foil, verified badge |
| `DocumentCardCompact` | Smaller version for grid layouts |
| `StandardCard` | White card with border, shadow, padding |
| `InfoAlert` | Colored alert with icon + message |
| `WarningCard` | Card with colored left border + icon + CTA |
| `PromoCard` | Gradient promotional card for horizontal scroll |
| `GovtServiceCard` | External link card with gradient |

### Document Card Skins (enum)
| Skin | Gradient |
|------|----------|
| `AADHAAR` | `#3A1C8C → #3E0DF5 → #7C4DFF` |
| `PAN` | `#0E5A63 → #0E7C86 → #22C7D6` |
| `DRIVING_LICENCE` | `#9A1668 → #C7237F → #FF7AC6` |
| `VEHICLE_RC` | `#14406E → #1E6FB8 → #54B8FF` |
| `ABHA` | `#0E6B43 → #16A34A → #5FD08A` |
| `EDUCATION` | `#8A4B00 → #FF8F00 → #FFC061` |

### Interactive Elements
| Composable | Description |
|-----------|-------------|
| `PrimaryButton` | Filled primary button (lg, block variants) |
| `GhostButton` | Grey background outlined button |
| `OutlineButton` | Primary-outlined button |
| `SmallButton` | Pill-shaped small CTA |
| `IconButton` | 46dp square with border + shadow |
| `ChipButton` | Pill-shaped chip |
| `SwitchToggle` | iOS-style toggle (48x28dp) |
| `SegmentedControl` | Pill container with selectable tabs |
| `TextLink` | Primary colored text link |

### List & Row Patterns
| Composable | Description |
|-----------|-------------|
| `ListRow` | Standard row: 42dp icon circle + text + trailing |
| `SettingsListRow` | ListRow variant for settings screens |
| `FileListRow` | Row with colored file type icon |
| `DocumentListRow` | Browsable doc row with chevron |
| `ActivityRow` | Activity log row with icon + title + timestamp |
| `FieldFillRow` | Label/value pair with optional status chip |

### Grid Items
| Composable | Description |
|-----------|-------------|
| `QuickActionItem` | 58dp icon box + label, 4-column grid |
| `ServiceItem` | Same as QuickAction, used in services section |
| `CategoryTile` | 3-column tile with icon + name |
| `FolderTile` | 2-column folder card with icon + name + count |

### Overlays & Sheets
| Composable | Description |
|-----------|-------------|
| `AccessibilityFAB` | Floating a11y button (bottom-left) |
| `AccessibilityPanel` | Floating dialog with text size, contrast, theme |
| `LanguageBottomSheet` | Full-screen scrim + sliding sheet with language grid |
| `ConfirmationDialog` | Destructive action confirmation |
| `Toast` | Transient notification (bottom-center, auto-dismiss) |

### Authentication
| Composable | Description |
|-----------|-------------|
| `PinDotRow` | 6 circular dots showing PIN entry progress |
| `NumericKeypad` | 3x4 grid with number buttons + backspace |
| `BiometricHero` | Large pulsing circle with fingerprint icon |
| `SignInOptionCard` | Clickable card with icon + title + subtitle + chevron |
| `ReturningUserCard` | Highlighted card with avatar + name + chevron |

### Indicators
| Composable | Description |
|-----------|-------------|
| `PageDotIndicator` | Horizontal dots with active pill state |
| `ProgressBar` | Linear progress (8dp or 5dp height) |
| `NotificationBadgeDot` | 9dp red circle |
| `VerifiedBadge` | Green seal + white label badge |
| `StatusBadge` | Colored pill badge (green, amber, red, indigo) |

---

## Navigation Graph

```
SplashScreen (01) → OnboardingScreen (02) → LoginScreen (03)
                                                ├── MpinScreen (05) → HomeScreen (06)
                                                ├── EnterMobile (60) → ...
                                                └── EnterAadhaar (61) → ...

HomeScreen (06) ──┬── WalletScreen (07) ── DocumentDetailScreen (08)
                  ├── FetchScreen (11) ── CategoryScreen (11b) ── ConfirmFetchScreen (11d)
                  ├── DriveScreen (12)
                  ├── AccountScreen (21)
                  ├── VerifyScreen (10)
                  ├── ShareScreen (09)
                  ├── ScanScreen (23)
                  ├── NotificationsScreen (20)
                  ├── ActivityScreen (13)
                  ├── HealthScreen (18)
                  ├── VCWalletScreen (19)
                  ├── ConsentScreen (16)
                  ├── NomineeScreen (17)
                  └── eSignScreen (30)

AccountScreen (21) ──┬── SettingsScreen (22)
                     ├── SwitchAccountScreen (75)
                     ├── AuthenticatorScreen (79)
                     └── Sign Out → LoginScreen (03)
```

---

## Icon Set (Complete)

All icons are 24x24 SVG stroke-based (stroke-width 1.85, round linecap/linejoin):

`home`, `cards`, `scan`, `activity`, `user`, `share`, `shield`, `check`, `search`, `bell`, `spark`, `qr`, `doc`, `health`, `drive`, `pen`, `key`, `family`, `globe`, `chev`, `back`, `plus`, `fp`, `lock`, `phone`, `eye`, `send`, `dl`, `clock`, `star`, `mic`, `car`, `grad`, `lang`, `settings`, `logout`, `filter`, `bolt`, `map`, `building`, `copy`

Icon size variants: `ic-sm` (18dp), default (22dp), `ic-lg` (26dp)

---

## Theme Support

### Light (default)
- Background: `#F3F4F8`
- Surface: `#FFFFFF`
- Ink: `#1B1D29`

### Dark (data-theme)
- Invert surfaces and ink colors
- Preserve brand gradient colors

### High Contrast (data-contrast="high")
- Ink becomes `#000`
- Hair becomes `#000`
- Cards get 1.5px solid black border

### Text Scale
- `sm`: All type sizes reduced ~2sp
- `normal`: Default
- `lg`: All type sizes increased ~3sp
