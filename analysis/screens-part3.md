# DigiLocker Screen Analysis — Part 3 (Wallet, Document Detail)

## Screen 6: Wallet (07-wallet.html)

### Purpose & User Context
Full document wallet view showing all fetched/verified documents as rich credential cards. Accessible from bottom nav "Wallet" tab or "See all" from home. Users can browse by category tabs and add new documents.

### Component Hierarchy
```
WalletScreen
├── StatusBar
├── Scaffold
│   ├── AppBar (sticky)
│   │   ├── Title("Wallet")
│   │   └── IconButton(plus/add)
│   ├── Content (scrollable)
│   │   ├── SegmentedControl
│   │   │   ├── Button("All", active)
│   │   │   ├── Button("Identity")
│   │   │   ├── Button("Vehicle")
│   │   │   └── Button("Education")
│   │   ├── Column(gap=16dp)
│   │   │   ├── DocumentCard(Aadhaar, tier1, sk-aadhaar)
│   │   │   ├── DocumentCard(PAN, tier1, sk-pan)
│   │   │   ├── DocumentCard(Driving Licence, tier1, sk-dl)
│   │   │   ├── DocumentCard(Vehicle RC, tier1, sk-rc)
│   │   │   ├── DocumentCard(ABHA Health ID, tier1, sk-abha)
│   │   │   └── DocumentCard(Class XII Marksheet, tier1, sk-edu)
│   └── BottomNavigationBar (Wallet tab active)
```

