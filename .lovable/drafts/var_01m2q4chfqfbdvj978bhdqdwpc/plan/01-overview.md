# Plan: Reusable Big Sale Campaign Management

## Goal

Replace the current Summer Sale campaign with Big Sale across the customer-facing store, while making future campaigns such as Diwali Sale or New Year Sale editable from the Admin Panel without code changes.

The campaign percentage will control messaging only. Existing product-level sale prices will remain unchanged.

## Confirmed current state

- Sale copy, 50% values, seasonal labels, countdown dates, and campaign presentation are hardcoded across the homepage and Shop page.
- The countdown hook uses a fixed June 1, 2026 date and is not connected to admin settings.
- Admin Settings currently manages only promo ticker items and ticker speed.
- `site_settings` is a public-readable, admin-writeable key/value table, but it does not contain campaign fields.
- Admin access is protected in the UI and by the existing `has_role(..., 'admin')` RLS pattern.
- The existing public `product-images` bucket supports admin uploads and public image display.

## Product behavior

- Add a reusable Sales area to the Admin Panel with a list of campaigns and create/edit controls.
- Each campaign can store its name, enabled state, messaging percentage, title, subtitle, promotional text, start/end date and time, and optional banner image.
- The storefront displays the enabled campaign whose date window is active. If no campaign is active, sale-specific sections are hidden or show the neutral store experience.
- Admins can save changes and see them reflected on the public site on the next data refresh, without changing code.
- The percentage updates headings, badges, and promotional copy only; it does not recalculate product prices.
- Start with a polished Big Sale campaign and default banner artwork. If no image is supplied, the campaign layout remains fully usable from its editable fields.
