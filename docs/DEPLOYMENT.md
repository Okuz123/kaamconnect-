# KaamConnect Deployment

## 1. Supabase setup

1. Create project at https://supabase.com
2. Copy `Project URL`, `anon key`, `service_role key` from Project Settings → API
3. Copy database password from Project Settings → Database
4. Open SQL Editor and paste the contents of `supabase/migrations/001_init.sql`
5. Click **Run** — all 30 tables + seed data created

## 2. Environment variables

On Vercel (or your host), add:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
PAYMENT_MODE=sandbox

## 3. Deploy

Import repo in Vercel → framework auto-detected as Next.js → deploy.

## 4. Razorpay (sandbox)

1. Sign up at https://razorpay.com
2. Dashboard → Settings → API Keys → Generate Test Keys
3. Copy Key ID + Key Secret
4. Settings → Webhooks → add `https://your-app.vercel.app/api/payments/webhook`
   - Events: `payment.captured`, `payment.failed`
   - Copy signing secret into `RAZORPAY_WEBHOOK_SECRET`

## 5. Google OAuth (optional)

1. Supabase Dashboard → Authentication → Providers → Google → Enable
2. Create OAuth credentials at https://console.cloud.google.com
3. Paste Client ID + Secret into Supabase
4. Add `https://xxxxx.supabase.co/auth/v1/callback` to Google authorized redirect URIs

## 6. Production checklist

- [ ] `PAYMENT_MODE=live` + live Razorpay keys
- [ ] SMS provider for OTP (Twilio / MSG91 / AWS SNS)
- [ ] Email provider for transactional email (Resend / SendGrid)
- [ ] Custom domain on Vercel
- [ ] Database backups enabled in Supabase
- [ ] Error monitoring (Sentry) configured
- [ ] Privacy Policy + Terms reviewed by legal
- [ ] Worker verification workflow tested end-to-end
- [ ] Dispute + refund flow tested
