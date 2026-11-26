# Abu Aitah website

The original 13-page Bootstrap website migrated to Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, and next-intl.

## Development

Use Node.js 20.9 or later, preferably an active LTS release.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/ar` or `http://localhost:3000/en`. The root URL selects a supported language with Arabic as the fallback.

```sh
npm run build
npm start
npm run typecheck
```

## Structure

- `src/app/[locale]`: localized pages and shared layout.
- `src/messages/ar` and `src/messages/en`: matching `common.json`, `landing.json`, and `pages.json` translations.
- `src/i18n`: next-intl configuration and localized navigation helpers.
- `src/assets/website.ts`: website image imports.
- `src/assets/gallery.ts`: gallery image imports.
- `src/assets/index.ts`: named exports and the combined `images` registry.
- `src/assets/images`: all 48 original images, statically imported for Next.js image optimization.
- `src/assets/fonts`: self-hosted Expo Arabic (400, 600, 700) and Roboto (400, 700).
- `src/components/ui`: CLI-installed shadcn components adapted for the brand, RTL, translated close labels, and reduced motion.
- `src/app/globals.css`: brand colors, typography, and tokens.

Use the central asset export:

```tsx
import Image from 'next/image';
import {images} from '@/assets'; // src/assets/index.ts

<Image src={images.mainLogo.png} alt="Abu Aitah" />
```

Add new images to `website.ts` or `gallery.ts`; `index.ts` combines their values. `src/app/icon.png` is the Next.js metadata icon derived from the original logo.

Tailwind uses the latest CSS-first setup with `@tailwindcss/postcss`. Theme tokens and the Tailwind import live in `src/app/globals.css`; there is no JavaScript theme configuration or Sass. Component styling uses Tailwind utilities. Animations use `tw-animate-css`.

Add shadcn components with `npx shadcn@latest add <component>`. Both fonts ship locally.

## Routes

All routes have `/ar` and `/en` prefixes. Original `.html` URLs permanently redirect to the corresponding Arabic routes. Switching language preserves the route and search query.

| Original page | Route without locale prefix |
| --- | --- |
| `index.html` | `/` |
| `aboutus.html` | `/about` |
| `products.html` | `/products` |
| `events.html` | `/events` |
| `eventdetails.html` | `/events/palestinian-industries` |
| `gallery.html` | `/gallery` |
| `jobs.html` | `/jobs` |
| `jobdetails.html` | `/jobs/field-marketing` |
| `applyjob.html` | `/jobs/field-marketing/apply` |
| `contactus.html` | `/contact` |
| `search.html` | `/search?q=...` |
| `offer.html` | `/offers` |
| `jobnotifiction.html` | `/job-notification` |

The news cards also have individual detail routes.

## Content and forms

The original project contained repeated placeholder product cards and no submission service. The catalogue preserves all 25 entries and their categories; unnamed entries use neutral catalogue labels. Images and contact details come from the original project. News, jobs, and promotions retain their historical context. The 2022 vacancy is marked closed.

Product filters/dialogs, news sorting, gallery tabs/lightboxes, site search, mobile navigation, sharing, file validation, and form validation work locally. The original repository has no video files, so that gallery tab displays an empty state.

Contact and newsletter forms explain that delivery is not connected. They validate locally and display a preview acknowledgement without sending or storing information. Connect a server-side mail/subscription provider before accepting submissions. The archived job form accepts no submissions.

## Admin preview

Open `/en/admin/login` or `/ar/admin/login`. The credentials card provides the public demo account (`admin@abuaitah.ps` / `Admin123!`) and an autofill button. Successful sign-in opens `/en/admin` or `/ar/admin` with content counts, preview links, a responsive sidebar, language switching, and sign-out.

The dashboard manages products, news, gallery albums, careers, and office/distributor contact details. Each section has searchable, filterable, paginated tables; dedicated detail, add, and edit routes; delete confirmations; and published/featured switches. Page settings manage each public page's heading, introduction, and cover, plus the contact form heading and message types.

Editors share Formik/Yup validation and English/Arabic tabs. Required English fields are validated; Arabic overrides are optional. Empty Arabic fields resolve from English per field, including after later English changes. Existing records are seeded from the public catalogue, translations, archive, and contact information. Historical careers remain closed.

Media managers accept multiple image/video uploads without a fixed file count, with collapsible sections, cover selection, ordering, alternative text, captions, removal, and expandable previews. Supported formats are JPG, PNG, WebP, GIF, AVIF, MP4, WebM, and OGV. Browser storage capacity and browser codec support still apply.

Records and uploaded Blobs persist in IndexedDB (`abuaitah-content-workspace`) in the current browser. Clearing site data removes them. The public website still uses its bundled content; dashboard edits do not change public pages yet. Contact enquiries and job applications are not received by the dashboard.

This is a frontend demonstration. Session state lives in `sessionStorage` for the current tab; it is not authentication or access control. Replace `src/lib/admin-demo.ts` and the client session checks with server authentication and authorization when adding the backend. Replace the storage adapter in `src/lib/admin/storage.ts` with API operations and a media upload service; keep the record types, section definitions, and shared dashboard components.

Management routes are `/[locale]/admin/{products,news,gallery,careers,contact}`, with `/new`, `/settings`, `/[id]`, and `/[id]/edit` subroutes.

## Verification commands

```sh
npx playwright install chromium
npm run build
npm test
```

To use installed Microsoft Edge on Windows:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm test
```

The suite covers both locales, every migrated route, missing pages, legacy redirects, 375/768/1440px layouts, fonts, mobile navigation, product filtering, dialogs, search, contact validation, and archived application uploads. Screenshots are saved to the ignored `test-results` directory.

The requested Vercel agent skills and UI/UX Pro Max skill were already installed in the local Codex skill directory and verified during migration. They are available in subsequent turns.
