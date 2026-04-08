

## Plan: Replace Valentine's Theme with Summer Collection 2026

Since it's April 2026, Valentine's Day is long past. We'll replace all Valentine's-themed components with a fresh, professional **"Summer Style Collection"** theme — clean, modern, and season-appropriate.

### What Changes

**Remove/Replace these Valentine components:**
- `ValentineFloatingHearts` → Replace with subtle floating sparkle/sun particles
- `ValentineCountdownBanner` → Replace with a **Summer Sale countdown banner** (gold/amber gradient)
- `ValentineGiftGuide` → Replace with **Summer Style Guide** (Beach, Casual, Formal, Party categories)
- `ValentineLoveQuotes` → Replace with **Style Tips carousel** (fashion quotes/tips)
- `MegaSaleBanner` → Re-theme from hearts/pink to a sleek summer gradient (sky blue to amber)
- `ValentineCoupleSection` → Remove from homepage (already commented out)
- `HeartConfetti` → Replace with a **sparkle/star confetti** effect

**Color Palette Change:**
- From: Rose/pink/red hearts
- To: Sky blue, amber/gold, warm white — clean summer feel

### Files to Modify

1. **`src/hooks/useValentineCountdown.ts`** → Rename to `src/hooks/useSummerCountdown.ts`
   - Target date: June 1, 2026 (Summer Sale launch)
   - Same countdown logic, new naming

2. **`src/components/ValentineCountdownBanner.tsx`** → Rewrite as `src/components/SummerSaleBanner.tsx`
   - Gradient: sky-500 → amber-500
   - Icons: Sun, Sparkles, ShoppingBag instead of Heart, Gift
   - Text: "Summer Sale — Up to 50% Off"

3. **`src/components/ValentineGiftGuide.tsx`** → Rewrite as `src/components/SummerStyleGuide.tsx`
   - Categories: "Beach Vibes", "Smart Casuals", "Formal Elegance", "Party Wear"
   - Clean, modern card design with gradient accents
   - Links to shop/trending pages

4. **`src/components/ValentineLoveQuotes.tsx`** → Rewrite as `src/components/StyleTipsCarousel.tsx`
   - Fashion/style quotes instead of love quotes
   - Neutral elegant design (dark background, gold accents)

5. **`src/components/ValentineFloatingHearts.tsx`** → Rewrite as `src/components/FloatingParticles.tsx`
   - Subtle floating dots/sparkles instead of hearts
   - Light, professional feel

6. **`src/components/MegaSaleBanner.tsx`** → Re-theme
   - Remove heart decorations, rose gradients
   - Summer gradient (sky blue to warm amber)
   - "Summer Collection 2026" branding
   - Sun/sparkle decorations instead of hearts
   - Navigate to `/shop` instead of `/valentine-collection`

7. **`src/components/HeartConfetti.tsx`** → Rewrite as `src/components/StarConfetti.tsx`
   - Star/sparkle particles instead of hearts
   - Gold/amber/white color palette

8. **`src/pages/Index.tsx`** → Update imports
   - Swap all Valentine imports for new Summer components
   - Clean, professional layout order

9. **`src/App.tsx`** → Remove `/valentine-collection` route (optional, can keep as redirect to `/shop`)

### Design Direction
- Professional, clean, modern e-commerce feel
- No seasonal gimmicks — just polished promotional sections
- Subtle animations (no floating hearts everywhere)
- Color scheme: deep navy, sky blue, amber gold, clean white

