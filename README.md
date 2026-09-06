# SmileCare Dental Website

Professional one-page dental practice website upgraded from the enhancement blueprint. The site is static HTML/CSS/JS, with Supabase used for appointment request storage.

## What Changed

- Premium brand system using navy, blue, teal, and warm gold.
- Stronger hero with review proof, emergency CTA, live open/closed status, and quick slot selection.
- Service cards with photos, visit expectations, pricing hints, and direct booking actions.
- Smile quiz that routes patients to the right service.
- Doctor cards with richer credentials and "Book with this doctor" actions.
- Testimonials, certifications, and before/after proof section.
- Filterable facilities gallery.
- Four-step patient journey with CTAs on every step.
- FAQ, financing/insurance messaging, WhatsApp link, sticky mobile action bar, and structured SEO data.
- Supabase-backed appointment form with local fallback until credentials are configured.

## Files

- `index.html` - Website structure and SEO schema.
- `styles.css` - Responsive visual system and component styling.
- `script.js` - Navigation, booking modal, testimonials, gallery filters, status logic, and Supabase insert.
- `supabase/schema.sql` - Database table, indexes, and RLS policies for appointments.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. In `script.js`, replace:

```js
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

4. Confirm that `appointments` receives rows after submitting the website booking form.

The public anon role can only insert new website appointment requests. Reading and updating appointments is reserved for authenticated users.

## Run Locally

Open `index.html` directly in a browser. No build step is required.

Some external assets use CDNs, so an internet connection is needed for fonts, icons, gallery lightbox, Supabase client, maps, and hosted images.

## Production Notes

- Replace placeholder phone, WhatsApp, social, and map details with the real clinic information.
- Replace stock photos with real clinic/team photography when available.
- For full scheduling, connect available slots to a staff calendar or Supabase `availability` table.
- Add SMS, WhatsApp, and email reminders through Supabase Edge Functions or a messaging provider.
