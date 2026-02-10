# CLAUDE.md — Mattress Shop Frontend

## Overview

React 19 SPA for a Ukrainian mattress e-commerce store. Deployed on GitHub Pages. Supports mock mode for development without backend.

**Demo:** https://greenfield-taster.github.io/mattress-shop/
**Stack:** React 19.1, React Router 6.21, Vite 7.1, Sass 1.70, MUI 6.1 (Chip only), Lucide React, rc-slider

## Commands

```bash
npm run dev          # Dev server — http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # ESLint
```

No test framework is configured.

## Directory Structure

```
src/
├── api/
│   ├── fetchProducts.js          # Real API client for product listing, detail, popular endpoints
│   ├── deliveryServices.js       # Nova Poshta (real), Meest/Delivery/InTime (mock) — 57 console.logs
│   ├── deliveryPriceService.js   # Client-side delivery price calculation
│   └── orderApi.js               # POST /store/orders, GET /store/orders/:id, GET /shop-orders
├── components/
│   ├── Carousel/                 # Product carousel with drag-to-scroll
│   ├── Cart/                     # CartSidePanel (with focus trap, portal, escape key), CartItemCompact
│   ├── CatalogFilters/           # Multi-criteria filters using MUI Chip + rc-slider
│   ├── CustomSelect/             # Styled dropdown
│   ├── DeliveryAutocomplete/     # City/warehouse search with debounce
│   ├── FAQ/                      # Accordion component
│   ├── MattressQuiz/             # 5-step recommendation wizard (size, hardness, weight, warranty, price)
│   ├── OrderDetailsModal/        # Order info display (hardcodes delivery as free)
│   ├── ProductCard/              # Card with wishlist button, lazy images, aria labels
│   ├── ProductGallery/           # Image gallery with thumbnails, keyboard nav, touch swipe
│   ├── SideAuthPanel/            # Auth panel — phone + code inputs, Google OAuth button
│   └── WishlistButton/           # Animated heart icon
├── contexts/
│   ├── auth/                     # AuthProvider, AuthContext, useAuth (mock + real modes)
│   ├── cart/                     # CartProvider — localStorage persisted
│   ├── quiz/                     # QuizProvider — modal visibility
│   ├── wishlist/                 # WishlistProvider — localStorage persisted
│   └── index.js
├── hooks/                        # useAuth, useCart, useQuiz, useWishlist (re-exports from contexts)
├── layout/
│   ├── Header.jsx                # Nav, cart badge, auth button, mobile hamburger menu
│   ├── Footer.jsx                # Links (some to nonexistent pages), social media (placeholder hrefs)
│   └── Layout.jsx                # Header + main + Footer + Quiz modal + scroll lock
├── pages/
│   ├── Home.jsx                  # Hero, categories, popular products carousel, benefits, FAQ
│   ├── Catalog.jsx               # Product grid + filters + URL-driven state + pagination
│   ├── Product.jsx               # Detail page with gallery, variants, tabs, mock reviews (1070 lines)
│   ├── Checkout.jsx              # Contact, delivery, payment forms (no <form> wrapper)
│   ├── OrderSuccess.jsx          # Confirmation page (reads localStorage "lastOrder")
│   ├── TrackOrder.jsx            # Order lookup by number
│   ├── Profile.jsx               # User info editing + order history
│   ├── Wishlist.jsx              # Wishlist display
│   ├── Contacts.jsx              # Contact info + form (setTimeout simulation)
│   └── NotFound.jsx              # 404
├── styles/
│   ├── _variables.scss           # Design system — colors, spacing, typography, shadows, breakpoints, z-index
│   ├── main.scss                 # Global styles (WARNING: user-select:none on most elements)
│   ├── layout/                   # _header.scss, _footer.scss
│   └── pages/                    # _home, _catalog, _product, _checkout, _profile, _contacts, _notfound
├── utils/
│   ├── checkoutValidation.js     # Form validation (fullName, phone, email, delivery, payment, terms)
│   ├── productLabels.js          # Shared Ukrainian translations for product attributes (type, hardness, fillers, etc.)
│   └── ScrollToTop.jsx           # Auto-scroll on PUSH/REPLACE navigation (not on POP)
├── data/
│   └── faqData.jsx               # FAQ content
├── assets/images/                # Hero images, certificates
├── App.jsx                       # Routes + provider nesting + dynamic basename for GitHub Pages
└── main.jsx                      # Entry point with GoogleOAuthProvider
```

## Key Patterns

### Provider Architecture
```
GoogleOAuthProvider → AuthProvider → WishlistProvider → CartProvider(currency="₴") → QuizProvider → Router → Layout
```

### URL-Driven Catalog State
All catalog filters stored in URL search params using English keys:
```
/catalog?types=spring,children&sizes=160х200&hardness=H3&price=0-15000&sort=price-asc&page=1
```
Supported params: `types[]`, `sizes[]`, `hardness[]`, `blockTypes[]`, `fillers[]`, `covers[]`, `height`, `maxWeight`, `price`, `sort`, `page`, `limit`. Default values are omitted from URL. Price max is dynamic (from backend API `maxPrice` field).

### Translation Architecture
Backend returns raw English keys for all attributes. Frontend translates via `src/utils/productLabels.js` which exports label maps (`TYPE_LABELS`, `HARDNESS_LABELS`, `BLOCK_TYPE_LABELS`, `COVER_TYPE_LABELS`, `FILLER_LABELS`) and a `t(labels, key)` helper.

