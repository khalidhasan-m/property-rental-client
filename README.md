# Nestora — Property Rental & Booking Platform (Client)

**Nestora** is a plain JavaScript and JSX Next.js App Router frontend for a property rental marketplace. It helps tenants find and book moderated rental properties while giving owners and administrators dedicated role-based workspaces.

## Live URL

Add the Vercel client deployment URL after deployment: `https://property-rental-client.vercel.app`

## Key Features

| Area | Included capabilities |
| --- | --- |
| Discovery | Animated landing page, search, backend-driven location and property-type filters, price sorting, URL-synchronised filters, responsive property grid, and pagination. |
| Authentication | Secure cookie-session restoration, registration, login, logout, tenant/owner roles, and Google OAuth sign-in when client credentials are configured. |
| Tenant workspace | Property details, favorites, reservation booking, Stripe Elements payment, booking tracking, profile editing, ratings, and reviews. |
| Owner workspace | Analytics cards, twelve-month earnings chart, PDF earnings report, imgbb multi-image property upload, listing edits, rejection feedback, and booking decisions. |
| Admin workspace | Paginated user, property, and transaction tables; role changes; property approval or rejection feedback; and booking monitoring. |
| Experience | Responsive dark/light theme, Framer Motion entrances, toast feedback, HeroUI confirmation dialogs, copy link plus WhatsApp property sharing, loading states, and error-safe empty states. |

## Technology

| Package / tool | Purpose |
| --- | --- |
| Next.js App Router + JavaScript/JSX | Application framework and routing. |
| Tailwind CSS + HeroUI | Responsive styling, inputs, buttons, tables, and confirmation modals. |
| React Hook Form + Zod | Accessible forms and client validation. |
| Axios | Cookie-enabled API communication. |
| Context API | Restored authentication state across routes. |
| Framer Motion | Landing and property-card animation. |
| next-themes | Dark/light theme switching. |
| Stripe Elements | Secure reservation payment form. |
| Recharts | Owner monthly earnings visualisation. |
| jsPDF | Downloadable owner monthly earnings report. |
| @react-oauth/google | Google OAuth client sign-in. |

## Local Setup

1. Copy `.env.example` to `.env.local` and set the public values.
2. Install dependencies with `pnpm install`.
3. Start the development server with `pnpm dev`.
4. Open `http://localhost:3000`.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Public URL of the Express API, including `/api/v1`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe test or live publishable key. |
| `NEXT_PUBLIC_SITE_URL` | Deployed client origin. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth web client ID. |

## Deployment

Deploy this repository to Vercel as a Next.js project. Set all variables from `.env.example` in the Vercel project settings. Set `NEXT_PUBLIC_API_URL` to the deployed backend API URL ending in `/api/v1`; configure the server `CLIENT_URL` to the deployed client URL so cross-origin cookie requests are permitted.
