# KaamConnect

**Local Skills. Real Work. One Platform.**

A production-oriented skilled-worker hiring marketplace for Jammu & Kashmir and all of India.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage + RLS)
- Razorpay (sandbox-first payments)
- OpenStreetMap / configurable geocoding

## 90-Day Build Plan
- Week 1-2  Foundation: database, auth, RBAC, layouts
- Week 3-4  Core: worker onboarding, customer registration, job requests, bookings
- Week 5-6  Location: J&K districts, 3 km geospatial search
- Week 7-8  Payments: Razorpay sandbox, payout accounts, commission ledger
- Week 9-12 Polish: 5 languages + RTL, admin dashboard, notifications, tests

## Setup
npm install
cp .env.example .env.local
npm run dev

## External Credentials Required
- Supabase URL + anon key + service role key
- Razorpay key ID + secret + webhook secret
- SMS / OTP provider (optional)
- Email provider (optional)
- Maps API key (optional)

## License
MIT
