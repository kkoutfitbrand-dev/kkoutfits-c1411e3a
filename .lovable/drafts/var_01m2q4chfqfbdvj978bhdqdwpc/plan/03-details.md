## Technical details

- Extend the staged `sale_campaigns` structure with a validated theme identifier. Keep public reads limited to the enabled campaign in its date window and admin writes protected by the existing admin-role policy.
- Applying a template performs one safe publish action: disable other campaigns, then create/update and enable the selected campaign. Clear, specific error messages replace the generic save failure.
- Add a shared campaign theme provider at the application level. It maps the active preset to semantic CSS variables and a theme class rather than scattering hardcoded colors across pages.
- Refactor campaign sections to use the shared theme tokens. Decorative motifs are lightweight CSS and icon treatments, responsive, and disabled when reduced motion is preferred.
- Use designed template artwork treatments by default; a custom uploaded image overrides them wherever a campaign banner appears.
- Keep percentage changes messaging-only. Existing product sale prices are not recalculated.

## Validation

- Verify the original save failure disappears after acceptance creates the storage.
- Test Apply Theme for Diwali and at least one retail campaign, including only-one-active behavior.
- Verify homepage, Shop, Sale, navigation accents, promotional sections, and footer accents switch together and revert when disabled.
- Check desktop and mobile layouts, uploaded-image override, scheduled/live/ended states, and admin-only writes.
- Run the project type check and inspect the live preview for console/network errors after the draft is accepted.
