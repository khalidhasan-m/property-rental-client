# Nestora Property Rental Client

This repository contains the frontend for Nestora, a property rental and booking platform. It is a **JavaScript/JSX Next.js application** built with the App Router. The client communicates with the separate Express API through Axios requests and sends credentials so the API can read its HTTP-only authentication cookie.

## Technology stack

| Technology | Version or configuration | Actual use |
|---|---:|---|
| Next.js | `16.3.2` | App Router, layouts, pages, navigation, optimized images, and Google fonts |
| React | `19.2.8` | UI components and client-side hooks |
| JavaScript and JSX | — | All application source is `.js` or `.jsx`; there is no TypeScript source |
| Tailwind CSS | `4` | Utility classes and global styling |
| HeroUI React | `2.6.14` | Buttons, inputs, selects, dialogs, tables, chips, and form controls |
| Axios | `1.19.0` | API client with `withCredentials: true` |
| React Hook Form | `7.86.0` | Registration, login, property, profile, and booking forms |
| Zod | `4.4.3` | Client-side form validation through `@hookform/resolvers` |
| Framer Motion | `13.1.1` | Hero, navigation, property-card, and review animations |
| Lucide React | `1.33.0` | Interface icons |
| React Hot Toast | `2.6.0` | Success and error notifications |
| next-themes | `0.4.6` | Light and dark theme switching |
| Recharts | `3.10.1` | Owner earnings area chart |
| jsPDF | `4.2.1` | Client-generated owner earnings report |
| Stripe React.js | `6.8.2` | Stripe Elements and `PaymentElement` checkout UI |
| Stripe.js | `9.14.0` | Loading the browser-safe Stripe publishable key |
| Google OAuth React | `0.13.5` | Rendering Google sign-in and sending the returned ID token to the API |
| pnpm | `11.21.0` | Package manager |

## Implemented client areas

The application contains public home and property-listing pages, an authenticated property-detail view, tenant booking and favourites pages, owner listing and booking-request pages, an owner analytics page, and admin pages for users, properties, bookings, and transactions.

The current client flows are:

1. A visitor can browse the home page and approved-property listing page.
2. The home page loads featured properties from `/properties/featured` and featured reviews from `/reviews/featured`.
3. Property-listing filters are stored in the URL and support location, free-text search through the API, property type, minimum price, maximum price, sort order, and pagination.
4. Property details require authentication. Unauthenticated visitors are redirected to `/login?redirect=/properties/:id`.
5. Tenants can submit a booking request, create a payment intent, complete Stripe payment, and confirm the payment with the API.
6. Tenants can save approved properties as favourites and submit or update reviews after a paid booking.
7. Owners can upload up to eight selected images as base64 data to the API, create listings, edit listings, review rejection feedback, and respond to booking requests.
8. Owners can view API-provided totals and twelve months of earnings and download a PDF report generated in the browser.
9. Administrators can view users, properties, bookings, and transactions, change user roles, moderate properties, edit properties, and delete properties.

## Main routes

| Route | Purpose |
|---|---|
| `/` | Home page, featured properties, featured reviews, and search form |
| `/properties` | Approved-property search, filtering, sorting, and pagination |
| `/properties/[id]` | Authenticated property details, favourites, reviews, and booking request |
| `/login` | Email/password login and optional Google sign-in |
| `/register` | Tenant or owner registration |
| `/payment/[propertyId]` | Stripe Elements payment flow for a booking |
| `/booking-success` | Payment-success confirmation page |
| `/dashboard/tenant/bookings` | Tenant booking history |
| `/dashboard/tenant/favorites` | Tenant saved properties |
| `/dashboard/owner` | Owner metrics, earnings chart, and PDF report |
| `/dashboard/owner/properties` | Owner property list and deletion |
| `/dashboard/owner/properties/add` | Owner property creation and image upload |
| `/dashboard/owner/properties/[id]/edit` | Owner property editing |
| `/dashboard/owner/booking-requests` | Owner booking decisions |
| `/dashboard/admin/users` | Admin user list and role changes |
| `/dashboard/admin/properties` | Admin property moderation and editing |
| `/dashboard/admin/bookings` | Admin booking list |
| `/dashboard/admin/transactions` | Admin transaction list |
| `/dashboard/profile` | Authenticated profile editing |

## API communication

The API helper is defined in `src/lib/api.js`. It creates an Axios instance with the following behavior:

- The base URL comes from `NEXT_PUBLIC_API_URL`, falling back to `http://localhost:5000/api/v1`.
- `withCredentials` is enabled so browser requests include the server's authentication cookie.
- Requests use `Content-Type: application/json`.
- API error messages are read from `error.response.data.message` when available.

The client does not store the JWT in local storage. The authentication context calls `/auth/me` when the application starts, and logout calls `/auth/logout` before clearing the local user state.

## Environment variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | API base URL, normally `http://localhost:5000/api/v1` locally. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe browser publishable key, normally beginning with `pk_test_` during development. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth web client ID. If absent, the Google sign-in control is not rendered. |

`NEXT_PUBLIC_SITE_URL` is not currently read by the client source and is therefore not included in the environment example.

## Local development

Start the server first because the client requires the API for authentication and data requests.

```bash
git clone https://github.com/khalidhasan-m/property-rental-client.git
cd property-rental-client
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The available scripts are:

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Start the production build. |

## Image configuration

`next.config.mjs` allows optimized remote images from `images.unsplash.com`, used for the home-page hero and fallback property images, and `i.ibb.co`, used for uploaded property images returned by the server's imgbb integration.

## Deployment

Deploy this repository as a Next.js project on Vercel. Configure the three client environment variables in the Vercel project. Set `NEXT_PUBLIC_API_URL` to the deployed API base URL ending in `/api/v1`, and configure the server's `CLIENT_URL` to the exact deployed frontend origin.

Use a real Stripe publishable key only in the appropriate Vercel environment. Never place Stripe secret keys, the imgbb API key, the MongoDB URI, or `JWT_SECRET` in this repository or in any `NEXT_PUBLIC_*` variable.

## Current implementation boundaries

This repository does not contain a database client, server-side authentication implementation, payment secret, image-hosting secret, or backend business logic. Those responsibilities belong to the companion [property-rental-server](https://github.com/khalidhasan-m/property-rental-server) repository.

The client source does not use Firebase, Supabase, Mongoose, Prisma, Redux, Zustand, GraphQL, Socket.IO, or a client-side JWT store. It uses the technologies listed above and the browser APIs required for file reading, clipboard copying, URL parameters, and opening a WhatsApp share link.

## Repository structure

```text
src/
├── app/                  Next.js App Router pages and layouts
├── components/           Shared UI, payment, property, review, and dashboard components
├── contexts/             React authentication context
└── lib/                  Axios API client and error helper
```

The frontend uses the `@/*` import alias, configured in `jsconfig.json` to point to `src/*`.

## Related repository

The backend API is maintained separately at [khalidhasan-m/property-rental-server](https://github.com/khalidhasan-m/property-rental-server).

## License

No license file is currently included in this repository.
