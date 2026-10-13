-- ============================================================
-- KaamConnect — Complete Database Schema
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ENUMs
do $$ begin create type user_role as enum ('worker','customer','both','admin','manager'); exception when duplicate_object then null; end $$;
do $$ begin create type account_status as enum ('pending','active','suspended','deleted'); exception when duplicate_object then null; end $$;
do $$ begin create type verification_status as enum ('unverified','pending','verified','rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type availability_status as enum ('available','busy','unavailable'); exception when duplicate_object then null; end $$;
do $$ begin create type booking_status as enum (
  'draft','requested','accepted','declined','quotation_pending','quotation_accepted',
  'awaiting_payment','confirmed','worker_en_route','work_started','work_completed',
  'payment_processing','paid','cancelled','disputed','refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type payment_status as enum ('created','pending','paid','failed','refunded','partially_refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type payout_status as enum ('pending','processing','completed','failed','cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type dispute_status as enum ('open','investigating','resolved','rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type notification_type as enum (
  'registration','profile_complete','booking_new','booking_accepted','booking_declined',
  'booking_status','quotation','booking_reminder','payment','refund','payout','support','security'); exception when duplicate_object then null; end $$;

-- ============================================================
-- 1. USERS
-- ============================================================
create table if not exists public.users (
  id                 uuid primary key references auth.users(id) on delete cascade,
  full_name          text not null,
  display_name       text,
  phone              text,
  email              text,
  primary_role       user_role not null default 'customer',
  account_status     account_status not null default 'active',
  preferred_language text not null default 'en',
  state              text,
  district           text,
  city               text,
  pin_code           text,
  avatar_url         text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_users_phone on public.users(phone);
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(primary_role);

-- ============================================================
-- 2. USER_ROLES (multi-role)
-- ============================================================
create table if not exists public.user_roles (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  role       user_role not null,
  granted_at timestamptz not null default now(),
  unique(user_id, role)
);
create index if not exists idx_user_roles_user on public.user_roles(user_id);

-- ============================================================
-- 3. SKILL_CATEGORIES
-- ============================================================
create table if not exists public.skill_categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name_en     text not null,
  name_hi     text,
  name_ur     text,
  name_dogri  text,
  name_ks     text,
  icon        text,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 4. LOCATIONS (unified hierarchical)
-- ============================================================
create table if not exists public.locations (
  id          uuid primary key default uuid_generate_v4(),
  parent_id   uuid references public.locations(id) on delete cascade,
  level       text not null check (level in ('country','state','ut','division','district','tehsil','block','village','locality')),
  name        text not null,
  name_alt    text[] default array[]::text[],
  code        text,
  lat         double precision,
  lng         double precision,
  pin_codes   text[] default array[]::text[],
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists idx_locations_parent on public.locations(parent_id);
create index if not exists idx_locations_level on public.locations(level);
create index if not exists idx_locations_name on public.locations(name);

-- ============================================================
-- 5. WORKER_PROFILES
-- ============================================================
create table if not exists public.worker_profiles (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid unique not null references public.users(id) on delete cascade,
  public_name           text not null,
  legal_name            text,
  bio                   text,
  years_experience      int not null default 0,
  primary_skill_id      uuid references public.skill_categories(id),
  daily_rate            numeric(10,2),
  hourly_rate           numeric(10,2),
  quotation_only        boolean not null default false,
  availability          availability_status not null default 'available',
  preferred_radius_km   int not null default 3 check (preferred_radius_km between 1 and 100),
  base_lat              double precision,
  base_lng              double precision,
  working_days          text[] default array[]::text[],
  working_hours_start   time,
  working_hours_end     time,
  languages             text[] default array[]::text[],
  portfolio_urls        text[] default array[]::text[],
  verification_status   verification_status not null default 'unverified',
  rating_avg            numeric(3,2) not null default 0,
  rating_count          int not null default 0,
  total_jobs_completed  int not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists idx_worker_skill on public.worker_profiles(primary_skill_id);
create index if not exists idx_worker_avail on public.worker_profiles(availability);
create index if not exists idx_worker_rating on public.worker_profiles(rating_avg desc);
create index if not exists idx_worker_verified on public.worker_profiles(verification_status);
create index if not exists idx_worker_location on public.worker_profiles(base_lat, base_lng);

-- ============================================================
-- 6. WORKER_SKILLS
-- ============================================================
create table if not exists public.worker_skills (
  id          uuid primary key default uuid_generate_v4(),
  worker_id   uuid not null references public.worker_profiles(id) on delete cascade,
  category_id uuid not null references public.skill_categories(id),
  years       int not null default 0,
  unique(worker_id, category_id)
);

-- ============================================================
-- 7. WORKER_LANGUAGES
-- ============================================================
create table if not exists public.worker_languages (
  id          uuid primary key default uuid_generate_v4(),
  worker_id   uuid not null references public.worker_profiles(id) on delete cascade,
  language    text not null,
  proficiency text not null default 'fluent',
  unique(worker_id, language)
);

-- ============================================================
-- 8. WORKER_SERVICE_AREAS
-- ============================================================
create table if not exists public.worker_service_areas (
  id         uuid primary key default uuid_generate_v4(),
  worker_id  uuid not null references public.worker_profiles(id) on delete cascade,
  district   text not null,
  block      text,
  village    text,
  lat        double precision,
  lng        double precision,
  radius_km  int not null default 3,
  created_at timestamptz not null default now()
);
create index if not exists idx_wsa_worker on public.worker_service_areas(worker_id);

-- ============================================================
-- 9. WORKER_AVAILABILITY
-- ============================================================
create table if not exists public.worker_availability (
  id           uuid primary key default uuid_generate_v4(),
  worker_id    uuid not null references public.worker_profiles(id) on delete cascade,
  day_of_week  int not null check (day_of_week between 0 and 6),
  start_time   time not null,
  end_time     time not null,
  is_available boolean not null default true,
  unique(worker_id, day_of_week)
);

-- ============================================================
-- 10. CUSTOMER_PROFILES
-- ============================================================
create table if not exists public.customer_profiles (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid unique not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 11. CUSTOMER_ADDRESSES
-- ============================================================
create table if not exists public.customer_addresses (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid not null references public.customer_profiles(id) on delete cascade,
  label        text,
  full_address text not null,
  district     text,
  block        text,
  village      text,
  pin_code     text,
  lat          double precision,
  lng          double precision,
  is_default   boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_cust_addr_customer on public.customer_addresses(customer_id);

-- ============================================================
-- 12. JOB_REQUESTS
-- ============================================================
create table if not exists public.job_requests (
  id               uuid primary key default uuid_generate_v4(),
  customer_id      uuid not null references public.customer_profiles(id) on delete cascade,
  worker_id        uuid references public.worker_profiles(id) on delete set null,
  category_id      uuid not null references public.skill_categories(id),
  title            text not null,
  description      text not null,
  photo_urls       text[] default array[]::text[],
  address          text,
  lat              double precision,
  lng              double precision,
  scheduled_at     timestamptz,
  proposed_budget  numeric(10,2),
  status           booking_status not null default 'draft',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_job_customer on public.job_requests(customer_id);
create index if not exists idx_job_worker on public.job_requests(worker_id);
create index if not exists idx_job_status on public.job_requests(status);
create index if not exists idx_job_category on public.job_requests(category_id);

-- ============================================================
-- 13. JOB_QUOTATIONS
-- ============================================================
create table if not exists public.job_quotations (
  id           uuid primary key default uuid_generate_v4(),
  job_id       uuid not null references public.job_requests(id) on delete cascade,
  worker_id    uuid not null references public.worker_profiles(id) on delete cascade,
  amount       numeric(10,2) not null,
  message      text,
  valid_until  timestamptz,
  accepted     boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_quote_job on public.job_quotations(job_id);
create index if not exists idx_quote_worker on public.job_quotations(worker_id);

-- ============================================================
-- 14. BOOKINGS
-- ============================================================
create table if not exists public.bookings (
  id                   uuid primary key default uuid_generate_v4(),
  job_id               uuid not null references public.job_requests(id) on delete cascade,
  customer_id          uuid not null references public.customer_profiles(id),
  worker_id            uuid not null references public.worker_profiles(id),
  status               booking_status not null default 'requested',
  agreed_amount        numeric(10,2),
  platform_fee         numeric(10,2) default 0,
  tax_amount           numeric(10,2) default 0,
  total_amount         numeric(10,2),
  scheduled_at         timestamptz,
  started_at           timestamptz,
  completed_at         timestamptz,
  cancelled_at         timestamptz,
  cancellation_reason  text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists idx_booking_job on public.bookings(job_id);
create index if not exists idx_booking_customer on public.bookings(customer_id);
create index if not exists idx_booking_worker on public.bookings(worker_id);
create index if not exists idx_booking_status on public.bookings(status);

-- ============================================================
-- 15. BOOKING_STATUS_HISTORY
-- ============================================================
create table if not exists public.booking_status_history (
  id         uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  from_state booking_status,
  to_state   booking_status not null,
  actor_id   uuid references public.users(id),
  note       text,
  created_at timestamptz not null default now()
);
create index if not exists idx_bsh_booking on public.booking_status_history(booking_id);

-- ============================================================
-- 16. REVIEWS
-- ============================================================
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  booking_id  uuid unique not null references public.bookings(id) on delete cascade,
  reviewer_id uuid not null references public.users(id),
  worker_id   uuid not null references public.worker_profiles(id),
  rating      int not null check (rating between 1 and 5),
  comment     text,
  is_reported boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_reviews_worker on public.reviews(worker_id);

-- ============================================================
-- 17. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  type       notification_type not null,
  title      text not null,
  body       text,
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notif_user on public.notifications(user_id, is_read);

-- ============================================================
-- 18. PAYMENT_ORDERS
-- ============================================================
create table if not exists public.payment_orders (
  id                  uuid primary key default uuid_generate_v4(),
  booking_id          uuid not null references public.bookings(id) on delete cascade,
  provider            text not null default 'razorpay',
  provider_order_id   text unique,
  amount              numeric(10,2) not null,
  currency            text not null default 'INR',
  status              payment_status not null default 'created',
  mode                text not null default 'sandbox',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_payorder_booking on public.payment_orders(booking_id);
create index if not exists idx_payorder_status on public.payment_orders(status);

-- ============================================================
-- 19. PAYMENT_TRANSACTIONS
-- ============================================================
create table if not exists public.payment_transactions (
  id                    uuid primary key default uuid_generate_v4(),
  order_id              uuid not null references public.payment_orders(id) on delete cascade,
  provider_payment_id   text unique,
  provider_signature    text,
  amount                numeric(10,2) not null,
  status                payment_status not null default 'pending',
  raw_webhook_payload   jsonb,
  created_at            timestamptz not null default now()
);
create index if not exists idx_paytx_order on public.payment_transactions(order_id);

-- ============================================================
-- 20. REFUNDS
-- ============================================================
create table if not exists public.refunds (
  id                 uuid primary key default uuid_generate_v4(),
  payment_order_id   uuid not null references public.payment_orders(id) on delete cascade,
  amount             numeric(10,2) not null,
  reason             text,
  provider_refund_id text,
  status             text not null default 'initiated',
  created_at         timestamptz not null default now()
);
create index if not exists idx_refund_order on public.refunds(payment_order_id);

-- ============================================================
-- 21. PAYOUT_ACCOUNTS
-- ============================================================
create table if not exists public.payout_accounts (
  id                uuid primary key default uuid_generate_v4(),
  worker_id         uuid unique not null references public.worker_profiles(id) on delete cascade,
  beneficiary_name  text not null,
  account_number    text not null,
  ifsc_code         text not null,
  bank_name         text,
  provider_account_id text,
  verified          boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- 22. PAYOUT_REQUESTS
-- ============================================================
create table if not exists public.payout_requests (
  id             uuid primary key default uuid_generate_v4(),
  worker_id      uuid not null references public.worker_profiles(id) on delete cascade,
  account_id     uuid not null references public.payout_accounts(id),
  amount         numeric(10,2) not null,
  status         payout_status not null default 'pending',
  provider_ref   text,
  failure_reason text,
  created_at     timestamptz not null default now(),
  processed_at   timestamptz
);
create index if not exists idx_payout_worker on public.payout_requests(worker_id);
create index if not exists idx_payout_status on public.payout_requests(status);

-- ============================================================
-- 23. FINANCIAL_LEDGER (append-only)
-- ============================================================
create table if not exists public.financial_ledger (
  id            uuid primary key default uuid_generate_v4(),
  booking_id    uuid references public.bookings(id),
  account_type  text not null check (account_type in ('customer','worker','platform','tax')),
  account_id    uuid,
  entry_type    text not null check (entry_type in ('debit','credit')),
  amount        numeric(10,2) not null,
  description   text,
  reference_id  text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_ledger_booking on public.financial_ledger(booking_id);
create index if not exists idx_ledger_account on public.financial_ledger(account_type, account_id);

-- ============================================================
-- 24. DISPUTES
-- ============================================================
create table if not exists public.disputes (
  id           uuid primary key default uuid_generate_v4(),
  booking_id   uuid not null references public.bookings(id) on delete cascade,
  raised_by    uuid not null references public.users(id),
  reason       text not null,
  description  text,
  status       dispute_status not null default 'open',
  resolution   text,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists idx_disputes_booking on public.disputes(booking_id);
create index if not exists idx_disputes_status on public.disputes(status);

-- ============================================================
-- 25. IDENTITY_VERIFICATIONS
-- ============================================================
create table if not exists public.identity_verifications (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  doc_type     text not null,
  doc_url      text not null,
  status       verification_status not null default 'pending',
  reviewer_id  uuid references public.users(id),
  notes        text,
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz
);

-- ============================================================
-- 26. UPLOADED_FILES
-- ============================================================
create table if not exists public.uploaded_files (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  bucket       text not null,
  path         text not null,
  mime_type    text,
  size_bytes   bigint,
  is_public    boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 27. TRANSLATIONS
-- ============================================================
create table if not exists public.translations (
  id         uuid primary key default uuid_generate_v4(),
  namespace  text not null default 'common',
  key        text not null,
  lang       text not null,
  value      text not null,
  reviewed   boolean not null default false,
  unique(namespace, key, lang)
);
create index if not exists idx_translations_lookup on public.translations(namespace, key, lang);

-- ============================================================
-- 28. PLATFORM_SETTINGS
-- ============================================================
create table if not exists public.platform_settings (
  key        text primary key,
  value      jsonb not null,
  updated_by uuid references public.users(id),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 29. SUPPORT_TICKETS
-- ============================================================
create table if not exists public.support_tickets (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  subject      text not null,
  body         text not null,
  status       text not null default 'open' check (status in ('open','in_progress','closed')),
  assigned_to  uuid references public.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_tickets_user on public.support_tickets(user_id);
create index if not exists idx_tickets_status on public.support_tickets(status);

-- ============================================================
-- 30. AUDIT_LOGS
-- ============================================================
create table if not exists public.audit_logs (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id),
  action     text not null,
  entity     text,
  entity_id  uuid,
  metadata   jsonb,
  ip         text,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_user on public.audit_logs(user_id);
create index if not exists idx_audit_entity on public.audit_logs(entity, entity_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

do $$ declare t text;
begin
  foreach t in array array[
    'users','worker_profiles','customer_profiles','customer_addresses',
    'job_requests','bookings','payment_orders','support_tickets'
  ] loop
    execute format('drop trigger if exists trg_%I_updated on public.%I', t, t);
    execute format('create trigger trg_%I_updated before update on public.%I
      for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ============================================================
-- Seed: 21 skill categories
-- ============================================================
insert into public.skill_categories (slug, name_en, name_hi, name_ur, name_ks, sort_order) values
  ('plumber','Plumber','प्लंबर','پلمبر','پلمبر',1),
  ('electrician','Electrician','इलेक्ट्रीशियन','الیکٹریشن','الیکٹریشن',2),
  ('mason','Mason','राजमिस्त्री','راج مستری','راج مستری',3),
  ('carpenter','Carpenter','बढ़ई','بڑھئی','بڑھئی',4),
  ('mechanic','Mechanic','मैकेनिक','مکینک','مکینک',5),
  ('painter','Painter','पेंटर','پینٹر','پینٹر',6),
  ('welder','Welder','वेल्डर','ویلڈر','ویلڈر',7),
  ('construction-worker','Construction Worker','निर्माण श्रमिक','تعمیراتی مزدور','تعمیراتی مزدور',8),
  ('ac-technician','AC / Refrigeration','एसी तकनीशियन','اے سی ٹیکنیشن','اے سی ٹیکنیشن',9),
  ('appliance-repair','Appliance Repair','उपकरण मरम्मत','آلات کی مرمت','آلات مرمت',10),
  ('driver','Driver','ड्राइवर','ڈرائیور','ڈرائیور',11),
  ('cleaner','Cleaner','सफाईकर्मी','صفائی کرنے والا','صفائی کرن والا',12),
  ('gardener','Gardener','माली','مالی','مالی',13),
  ('tile-worker','Tile Worker','टाइल कारीगर','ٹائل ورکر','ٹائل ورکر',14),
  ('roofer','Roofer','छत बनाने वाला','چھت ساز','چھت ساز',15),
  ('cook','Cook','रसोइया','باورچی','وانی',16),
  ('tailor','Tailor','दर्जी','درزی','درزی',17),
  ('farm-worker','Farm Worker','खेत मज़दूर','کھیت مزدور','کھیت مزدور',18),
  ('delivery-worker','Delivery Worker','डिलीवरी कर्मी','ڈیلیوری ورکر','ڈیلیوری ورکر',19),
  ('general-labourer','General Labourer','सामान्य श्रमिक','عام مزدور','عام مزدور',20),
  ('other','Other Skilled Services','अन्य सेवाएँ','دیگر خدمات','باقی خدمت',21)
on conflict (slug) do nothing;

-- ============================================================
-- Seed: platform settings defaults
-- ============================================================
insert into public.platform_settings (key, value) values
  ('commission', '{"percent": 10, "fixed_fee": 0, "tax_percent": 0}'),
  ('booking', '{"default_radius_km": 3, "max_radius_km": 50, "cancellation_hours": 24}'),
  ('payout', '{"minimum_amount": 100, "settlement_days": 3}'),
  ('languages', '["en","hi","ur","dogri","ks"]')
on conflict (key) do nothing;

-- ============================================================
-- DONE — all 30 tables, seed data, triggers
-- ============================================================