### Layout Structure
```kotlin
Scaffold(
    topBar = {
        TopAppBar(
            title = { Text("Wallet", style = h2, weight = 800) },
            actions = { IconButton(onClick = navigateToFetch) { Icon(plus) } },
            // sticky, blur backdrop
        )
    },
    bottomBar = { BottomNavigationBar(selected = "wallet") }
) {
    Column(modifier = Modifier.verticalScroll(rememberScrollState()).padding(horizontal = 18.dp)) {
        // Segmented control
        SegmentedTabRow(tabs = listOf("All", "Identity", "Vehicle", "Education"))
        Spacer(20.dp)
        // Document cards list
        Column(verticalArrangement = spacedBy(16.dp)) {
            documents.forEach { doc ->
                DocumentCard(doc, onClick = { navigateToDetail(doc) })
            }
        }
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Plus icon button | onClick | `11-fetch.html` |
| "All" tab | onClick | Shows all documents |
| "Identity" tab | onClick | Filters + toast |
| "Vehicle" tab | onClick | Filters + toast |
| "Education" tab | onClick | Filters + toast |
| Aadhaar card | onClick | `08-document-detail.html` |
| PAN card | onClick | `08-document-detail.html` |
| Driving Licence card | onClick | `08-document-detail.html` |
| Vehicle RC card | onClick | `08-document-detail.html` |
| ABHA Health ID | onClick | `18-health.html` |
| Class XII Marksheet | onClick | `08-document-detail.html` |
| Bottom nav tabs | href | respective screens |

### Visual Design Details
- **AppBar**: Sticky, white 86% opacity, backdrop-filter blur 12px, bottom border `--hair`, padding 50px top 16px sides 12px bottom
- **Segmented control**: pill shape, `--g100` background, border `--hair`, 4dp padding, active button has white bg + primary color + shadow e1
- **Document cards**: All `tier1` (min-height 196dp), borderRadius xl (22dp), padding 18dp, white text
- **Card skins**:
  - Aadhaar: `linear-gradient(135deg, #3A1C8C, #3E0DF5 60%, #7C4DFF)`
  - PAN: `linear-gradient(135deg, #0E5A63, #0E7C86 55%, #22C7D6)`
  - DL: `linear-gradient(135deg, #9A1668, #C7237F 55%, #FF7AC6)`
  - RC: `linear-gradient(135deg, #14406E, #1E6FB8 55%, #54B8FF)`
  - ABHA: `linear-gradient(135deg, #0E6B43, #16A34A 55%, #5FD08A)`
  - Education: `linear-gradient(135deg, #8A4B00, #FF8F00 60%, #FFC061)`
- **Card elements**: glow radial, ribbon circle (10% white), foil holographic sheen, emblem box (38dp, 22% white bg), verified badge (white bg, green text/seal)
- **Card footer**: flex row, space-between, small labels + bold values

### State Variations
- Tab selection (All / Identity / Vehicle / Education)
- Card hover state: translateY(-3dp) + e3 shadow
- Documents list filtered by category

### Icons & Images
- `plus` (app bar action)
- `fp` (Aadhaar emblem)
- `doc` (PAN, DL emblems)
- `car` (RC emblem)
- `health` (ABHA emblem)
- `grad` (Education emblem)
- `check` (all verified badges)
- Bottom nav icons: `home`, `cards`, `scan`, `activity`, `user`

### Bottom Sheets / Dialogs / Overlays
- None

### Accessibility
- Plus button: `aria-label="Add document"`
- Center FAB: `aria-label="Show / Verify"`
- Implicit button roles on segmented tabs

---

## Screen 7: Document Detail (08-document-detail.html)

### Purpose & User Context
Detailed view of a single document (Aadhaar shown). Displays the full credential card, action buttons (Show, Share, Download), document fields with verification/hidden states, privacy info alert, and recent activity log.

### Component Hierarchy
```
DocumentDetailScreen
├── StatusBar
├── AppBar (sticky)
│   ├── IconButton(back)
│   ├── Title("Aadhaar")
│   └── IconButton(dots/more menu)
├── Content (scrollable)
│   ├── DocumentCard(Aadhaar, tier1, full)
│   ├── ActionButtonRow
│   │   ├── Button("Show", primary, icon qr) — grow
│   │   ├── Button("Share", ghost, icon share) — grow
│   │   └── IconButton(download/upload icon)
│   ├── DetailsCard
│   │   ├── Header("Details") — h3
│   │   ├── FieldRow(Name: "Debabrata Nayak", badge: "Verified")
│   │   ├── FieldRow(DOB: "•• ••• 1986", badge: "Hidden")
│   │   ├── FieldRow(Gender: "Male")
│   │   └── FieldRow(Address: "Pune, Maharashtra", badge: "Hidden")
│   ├── InfoAlert(encryption/privacy message)
│   ├── SectionHeader("Recent activity" + "All" link)
│   └── ActivityCard
│       ├── ActivityRow(share icon, "Shared with HDFC Bank", timestamp)
│       └── ActivityRow(qr icon, "Shown at airport check-in", timestamp)
```

### Layout Structure
```kotlin
Scaffold(
    topBar = {
        TopAppBar(
            navigationIcon = { IconButton(back) },
            title = { Text("Aadhaar") },
            actions = { IconButton(more/dots) }
        )
    }
) {
    Column(
        modifier = Modifier.verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, top = 14.dp, bottom = 110.dp)
    ) {
        // Full document card (non-clickable in this context)
        DocumentCard(aadhaar, tier1)
        Spacer(20.dp)
        // Action buttons row
        Row(horizontalArrangement = spacedBy(8.dp)) {
            Button("Show", Modifier.weight(1f), leadingIcon = qr)
            OutlinedButton("Share", Modifier.weight(1f), leadingIcon = share)
            IconButton(download)
        }
        Spacer(20.dp)
        // Details card
        Card {
            Text("Details", style = h3)
            FieldFillRow(...)
            FieldFillRow(...)
            FieldFillRow(...)
            FieldFillRow(...)
        }
        Spacer(16.dp)
        // Info alert
        InfoAlert(...)
        Spacer(24.dp)
        // Recent activity
        Row(SpaceBetween) { Text("Recent activity", h3); TextLink("All") }
        Spacer(12.dp)
        Card {
            ActivityListRow(...)
            ActivityListRow(...)
        }
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Back button | onClick | `07-wallet.html` (goBack) |
| More/dots button | onClick | Confirm dialog (remove document) |
| "Show" button | onClick | `10-verify.html` |
| "Share" button | onClick | `09-share.html` |
| Download button | onClick | Toast("Downloaded PDF") |
| Hidden field badges | onClick | Toast("Reauth to reveal") |
| "All" activity link | onClick | `13-activity.html` |

### Visual Design Details
- **Action buttons row**: gap 8dp, primary "Show" + ghost "Share" (both grow/weight 1f) + icon-only download
- **Details card**: Standard card, contains `.fieldfill` rows
- **FieldFill row**: Flex row with label (small, muted) + value (body) + optional status chip
  - `.exp-ver` chip: green verified badge
  - `.exp-hidden` chip: indicates masked/hidden data, clickable to reveal with reauth
- **Info alert**: `alert info` style — primary-50 bg, primary-700 text, shield icon + text
- **Activity rows** (`.lrow`): 42dp icon circle (primary-50 bg, primary color), bold title + muted timestamp
- **Document card in detail**: Same as wallet but non-interactive (no hover/click)

### State Variations
- Document type changes card skin and details
- Field visibility: some fields shown, others "Hidden" (require reauth)
- "Verified" status on fields
- More menu confirmation dialog state

### Icons & Images
- `back` (navigation back)
- `dots` (more menu)
- `fp` (Aadhaar card emblem)
- `check` (verified badge)
- `qr` (Show button icon)
- `share` (Share button icon, activity row)
- `upload` (download button — note: icon name is "upload" but used as download)
- `shield` (info alert)
- `qr` (activity row — shown at airport)

### Bottom Sheets / Dialogs / Overlays
- **Confirmation Dialog** (triggered by more/dots button): Uses `confirmDo()` utility
  - Title: "Remove document?"
  - Message: "This removes the local copy. You can fetch it again anytime."
  - Destructive action button: "Remove"
  - Triggers toast "Removed" with trash icon

### Accessibility
- Back button: `aria-label="Back"`
- More button: `aria-label="More"`
- Download button: `aria-label="Download"`
- Hidden field chips are interactive (onClick)
