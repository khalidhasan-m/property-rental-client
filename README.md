# Nestora — Property Rental & Booking Platform

Nestora is a full-stack rental marketplace built for the Assignment 10 project. The client application helps **tenants** discover approved properties, save favourites, make booking requests, pay securely, and submit reviews. It also provides dedicated dashboards for **owners** to manage listings and earnings, and for **administrators** to moderate users, properties, bookings, and transactions.

## Project Details

The client is a **plain JavaScript/JSX** Next.js App Router application. It communicates with the Express API using credential-enabled Axios requests so the server can manage the JWT in an HTTP-only cookie. The interface is responsive, includes light and dark mode, and uses motion and confirmation dialogs for a polished user experience.

| Area | Included functionality |
| --- | --- |
| Property discovery | Animated banner, featured properties, location/type/price filters synced to the URL, sorting, and pagination. |
| Tenant features | Registration, login, Google sign-in, favourites, booking requests, Stripe payment, booking history, ratings, and reviews. |
| Owner features | Property submission with multi-image imgbb upload, listing edits, rejection feedback, booking decisions, earnings chart, and PDF report. |
| Admin features | Paginated users, properties, bookings, and transactions; role updates; property approval, rejection feedback, and deletion. |
| User experience | Tailwind CSS, HeroUI, Framer Motion, react-hot-toast, light/dark mode, copy-link sharing, WhatsApp sharing, loading states, and error recovery. |

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js App Router + JavaScript/JSX | Frontend framework and routing. |
| Tailwind CSS + HeroUI | Styling, responsive UI components, and modals. |
| React Hook Form + Zod | Form state and validation. |
| Axios + Context API | API communication and authentication state. |
| Framer Motion | Banner and property-card animation. |
| Stripe Elements | Custom reservation payment UI. |
| Recharts + jsPDF | Owner earnings chart and downloadable report. |
| next-themes | Light/dark theme switching. |

## Run Locally

### Prerequisites

Install Node.js 20 or newer and pnpm. Start the server repository first, because this client sends API requests to it.

```bash
git clone https://github.com/khalidhasan-m/property-rental-client.git
cd property-rental-client
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create `.env.local` using `.env.example` and set the following values.

| Variable | Example / purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api/v1` for local development. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable test key, beginning with `pk_test_`. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth web client ID for optional Google sign-in. |

## Available Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the development server. |
| `pnpm build` | Creates a production build. |
| `pnpm start` | Runs the production build locally. |

## Deployment

Deploy this repository to Vercel as a Next.js project. Add the environment variables in Vercel, then set `NEXT_PUBLIC_API_URL` to the deployed server URL ending in `/api/v1`. The server must allow this deployed client URL through its `CLIENT_URL` environment variable.