### Mock vs Real API Mode
Controlled by `VITE_MOCK_AUTH` env var:
- `true` → Uses 20 hardcoded mock products from `fetchProducts.js`, mock auth (code "123456"), mock delivery
- `false` → Calls backend API at `VITE_API_URL`, sends `x-publishable-api-key` header, real JWT auth

API key is hardcoded in `fetchProducts.js:8` and `orderApi.js:9` (should be moved to env var).

### Cart Item Identity
Items are uniquely identified by `id + size + firmness` combo:
```javascript
items.find(i => i.id === item.id && i.size === item.size && i.firmness === item.firmness)
```
The `id` field is a composite string `"${product.id}-${variant.id}"` set in `Product.jsx:251`.

### Promo Codes
Frontend validates promo codes via backend API (`POST /store/promo-codes`). Backend handles percentage/fixed discounts, usage limits, date ranges, and minimum order amounts.

## Styling

### Design System (`_variables.scss`)
- **Colors:** Primary blue `#1e3a5f`, secondary red `#e63946`, neutral grays
- **Spacing:** 4px grid (`$spacing-0` through `$spacing-32`)
- **Typography:** Inter font, sizes `$font-size-xs` (12px) to `$font-size-6xl` (60px)
- **Borders:** `$radius-sm` to `$radius-full`
- **Shadows:** `$shadow-xs` to `$shadow-xl`
- **Breakpoints:** 320, 640, 768, 1024, 1280, 1440, 1620px
- **Z-index:** 0 to 700

### SCSS Usage
```scss
@use "./variables" as v;

.component {
  color: v.$color-text-primary;
  padding: v.$spacing-4;
  border-radius: v.$radius-card;

  @media (max-width: v.$breakpoint-md) {
    padding: v.$spacing-2;
  }
}
```

**Approach is desktop-first** (`max-width` queries), despite docs saying "mobile-first". 370+ media queries across 13 style files.

### Global Style Warning
`main.scss:80-86` sets `cursor: default !important` and `user-select: none` on `div, span, p, h1-h6, li, ul, ol, section, article, main, header, footer, nav, img, svg`. Users cannot select/copy text from most elements.

## Routes

| Path | Page | Auth Required | Notes |
|------|------|--------------|-------|
| `/` | Home | No | Hero, categories, popular products, benefits, FAQ |
| `/catalog` | Catalog | No | Product grid with URL-driven filters |
| `/product/:id` | Product | No | Detail with gallery, variants, tabs, reviews |
| `/checkout` | Checkout | No | Contact + delivery + payment (no empty cart guard) |
| `/order-success/:orderNumber` | OrderSuccess | No | Reads `lastOrder` from localStorage |
| `/track-order` | TrackOrder | No | Order lookup by number |
| `/profile` | Profile | Yes (redirect) | User info + order history |
| `/wishlist` | Wishlist | No | Wishlist display |
| `/contacts` | Contacts | No | Contact form (not connected) |
| `/*` | NotFound | No | 404 page |

**Dead routes linked in UI:** `/delivery` (Footer), `/terms` (Auth panel, Checkout), `/privacy` (Auth panel, Checkout), `/catalog?filter=discount` (Footer, `filter` param not handled)

## Auth Flow

### SMS (mock + real)
1. User enters 9 digits → frontend prepends `0` → sends `0XXXXXXXXX` to `POST /auth/send-code`
2. Backend stores 6-digit code with 5-min TTL (mock: logs to console, never sends SMS)
3. User enters 6-digit code → `POST /auth/verify-code` → JWT token returned
4. Token stored in `localStorage("authToken")`, user object in state
5. Mock mode: code `123456` always works; real dev backend: `123456` also works as bypass

### Google OAuth
1. `google.accounts.id.prompt()` opens One Tap or popup
2. Credential sent to `POST /auth/google` → backend verifies with Google library → JWT
3. No error handling for blocked popups — silently fails

### Session
- JWT in localStorage, 7-day expiry, no refresh mechanism
- Page load: `GET /auth/me` with bearer token to restore session
- Logout: client-side only (removes localStorage keys). Token remains valid server-side
- No cross-tab sync (no `storage` event listener)

### Profile page guard
`Profile.jsx:73-77` redirects to `/` via useEffect if `!isAuthenticated`, but fires before `checkAuth()` resolves. Users navigating directly to `/profile` get bounced.

## Build & Deployment

### Vite Config
- `base`: `/mattress-shop/` in production, `/` in development
- Output: `dist/`, assets in `assets/`, no sourcemaps, esbuild minification

### GitHub Actions (`deploy.yml`)
- Triggers on push to `main` or manual dispatch
- Node 20, `npm ci`, `npx --no-install vite build`
- **NO environment variables are set** — production build has no `VITE_API_URL`, no Google Client ID. The deployed site cannot communicate with any backend

### Favicon
`index.html:5` — MIME type says `image/svg+xml` but file is `heero-cat.png`

## Known Issues

See `docs/PROJECT-AUDIT-FULL.md` for the complete list with line numbers.

**Critical:**
- Header shows "Профіль" instead of user name (`user?.name` vs `user.firstName`)
- Product detail page will break with real API (grouped variants, missing `name` field)

**Fixed recently:**
- Cart now persisted to localStorage
- Quiz results now filter catalog correctly (sends English keys, includes price range)
- Home page category links fixed (correct `types=` param with English keys)
- Promo codes connected to backend API (no longer hardcoded)
- Translation architecture unified: backend sends English keys, frontend translates via `productLabels.js`
- Dynamic max price in catalog filters (no longer hardcoded 50000)

**118 console.log statements** across 15 files (57 in deliveryServices.js alone). Must be cleaned for production.
