# DigiLocker Screen Analysis — Part 4 (Fetch, Drive, Account)

## Screen 8: Fetch / Get Document (11-fetch.html)

### Purpose & User Context
Discovery screen for fetching new documents from government issuers. Features search, category grid, and curated document lists (trending, popular, new). Entry point for the document fetch flow.

### Component Hierarchy
```
FetchDocumentScreen
├── StatusBar
├── AppBar (sticky)
│   ├── IconButton(back)
│   └── Title("Get a document")
├── Content (scrollable)
│   ├── SearchBar
│   │   ├── Search icon
│   │   └── TextInput(placeholder: "Search documents or issuers")
│   ├── SectionHeader("Categories") — eyebrow
│   ├── CategoryGrid (3 columns)
│   │   ├── CategoryTile(Education & Learning, grad icon)
│   │   ├── CategoryTile(Central Government, building icon)
│   │   ├── CategoryTile(State Government, map icon)
│   │   ├── CategoryTile(Industry & Private Sector, building icon)
│   │   ├── CategoryTile(Government & Public Sector, shield icon)
│   │   ├── CategoryTile(Banking/Financial/Insurance, rupee icon)
│   │   ├── CategoryTile(Skill & Vocational, award icon)
│   │   ├── CategoryTile(Ministry of Defence, shield icon)
│   │   ├── CategoryTile(Transport & Infrastructure, car icon)
│   │   ├── CategoryTile(Health & Wellness, health icon)
│   │   ├── CategoryTile(Identity Docs, idcard icon)
│   │   ├── CategoryTile(National Service Scheme, people icon)
│   │   └── CategoryTile(Sports & Culture, award icon)
│   ├── BrowseByStateCard
│   │   ├── Icon (map, primary)
│   │   ├── Column(title + subtitle)
│   │   └── Chevron
│   ├── SectionHeader("🔥 Trending") — eyebrow
│   ├── TrendingList (card with rows)
│   │   ├── DocRow(Driving Licence, car icon)
│   │   ├── DocRow(Class XII Marksheet, grad icon)
│   │   ├── DocRow(Class X Marksheet, grad icon)
│   │   └── DocRow(Vehicle Registration, car icon)
│   ├── SectionHeader("⭐ Popular") — eyebrow
│   ├── PopularList (card with rows)
│   │   ├── DocRow(Driving Licence, car icon)
│   │   ├── DocRow(Class XII Marksheet, grad icon)
│   │   ├── DocRow(PAN Verification, doc icon)
│   │   └── DocRow(Vaccination Certificate, health icon)
│   ├── SectionHeader("✨ Newly Added") — eyebrow
│   └── NewList (card with rows)
│       ├── DocRow(PAN Verification, doc icon)
│       ├── DocRow(Vaccination Certificate, health icon)
│       ├── DocRow(Aadhaar Card, idcard icon)
│       └── DocRow(Skill Certificate, award icon)
```

### Layout Structure
```kotlin
Scaffold(
    topBar = {
        TopAppBar(
            navigationIcon = { IconButton(back) },
            title = { Text("Get a document") }
        )
    }
) {
    Column(
        modifier = Modifier.verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, top = 14.dp)
    ) {
        // Search bar
        SearchField(placeholder = "Search documents or issuers")
        Spacer(20.dp)
        // Categories
        Text("Categories", style = eyebrow)
        LazyVerticalGrid(columns = Fixed(3), verticalArrangement = spacedBy(10.dp), horizontalArrangement = spacedBy(10.dp)) {
            items(categories) { CategoryTile(it) }
        }
        Spacer(20.dp)
        // Browse by State card
        Card { ListRow(icon = map, title = "Browse by State", subtitle = "...") }
        Spacer(24.dp)
        // Trending
        Text("🔥 Trending", style = eyebrow)
        Card { trending.forEach { DocumentListRow(it) } }
        Spacer(24.dp)
        // Popular
        Text("⭐ Popular", style = eyebrow)
        Card { popular.forEach { DocumentListRow(it) } }
        Spacer(24.dp)
        // Newly Added
        Text("✨ Newly Added", style = eyebrow)
        Card { newDocs.forEach { DocumentListRow(it) } }
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Back button | onClick | `07-wallet.html` (goBack) |
| Search bar | onFocus | Toast (search coming soon) |
| Category tiles | onClick | `11b-category.html#cat={id}&name={name}` |
| Browse by State | onClick | `11c-state.html` |
| Document rows | onClick | `11d-confirm.html#doc={id}&name={name}&issuer={issuer}&icon={icon}` |

