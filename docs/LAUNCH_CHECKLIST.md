# KaamConnect Launch Checklist

## Foundation
- [x] Next.js 14 + TypeScript + Tailwind
- [x] Supabase project created
- [x] Database schema (30 tables) applied
- [ ] Environment variables set on host
- [ ] Deployed to production URL

## Features
- [x] Home page with hero, search, categories
- [x] Multi-language (EN / HI / UR / Dogri / KS) + RTL
- [x] Registration (worker / customer / both)
- [x] Login (email + Google OAuth)
- [x] Password reset
- [x] Worker profile editor
- [x] Worker search with 3 km radius filter
- [x] Worker detail page
- [x] Job request form
- [x] Booking detail + status workflow
- [x] Razorpay sandbox integration
- [x] Admin dashboard

## External services (configure before live)
- [ ] Razorpay live keys
- [ ] Razorpay webhook signature secret
- [ ] SMS / OTP provider
- [ ] Email provider
- [ ] Google OAuth client
- [ ] Custom domain + SSL

## Pre-launch testing
- [ ] Customer registers → posts job → worker accepts → job completes → payment
- [ ] 3 km radius filter on real mobile device
- [ ] Urdu layout renders RTL
- [ ] Admin can suspend a user
- [ ] Dispute flow (open → resolved)
- [ ] Refund flow (initiate → processed)

## Legal
- [ ] Privacy Policy reviewed
- [ ] Terms of Service reviewed
- [ ] Worker Terms reviewed
- [ ] Refund Policy reviewed
- [ ] Grievance officer contact published (India IT Rules 2021)

## Monitoring
- [ ] Sentry / error tracking
- [ ] Uptime monitor
- [ ] Database backup schedule verified
- [ ] Analytics installed
