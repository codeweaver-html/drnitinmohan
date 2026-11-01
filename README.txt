# KidsGastro SEO update package

## Contents
- `index.html`: updated homepage with en-IN language, revised H1/title/description, social preview metadata, Physician + MedicalClinic JSON-LD, skip-link fix, admin link removed, and expanded search-friendly clinic content.
- `treatments/` and `services/`: crawlable static category and individual topic pages.
- `sitemap.xml`: homepage, existing route pages and new detail pages.
- `robots.txt`: public crawling allowed; known private/admin paths disallowed.

## Deploy
Copy the contents of this folder into the root of the existing GitHub Pages repository, merging with the existing `assets/`, `configuration/`, scripts and other files. Do not delete existing assets/configuration folders. Keep the directory structure intact.

## Important checks before/after deployment
1. The original upload did not include the `/assets/` directory. The existing homepage already references `/assets/main%20pic.webp`; social preview metadata reuses that same image. Confirm it exists and ideally export a 1200x630 crop at that path for reliable social cards.
2. The original upload did not include existing social image binaries, so no asset filenames were renamed. All current references remain valid.
3. Confirm actual clinic hours and schema data with the practice before treating structured data as authoritative. The hours mirror the booking form schedule: Mon-Sat 09:00-14:00 and 16:00-18:00; Sun 10:00-14:00.
4. `robots.txt` cannot target a query parameter such as `/?admin=1`; the homepage sets `noindex,nofollow` when the `admin` query parameter is present and the public menu link is removed. The actual admin portal should still be protected with proper server-side authentication; client-side login code is not security.
5. Submit `https://drnitinmohan.com/sitemap.xml` in Google Search Console after deployment. Then inspect the homepage and sample child URLs with URL Inspection and Rich Results Test.
6. The content is informational and deliberately avoids promising procedures or outcomes. Have the clinician review all medical copy before publication.