### Visual Design Details
- **Search bar**: Flex row, `--surface` bg, 1.5px border `--hair`, borderRadius 14dp, padding 2x14, input 15sp
- **Category grid**: 3 columns, gap 10dp
- **Category tile**: Column centered, padding 14x6, surface bg, 1px border, borderRadius lg (16dp), shadow none, active scale 0.96
  - Icon circle: 40dp, borderRadius 12dp, primary-50 bg, primary color
  - Name: caption size, weight 600
- **Document list rows** (`.lrow`): 42dp icon circle + grow text + chevron, padding 14dp vertical, border-bottom `--hair`
- **Browse by State card**: Standalone card with list row pattern

### State Variations
- Search focused/unfocused (currently just shows toast)
- Category selection (navigates away)
- Lists are dynamically rendered from data arrays
- Could be empty states if no documents in category

### Icons & Images
- `back` (navigation)
- `search` (search bar)
- `grad` (Education)
- `building` (Central Govt, Industry)
- `map` (State Govt, Browse by State)
- `shield` (Govt & Public, Defence)
- `rupee` (Banking/Financial)
- `award` (Skill, Sports)
- `car` (Transport, DL, RC)
- `health` (Health, Vaccination)
- `idcard` (Identity, Aadhaar)
- `people` (NSS)
- `doc` (PAN)
- `chev` (chevron on rows)

### Bottom Sheets / Dialogs / Overlays
- None

### Accessibility
- Category tiles: `role="button"`, `tabindex="0"`, `aria-label="{name}"`
- Browse by State: `role="button"`, `tabindex="0"`, `aria-label="Browse by State"`
- Document rows: `role="button"`, `tabindex="0"`, `aria-label="{name}"`
- Back button: `aria-label="Back"`

---

## Screen 9: Drive (12-drive.html)

### Purpose & User Context
Personal cloud storage section for user-uploaded documents (non-issuer documents). Shows storage usage, folders, and recent files. Has a FAB for uploading new files.

### Component Hierarchy
```
DriveScreen
├── StatusBar
├── AppBar (sticky)
│   ├── IconButton(back)
│   ├── Title("Drive")
│   └── IconButton(search)
├── Content (scrollable)
│   ├── StorageCard (primary-50 bg)
│   │   ├── Row("Storage" bold + "1.2 GB of 5 GB" muted)
│   │   └── ProgressBar(24%)
│   ├── SectionHeader("Folders") — eyebrow
│   ├── FolderGrid (2 columns)
│   │   ├── FolderTile(Documents, 12 files)
│   │   └── FolderTile(eSigned Docs, 4 files)
│   ├── SectionHeader("Recent files") — eyebrow
│   └── RecentFilesCard
│       ├── FileRow(Rent Agreement.pdf, 820KB, 2 days, red icon)
│       ├── FileRow(Passport Photo.jpg, 210KB, 5 days, blue icon)
│       └── FileRow(Salary Slip.pdf, 340KB, 1 week, green icon)
├── FloatingActionButton(plus/upload)
```

