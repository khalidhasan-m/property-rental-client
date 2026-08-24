# Nestora Property Rental — Client

Nestora is a property rental and booking marketplace frontend. Tenants can discover approved rental properties, save favourites, submit booking requests, pay reservation fees through Stripe, and review their booking activity. Owners can create and manage property listings, review booking requests, and monitor earnings. Administrators can manage users, moderate listings, monitor bookings, and inspect transactions.

This repository contains the **Next.js client application**. The backend API is maintained separately in [`property-rental-server`](https://github.com/khalidhasan-m/property-rental-server).

## Project links

| Item | Link or value |
|---|---|
| Client repository | [`khalidhasan-m/property-rental-client`](https://github.com/khalidhasan-m/property-rental-client) |
| Server repository | [`khalidhasan-m/property-rental-server`](https://github.com/khalidhasan-m/property-rental-server) |
| Frontend live URL | **Add the deployed frontend URL here before submission.** |
| Local frontend URL | `http://localhost:3000` |
| Local API URL | `http://localhost:5000/api/v1` |

## Features

The client includes a public landing page, approved-property search, backend-powered filtering and sorting, pagination, authenticated property details, tenant favourites, booking and Stripe checkout, booking-success confirmation, tenant bookings, owner property management, owner booking decisions, owner analytics, monthly earnings PDF download, admin user management, admin property moderation, admin booking monitoring, transaction monitoring, Google sign-in, JWT-cookie session restoration, loading and error views, responsive layouts, and light/dark theme switching.

## Technology stack

| Technology | Version or use |
|---|---|
| Next.js | `16.3.2`, App Router |
| React | `19.2.8` |
| JavaScript/JSX | Application source language |
| Tailwind CSS | `4`, utility-first styling |
| HeroUI React | Form controls, buttons, dialogs, tables, chips, and selects |
| Axios | API requests with credentials enabled |
| React Hook Form and Zod | Form state and validation |
| Framer Motion | Hero, navigation, property-card, reviews, and extra section animations |
| Canvas API | Client-side image compression (auto-resize and quality reduction) before upload |
| Recharts | Owner earnings visualization |
| Stripe React.js and Stripe.js | Stripe Elements checkout |
| Google OAuth React | Google sign-in UI |
| jsPDF | Owner earnings report generation |
| next-themes | Light/dark theme switching |
| Lucide React | Interface icons |
| React Hot Toast | Success and error notifications |
| npm | Package manager |

## Main routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page, search, featured properties, reviews, and extra content |
| `/properties` | Public | Approved-property search, filters, sorting, and pagination |
| `/properties/[id]` | Authenticated | Property details, favourites, reviews, and booking request |
| `/login` | Public | Email/password and optional Google sign-in |
| `/register` | Public | Tenant or owner account registration |
| `/payment/[propertyId]` | Tenant | Stripe Elements payment flow |
| `/booking-success` | Authenticated | Payment-success confirmation |
| `/dashboard/tenant/bookings` | Tenant | Booking history and payment statuses |
| `/dashboard/tenant/favorites` | Tenant | Saved properties and remove action |
| `/dashboard/owner` | Owner | Analytics, earnings chart, and PDF download |
| `/dashboard/owner/properties` | Owner | Owner listing table, status, update, and delete |
| `/dashboard/owner/properties/add` | Owner | Create a property listing and upload images |
| `/dashboard/owner/properties/[id]/edit` | Owner | Update an owned property |
| `/dashboard/owner/booking-requests` | Owner | Approve or reject booking requests |
| `/dashboard/admin/users` | Admin | View users and change roles |
| `/dashboard/admin/properties` | Admin | Approve, reject, update, or delete properties |
| `/dashboard/admin/bookings` | Admin | Monitor booking activity |
| `/dashboard/admin/transactions` | Admin | View successful payment transactions |
| `/dashboard/profile` | Authenticated | Update profile name, phone, and photo URL |

## Requirements

Use **Node.js 20 or newer** and npm. Verify the installed versions before starting:

```bash
node --version
npm --version
```

Clone the repository and install dependencies:

```bash
git clone https://github.com/khalidhasan-m/property-rental-client.git
cd property-rental-client
npm install
```

The backend should be running before testing authenticated pages or API-backed data. Create the local client environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with the values below:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | API base URL, normally `http://localhost:5000/api/v1` locally. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Browser-safe Stripe publishable key. Use a test key during development. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth web client ID. If omitted, the Google button is not rendered. |

Never put `STRIPE_SECRET_KEY`, `MONGODB_URI`, `JWT_SECRET`, or `IMGBB_API_KEY` in this repository or in any `NEXT_PUBLIC_*` variable. Local environment files are ignored by Git.

## Development commands

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create and validate a production build. |
| `npm run start` | Start the previously built production application. |

For a production-style local check:

```bash
npm run build
npm run start
```

## Backend integration

The Axios client is defined in `src/lib/api.js`. It reads `NEXT_PUBLIC_API_URL`, sends JSON requests, and enables `withCredentials` so the backend can read the HTTP-only `accessToken` cookie. The client restores the current account by calling `/auth/me` when the application starts; it does not store the JWT in local storage.

Start the companion server in a separate terminal before using authentication, favourites, booking, payment, reviews, analytics, or admin pages:

```bash
cd ../property-rental-server
npm install
cp .env.example .env
npm run dev
```

## Image configuration

`next.config.mjs` allows optimized remote images from `images.unsplash.com` and `i.ibb.co`. The home-page hero and fallback images use Unsplash. Owner-uploaded images are returned by the server’s ImgBB integration and are served from `i.ibb.co`.

## Testing and acceptance checks

The client production build is the primary automated client check:

```bash
npm run build
```

Before deployment or submission, test the following manually in a clean browser session:

- Registration with both permitted account roles, validation errors, duplicate email handling, and photo URL validation.
- Email/password login, Google sign-in when configured, logout, session restoration, and hard reloads on private routes.
- Tenant favourites, booking modal validation, Stripe test payment, booking-success redirect, bookings table, and review submission after a paid booking.
- Owner property creation, image upload, editing, status display, rejection-feedback viewing, booking decisions, analytics, chart, and PDF download.
- Admin users, role changes, property moderation, rejection feedback, bookings, and transactions.
- Public property search by location, type, minimum price, maximum price, sorting, combined filters, no-result states, and pagination.
- Mobile, tablet, and desktop layouts, including tables, dialogs, forms, charts, navigation, loading views, error views, and dark/light themes.
- Direct navigation and hard reload of every route without blank pages, broken chunks, CORS errors, or incorrect redirects.

## Deployment

To deploy this project to Vercel:

1. Push your code to a GitHub repository.
2. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
3. Click "Add New..." and select "Project".
4. Import your repository.
5. In the "Environment Variables" section, add the following variables:
   - `NEXT_PUBLIC_API_URL`: Your production backend URL (e.g., `https://api.yourdomain.com/api/v1`).
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
6. Click "Deploy".
7. Once finished, ensure your backend server's `CLIENT_URL` environment variable is updated to match your new Vercel deployment URL to prevent CORS issues.

## Repository structure

```text
src/
├── app/                  Next.js App Router pages and layouts
├── components/           Shared UI, payment, property, review, and dashboard components
├── contexts/             React authentication context
└── lib/                  Axios API client and error helper
public/                   Static assets
.env.example              Safe environment-variable template
package.json              npm scripts and dependencies
package-lock.json         npm lockfile
```

## Security notes

The client relies on the server for real authentication and authorization. Hiding dashboard navigation is not a security boundary; all protected operations must continue to be enforced by the backend. Do not commit environment files, credentials, payment secrets, database URLs, or generated private keys.

## License

No license file is currently included in this repository.
