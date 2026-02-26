

## Plan: Infinite Scrolling Promo Ticker Banner (Admin-Controlled)

### What This Feature Does
Adds a horizontally scrolling marquee/ticker banner at the very top of the site (above the navigation), similar to the reference image. It will display promotional messages like "FAST DELIVERY", "24/7 CUSTOMER SUPPORT", "GRAND SALE!", "4.4/5 FROM 690+ REVIEWS", etc. The content will be managed by admins from the admin settings page.

### Architecture

**Database**: Create a new `promo_ticker_items` table in Supabase with columns:
- `id` (uuid, PK)
- `text` (text, required) — the message to display
- `emoji` (text, nullable) — optional emoji shown before text
- `is_active` (boolean, default true)
- `display_order` (integer, default 0)
- `created_at` / `updated_at` (timestamps)

**Frontend Components**:

1. **`src/components/PromoTicker.tsx`** — The infinite scrolling marquee banner
   - Fetches active ticker items from Supabase, ordered by `display_order`
   - Uses pure CSS `@keyframes marquee` animation for smooth infinite scroll (duplicates the list twice for seamless looping)
   - Purple/dark gradient background matching the reference image style
   - Items separated by decorators (dots or pipes)
   - Falls back to hardcoded defaults if no DB items exist (Fast Delivery, 24/7 Support, Grand Sale, 4.4/5 Reviews, Free Returns, etc.)

2. **Admin Settings page update** (`src/pages/admin/Settings.tsx`) — Add a "Promo Ticker" management card
   - List all ticker items with text, emoji, active toggle, and order
   - Add/edit/delete ticker items via inline form
   - Toggle items active/inactive
   - Reorder items

**Integration Points**:
- `src/pages/Index.tsx`: Add `<PromoTicker />` as the very first element, before `<Navigation />`
- `src/integrations/supabase/types.ts`: Will need updating after migration (can use `.from('promo_ticker_items' as any)` workaround)
- New Supabase migration for the table + RLS policies (public read, admin write)

### CSS Animation Approach
Uses a pure CSS `marquee` keyframe that translates `-50%` horizontally on a doubled list, creating seamless infinite scroll without JavaScript timers. This is performant and smooth.

### Default Ticker Items (if no DB data)
- 🚚 FAST DELIVERY
- 📞 24/7 CUSTOMER SUPPORT
- 🔥 GRAND SALE!
- ⭐ 4.4/5 FROM 690+ REVIEWS
- 💰 BEST PRICE GUARANTEE
- 🔄 EASY RETURNS

### Files to Create/Modify
1. **Create** `supabase/migrations/[timestamp]_create_promo_ticker.sql` — table + RLS
2. **Create** `src/components/PromoTicker.tsx` — marquee component
3. **Modify** `src/pages/Index.tsx` — add PromoTicker above Navigation
4. **Modify** `src/pages/admin/Settings.tsx` — add ticker management UI
5. **Modify** `src/index.css` — add marquee keyframe animation

