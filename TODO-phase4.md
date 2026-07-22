# USPA Phase 4: UBa Branding Overhaul

## UBa Official Colors
- **Navy Blue:** `#1B2A4A` — Primary (headers, buttons, nav)
- **Teal:** `#0FA3B1` — Accent (CTAs, links, active states)
- **Gold:** `#F5A623` — Highlight (badges, featured)
- **Green:** `#2ECC71` — Success/eligible
- **White:** `#FFFFFF` — Backgrounds

## Implementation Steps

### Step 1: Foundation — Theme & Components
- [x] Update `globals.css` with UBa color tokens (navy primary, teal accent, gold warning, green success)
- [x] Update `button.tsx` — Navy primary, teal accent, navy outline/ghost variants
- [x] Update `badge.tsx` — Teal info (`#0FA3B1`), gold warning (`#F5A623`), green success (`#2ECC71`)

### Step 2: Layout — Header & Footer
- [x] Update `header.tsx` — Navy logo with teal hover, teal active nav link, navy focus ring
- [x] Update `footer.tsx` — Navy `#1B2A4A` background, gold accent links, teal hover effects

### Step 3: Pages — Home & Navigation
- [x] Update Home `page.tsx` — Navy hero gradient (`#1B2A4A`→`#2A3F66`), teal buttons (`#0FA3B1`), gold badge, white text
- [x] Update Programmes `page.tsx` — Navy border focus (`#1B2A4A`) on search input
- [x] Update Programme Detail `[code]/page.tsx` — Teal active tab border (`#0FA3B1`)
- [x] Update Faculties `page.tsx` — Navy gradient faculty headers, teal icon badges, teal link text

### Step 4: Feature Pages
- [x] Update Admission Checker `page.tsx` — Navy icon circle, navy active step indicators
- [x] Update Login `page.tsx` — Navy `#1B2A4A` icon circle, teal `#0FA3B1` focus rings, teal links, teal checkbox
- [x] Update Register `page.tsx` — Navy `#1B2A4A` icon circle, teal `#0FA3B1` focus rings on all inputs, teal link
- [x] Update Favourites `page.tsx` — Teal `#0FA3B1` programme link hover color
- [x] Update Compare `page.tsx` — Teal `#0FA3B1` programme link hover color
- [x] Update AI Advisor `page.tsx` — Navy `#1B2A4A` header icon circle with teal `#0FA3B1` sparkle icon

## All Pages Verified
- / → 200 ✓ (Navy hero gradient, teal search button, gold badge)
- /programmes → 200 ✓
- /programmes/[code] → 200 ✓
- /faculties → 200 ✓
- /admission-checker → 200 ✓
- /login → 200 ✓
- /register → 200 ✓
- /favourites → 200 ✓
- /compare → 200 ✓
- /ai-advisor → 200 ✓
- /admin → 200 ✓

