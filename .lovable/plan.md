# Plan: Realistic Event Banners, Animated Hero, and Full Site Theme — Mobile First

## Overview
When an admin applies an event theme (Diwali, Eid, Pongal, New Year, Big Sale, etc.), the whole site transforms: realistic photographic banners appear across multiple pages, the hero gets a premium editorial redesign with animation, and all sections follow the event's colours. Everything is designed mobile-first (390px priority), scaling up to desktop.

## 1. Realistic Event Image Banners (AI-generated, stored in project)

Six realistic fashion-photography banner images already created:
- `campaign-diwali.jpg` + `campaign-diwali-detail.jpg` (festive, lamps, rich fabric)
- `campaign-eid.jpg` (elegant emerald/gold occasion wear)
- `campaign-evening.jpg` (generic evening retail event)

New images to generate (realistic fashion photography, no text baked in so admin text overlays cleanly):
- Pongal, Holi, Navratri, Independence Day, Black Friday, New Year, Clearance/End-of-Season (7 more)
- Each theme preset in `saleThemes.ts` gets two image fields: `heroImage` (large banner) and `cardImage` (smaller promo placement).

## 2. Hero Redesign (HeroCarousel.tsx)
- Editorial magazine look: bold oversized display headline (Outfit font), thin accent underline, staggered line-by-line reveal animation
- Campaign-aware: when a sale campaign is live, the hero shows the event's realistic banner image, name, discount, and CTA; otherwise the default store hero
- Subtle Ken Burns slow-zoom on the image, floating event motif particles (diya sparkles for Diwali, colour dots for Holi, stars for New Year)
- Mobile-first: full-bleed image, bottom-anchored text, large tap targets, safe-area padding

## 3. Event Banners Across Pages
New `EventPromoBanner.tsx` (small/medium variants) driven by the active campaign:
- **Homepage**: full-width cinematic banner after hero (already SaleCampaignBanner — upgraded to realistic image + better animation), a mid-page promo strip between Categories and Trending, and the bottom CTA
- **Shop page**: slim event banner above the product grid
- **Sale page**: hero uses the event's realistic image
- **Category page**: compact event ribbon banner at top
- All disappear automatically when no campaign is active.

## 4. Richer Theming and Animation
- Extend SaleThemeContext to also set hero image, motif particles, and banner style per event
- Theme-specific CSS animations per event (glow flicker for Diwali, confetti drift for Holi, snowfall shimmer for New Year) — pure CSS/Framer Motion, disabled under reduced-motion
- Smooth theme transition (colour fade) when admin switches events

## Files
**Modify:**
- `src/lib/saleThemes.ts` — add heroImage/cardImage + motif animation type per preset
- `src/components/HeroCarousel.tsx` — editorial redesign, campaign-aware
- `src/components/SaleCampaignBanner.tsx` — realistic image treatment, layered animation
- `src/contexts/SaleThemeContext.tsx` — expose images/motif
- `src/pages/Shop.tsx`, `src/pages/Sale.tsx`, `src/pages/CategoryPage.tsx`, `src/pages/Index.tsx` — place EventPromoBanner
- `src/index.css` — theme keyframes (glow, drift, shimmer)

**Create:**
- `src/components/EventPromoBanner.tsx` — reusable responsive promo banner
- ~7 new banner images in `src/assets/`

## Technical Notes
- No new dependencies; Framer Motion + CSS only
- All images are local imports (fast, no external URLs)
- Mobile-first at 390px; every banner tested at mobile and desktop widths
- No backend/database changes needed — uses the existing `sale_campaigns` table and theme presets

## Validation
- Apply Diwali via Admin > Sales, confirm hero + homepage + Shop + Sale + Category banners all switch
- Switch to Big Sale, confirm everything reverts
- Check mobile (390px) and desktop layouts, reduced-motion behaviour, and run type check
