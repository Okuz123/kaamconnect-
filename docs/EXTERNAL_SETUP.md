# KaamConnect — External Services Setup

KaamConnect is a real application. To make auth, database, and payments work, you must configure these services.

## 1. Supabase (Database + Auth + Storage)

1. Create a free project at https://supabase.com
2. Project Settings → API → copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (never expose in browser)
3. Project Settings → Database → copy the connection string
4. SQL Editor → paste contents of `supabase/migrations/001_init.sql` → Run
5. Authentication → Providers:
   - Enable Email/Password
   - Enable Phone (add test number for development)
   - Enable Google (add OAuth client ID + secret)
6. Authentication → URL Configuration → add your Vercel URL to Authorized Domains

## 2. Razorpay (Payments)

1. Create a merchant account at https://razorpay.com
2. Complete KYC (required for live payments)
3. Dashboard → Settings → API Keys → Generate:
   - **Key ID** → `RAZORPAY_KEY_ID` + `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`
4. Dashboard → Webhooks → Add endpoint:
   - URL: `https://your-domain.vercel.app/api/payments/webhook`
   - Events: `payment.captured`, `payment.authorized`, `payment.failed`
   - Copy the webhook secret → `RAZORPAY_WEBHOOK_SECRET`
5. Until KYC completes, set `PAYMENT_MODE=sandbox` — checkout runs in test mode.

## 3. Maps (optional)

The app works without a maps API. To enable:
- **OpenStreetMap** (free): set `NEXT_PUBLIC_MAPS_PROVIDER=openstreetmap`
- **Mapbox** or **Google Maps**: add API key to `NEXT_PUBLIC_MAPS_API_KEY`

## 4. SMS / OTP (optional)

Phone OTP requires an SMS provider:
- **MSG91** or **Twilio** — set `SMS_PROVIDER_API_KEY` + `SMS_PROVIDER_SENDER_ID`
- Alternatively, use Supabase Phone Auth + Firebase Auth with test numbers during development

## 5. Email (optional)

For password reset and notifications:
- **Resend** or **SendGrid** — set `EMAIL_PROVIDER_API_KEY`

## Environment Variables Checklist

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Where to get |
|----------|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server-only) | Supabase |
| `DATABASE_URL` | Migrations only | Supabase |
| `RAZORPAY_KEY_ID` | Payments | Razorpay |
| `RAZORPAY_KEY_SECRET` | Payments | Razorpay |
| `RAZORPAY_WEBHOOK_SECRET` | Webhooks | Razorpay |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client checkout | Razorpay |
| `PAYMENT_MODE` | Optional | `sandbox` or `live` |
