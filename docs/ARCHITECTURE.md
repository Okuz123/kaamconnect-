# KaamConnect — Architecture

## Stack
- **Frontend + Backend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom brand tokens
- **Database**: PostgreSQL via Supabase (30 tables, RLS on everything)
- **Auth**: Supabase Auth (email/password + Google OAuth + phone OTP)
- **Storage**: Supabase Storage (portfolio images public, ID docs private)
- **Payments**: Razorpay (server-side order creation, HMAC signature verification, webhook idempotency)
- **i18n**: Dictionary-based, 5 languages (English, Hindi, Urdu, Dogri, Kashmiri), RTL for Urdu + Kashmiri

## Data Flow
1. **Auth** — Supabase Auth issues JWT; `lib/auth/useUser` fetches role from `users` table
2. **Role-based routing** — `middleware.ts` guards `/dashboard/*`, `/booking/*`, `/checkout/*`
3. **Worker search** — Server component queries `worker_profiles` + applies haversine filter for radius
4. **Booking lifecycle** — `bookings` table with strict status enum; every transition writes to `booking_status_history`
5. **Payments** — Client calls `/api/payments/create-order` → server recomputes amount → Razorpay order → signature verify on success → webhook for async events → `financial_ledger` append-only entries

## Security
- All money amounts recomputed server-side (never trust client)
- Payment signatures verified with HMAC-SHA256
- Webhooks idempotent (checked against `payment_transactions.provider_payment_id` unique)
- RLS policies enforce ownership on all private tables
- Service role key used only in server-side API routes

## Roles
- **customer** — search, book, pay, review
- **worker** — profile, availability, jobs, earnings
- **both** — both dashboards
- **manager** — block-level moderation (subset of admin)
- **admin** — full platform control
