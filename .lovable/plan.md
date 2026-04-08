

## Plan: Add Summer Special Promotional Banner

### What We're Building
A new eye-catching promotional banner component (`SummerSpecialBanner`) placed between the MegaSaleBanner and SummerStyleGuide on the homepage. It will feature a split-layout design with animated gradient background, floating decorative elements, and a sleek parallax-inspired feel — matching the premium KKOutfits aesthetic.

### Design
- **Layout**: Full-width banner with a dark navy-to-sky gradient background, gold accent text, and a frosted-glass feature card on the right
- **Left side**: "Summer Specials" headline with animated gradient text, tagline, and 3 highlight chips (e.g. "New Arrivals", "Limited Edition", "Flat 40% Off")
- **Right side**: A glassmorphism card showing 3 key offers (Free Shipping, Premium Quality, Exclusive Styles) with icons
- **Animations**: Framer Motion entrance animations (staggered fade+slide), subtle floating sparkle particles, shimmer effect on CTA button, breathing glow on the accent border
- **CTA**: "Explore Summer Collection" button linking to `/shop`
- **Mobile**: Stacks vertically, card moves below text

### Files to Modify

1. **Create `src/components/SummerSpecialBanner.tsx`**
   - Dark gradient banner (slate-900 → sky-900 → amber hints)
   - Animated gradient headline text
   - 3 highlight badges with staggered animation
   - Glassmorphism offer card with icons (Truck, Shield, Gem)
   - Floating star particles (reuse pattern from MegaSaleBanner)
   - Shimmer CTA button
   - Fully responsive

2. **Modify `src/pages/Index.tsx`**
   - Import `SummerSpecialBanner`
   - Place it after `MegaSaleBanner` and before `SummerStyleGuide` wrapped in `ScrollReveal`

### Visual Style
- Colors: Deep navy (`slate-900`), sky blue accents, amber/gold highlights, white text
- Typography: Bold, uppercase tracking for headers
- Professional, premium fashion e-commerce feel with subtle motion