### Layout Structure
```kotlin
Scaffold(
    topBar = {
        TopAppBar(
            navigationIcon = { IconButton(back) },
            title = { Text("Drive") },
            actions = { IconButton(search) }
        )
    },
    floatingActionButton = {
        FloatingActionButton(
            onClick = navigateToUpload,
            shape = RoundedCornerShape(18.dp),
            containerColor = gradient
        ) { Icon(plus) }
    }
) {
    Column(
        modifier = Modifier.verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, top = 14.dp)
    ) {
        // Storage card
        Card(colors = CardDefaults.cardColors(containerColor = primary50)) {
            Row(SpaceBetween) { Text("Storage", bold); Text("1.2 GB of 5 GB", muted) }
            Spacer(12.dp)
            LinearProgressIndicator(progress = 0.24f)
        }
        Spacer(24.dp)
        // Folders
        Text("Folders", style = eyebrow)
        Spacer(12.dp)
        Row(horizontalArrangement = spacedBy(12.dp)) {
            FolderTile(Modifier.weight(1f), "Documents", "12 files")
            FolderTile(Modifier.weight(1f), "eSigned Docs", "4 files")
        }
        Spacer(24.dp)
        // Recent files
        Text("Recent files", style = eyebrow)
        Spacer(12.dp)
        Card {
            FileListRow(...)
            FileListRow(...)
            FileListRow(...)
        }
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Back button | onClick | `06-home.html` (goBack) |
| Search button | onClick | Toast("Search files") |
| Folder tiles | onClick | Toast("Opened {name}") |
| File rows | onClick | `15-drive-file.html` |
| Dots on file rows | onClick | (implied context menu) |
| Upload FAB | onClick | `14-upload.html` |

### Visual Design Details
- **Storage card**: primary-50 bg, border primary-100
- **Progress bar**: 8dp height, borderRadius pill, `--g200` bg, gradient fill (`--dl-grad`)
- **Folder tiles**: 2-column grid, column layout with icon + name + count
  - Folder icon box: 46dp, borderRadius 13dp, `--dl-secondary-50` bg, `--dl-secondary` color
  - Card: surface bg, border hair, borderRadius lg, padding 15dp, shadow e1
- **File rows**: `.lrow` pattern with colored file icon (42dp, borderRadius 10dp)
  - PDF: red (`--danger`)
  - Image: blue (`--blue`)
  - Salary: green (`--green`)
- **FAB**: 60dp, borderRadius 18dp, gradient bg, white icon, glow shadow, absolute bottom-right (18dp right, 24dp bottom)

### State Variations
- Storage usage percentage (dynamic)
- Folder count (dynamic)
- File list (dynamic, could be empty)
- File type determines icon color

### Icons & Images
- `back` (navigation)
- `search` (app bar)
- `folder` (folder tiles)
- `file` (PDF file icons)
- `image` (image file icon)
- `dots` (more options per file)
- `plus` (FAB)

### Bottom Sheets / Dialogs / Overlays
- None visible (dots button implies a context menu)

### Accessibility
- Back button: `aria-label="Back"`
- Search button: `aria-label="Search"`
- Upload FAB: `aria-label="Upload"`

---

## Screen 10: Account (21-account.html)

### Purpose & User Context
User account management screen. Shows profile info, KYC status, and grouped settings: identity/security, accounts on device, two-factor auth, and preferences. Includes sign-out action.

### Component Hierarchy
```
AccountScreen
├── StatusBar
├── Scaffold
│   ├── AppBar (sticky)
│   │   ├── Title("Account")
│   │   └── IconButton(settings)
│   ├── Content (scrollable)
│   │   ├── ProfileCard
│   │   │   ├── Avatar(initials "DN", 56dp, gradient, rounded 18dp)
│   │   │   ├── Column(name h3 + handle/phone muted)
│   │   │   └── KYC Badge (green)
│   │   │
│   │   ├── SectionHeader("Identity & security") — eyebrow
│   │   ├── SettingsCard
│   │   │   ├── ListRow(user icon, "Profile & photo", chevron)
│   │   │   ├── ListRow(phone icon, "Where you're signed in", badge "3")
│   │   │   ├── ListRow(lock icon, "Consent & connected apps", chevron)
│   │   │   └── ListRow(family icon, "Nominee & legacy", chevron)
│   │   │
│   │   ├── SectionHeader("Accounts on this device") — eyebrow
│   │   ├── SettingsCard
│   │   │   └── ListRow(people icon, "Switch account", "2 profiles" muted)
│   │   │
│   │   ├── SectionHeader("Two-factor & sign-in") — eyebrow
│   │   ├── SettingsCard
│   │   │   └── ListRow(key icon, "DigiLocker Authenticator", chevron)
│   │   │
│   │   ├── SectionHeader("Preferences") — eyebrow
│   │   ├── SettingsCard
│   │   │   ├── ListRow(settings icon, "Settings", chevron)
│   │   │   └── ListRow(lang icon, "Language", "English" muted)
│   │   │
│   │   └── SignOutButton (ghost, danger color)
│   │
│   └── BottomNavigationBar (Account tab active)
```

### Layout Structure
```kotlin
Scaffold(
    topBar = {
        TopAppBar(
            title = { Text("Account") },
            actions = { IconButton(settings) }
        )
    },
    bottomBar = { BottomNavigationBar(selected = "account") }
) {
    Column(
        modifier = Modifier.verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, top = 14.dp, bottom = 110.dp)
    ) {
        // Profile card
        Card {
            Row {
                Avatar(56.dp, gradient)
                Column { Text(name, h3); Text(handle, muted sm) }
                Spacer(weight)
                Badge("KYC", green, check icon)
            }
        }
        Spacer(24.dp)
        // Identity & Security section
        Text("Identity & security", style = eyebrow)
        Spacer(12.dp)
        Card {
            SettingsListRow(icon = user, title = "Profile & photo", trailing = chevron)
            SettingsListRow(icon = phone, title = "Where you're signed in", trailing = Badge("3", indigo))
            SettingsListRow(icon = lock, title = "Consent & connected apps", trailing = chevron)
            SettingsListRow(icon = family, title = "Nominee & legacy", trailing = chevron)
        }
        Spacer(24.dp)
        // Accounts on this device
        Text("Accounts on this device", style = eyebrow)
        Spacer(12.dp)
        Card {
            SettingsListRow(icon = people, title = "Switch account", trailing = Text("2 profiles", muted))
        }
        Spacer(24.dp)
        // Two-factor
        Text("Two-factor & sign-in", style = eyebrow)
        Spacer(12.dp)
        Card {
            SettingsListRow(icon = key, title = "DigiLocker Authenticator", trailing = chevron)
        }
        Spacer(24.dp)
        // Preferences
        Text("Preferences", style = eyebrow)
        Spacer(12.dp)
        Card {
            SettingsListRow(icon = settings, title = "Settings", trailing = chevron)
            SettingsListRow(icon = lang, title = "Language", trailing = Text("English", muted))
        }
        Spacer(24.dp)
        // Sign out
        OutlinedButton(
            "Sign out",
            colors = danger,
            icon = logout,
            modifier = Modifier.fillMaxWidth()
        )
    }
}
```

### Interactive Elements
| Element | Action | Navigation Target |
|---------|--------|-------------------|
| Settings icon button | onClick | `22-settings.html` |
| Profile & photo | onClick | Toast("Update profile") |
| Where you're signed in | onClick | Toast("Manage sessions") |
| Consent & connected apps | onClick | `16-consent.html` |
| Nominee & legacy | onClick | `17-nominee.html` |
| Switch account | onClick | `75-switch-account.html` |
| DigiLocker Authenticator | onClick | `79-authenticator.html` |
| Settings | onClick | `22-settings.html` |
| Language | onClick | Toast("22 languages") |
| Sign out button | onClick | Confirm dialog → `03-login.html` |
| Bottom nav tabs | href | respective screens |

### Visual Design Details
- **Profile card**: Standard card with row layout
  - Avatar: 56dp, borderRadius 18dp, gradient bg, white text, weight 800, font 20sp
  - KYC badge: green badge with check icon
- **Settings list rows**: `.lrow` pattern — 42dp icon circle (primary-50 bg) + bold sm title + trailing element
  - Trailing can be: chevron icon, badge (indigo), or muted text
  - Separated by 1px `--hair` border, last item has no border
- **Sign out button**: ghost style, danger color (`--red`), full width, logout icon

### State Variations
- Profile data (name, handle, phone)
- Session count badge (dynamic number)
- Language label (current selection)
- Sign out confirmation dialog open/closed

### Icons & Images
- `settings` (app bar action)
- `user` (profile row)
- `phone` (sessions row)
- `lock` (consent row)
- `family` (nominee row)
- `people` (switch account row)
- `key` (authenticator row)
- `settings` (settings row)
- `lang` (language row)
- `logout` (sign out button)
- `check` (KYC badge)
- `chev` (trailing chevrons)
- Bottom nav: `home`, `cards`, `scan`, `activity`, `user`

### Bottom Sheets / Dialogs / Overlays
- **Sign Out Confirmation Dialog** (via `confirmDo()`):
  - Title: "Sign out?"
  - Message: "You will need MPIN or OTP to sign in again."
  - Destructive action: "Sign out"
  - On confirm: Toast "Signed out" + navigate to `03-login.html`

### Accessibility
- Settings button: `aria-label="Settings"`
- Center FAB: `aria-label="Show / Verify"`
- Bottom nav tabs have implicit roles
