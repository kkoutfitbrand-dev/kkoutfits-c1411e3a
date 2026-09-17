## Storefront changes

- Introduce one shared campaign data loader and countdown calculation based on the active campaign’s start and end timestamps.
- Replace Summer-specific content in the live sale surfaces with campaign-driven content:
  - Homepage main sale banner
  - Sale countdown/stat strip
  - Sale promotional call-to-action section
  - Shop-page sale banner
  - Sale page heading, supporting copy, and sale badge
- Remove hardcoded Summer Sale / Summer Collection wording, fixed 50% values, and fixed campaign dates from those surfaces.
- Keep product pricing logic as-is, including product-level `variants.sale_price_cents` values.
- Reuse one campaign-aware presentation component so future sale names and copy render consistently across the site.
- Preserve unrelated seasonal merchandising content unless it is part of the current sale messaging.

## Admin Panel changes

- Add a dedicated Sales navigation item and `/admin/sales` page under the existing admin route guard.
- Add a validated sale form for required text, percentage range, image, and date values.
- Support creating, editing, enabling/disabling, and deleting campaigns.
- Show campaign status clearly: draft/disabled, scheduled, live, or ended.
- Support banner image selection through the existing admin-only image storage flow, with preview and replacement behavior.
- Provide a sensible default Big Sale campaign so the initial setup is immediately usable.
- Keep all admin mutations protected by database RLS, not only client-side navigation checks.

## Data and security

- Stage an additive migration after approval for a dedicated campaign table rather than overloading ticker settings with unrelated keys.
- Allow public reads only for currently usable campaign data, while allowing authenticated admins to view and manage all campaigns.
- Grant table access explicitly to the roles used by the policies, including `service_role`, and apply the existing `has_role(..., 'admin')` policy pattern.
- Add an index supporting enabled/date-window lookups and a safe selection rule so multiple campaigns cannot unexpectedly publish together.
- Update generated database types through the normal Supabase type flow; do not hand-edit the generated types file.
- The schema change will be staged for application when the draft is accepted; it will not alter the live database during planning.

## Validation

- Confirm every customer-facing Summer Sale string and fixed sale value is replaced or intentionally retained as unrelated seasonal content.
- Test an admin creating Big Sale, editing its copy, percentage, dates, enabled state, and image.
- Test scheduled, live, ended, and disabled campaign states on the homepage, Shop page, and sale page.
- Confirm a public visitor can read the active campaign but cannot write or view admin-only campaign data.
- Confirm changing the campaign percentage changes promotional messaging only and leaves product prices unchanged.
- Verify the initial Big Sale campaign and generated/default artwork render on desktop and mobile layouts.
