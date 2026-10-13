export type UserRole = 'worker' | 'customer' | 'both' | 'admin' | 'manager';
export type AccountStatus = 'pending' | 'active' | 'suspended' | 'deleted';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export type BookingStatus =
  | 'draft' | 'requested' | 'accepted' | 'declined'
  | 'quotation_pending' | 'quotation_accepted' | 'awaiting_payment'
  | 'confirmed' | 'worker_en_route' | 'work_started' | 'work_completed'
  | 'payment_processing' | 'paid' | 'cancelled' | 'disputed' | 'refunded';

export type PaymentStatus = 'created' | 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'rejected';

export interface User {
  id: string;
  full_name: string;
  display_name: string | null;
  phone: string | null;
  email: string | null;
  primary_role: UserRole;
  account_status: AccountStatus;
  preferred_language: string;
  state: string | null;
  district: string | null;
  city: string | null;
  pin_code: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string | null;
  name_ur: string | null;
  name_dogri: string | null;
  name_ks: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  public_name: string;
  legal_name: string | null;
  bio: string | null;
  years_experience: number;
  primary_skill_id: string | null;
  daily_rate: number | null;
  hourly_rate: number | null;
  quotation_only: boolean;
  availability: AvailabilityStatus;
  preferred_radius_km: number;
  base_lat: number | null;
  base_lng: number | null;
  languages: string[];
  portfolio_urls: string[];
  verification_status: VerificationStatus;
  rating_avg: number;
  rating_count: number;
  total_jobs_completed: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  parent_id: string | null;
  level: 'country' | 'state' | 'ut' | 'division' | 'district' | 'tehsil' | 'block' | 'village' | 'locality';
  name: string;
  name_alt: string[];
  lat: number | null;
  lng: number | null;
  pin_codes: string[];
  is_active: boolean;
}

export interface JobRequest {
  id: string;
  customer_id: string;
  worker_id: string | null;
  category_id: string;
  title: string;
  description: string;
  photo_urls: string[];
  address: string | null;
  lat: number | null;
  lng: number | null;
  scheduled_at: string | null;
  proposed_budget: number | null;
  status: BookingStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  job_id: string;
  customer_id: string;
  worker_id: string;
  status: BookingStatus;
  agreed_amount: number | null;
  platform_fee: number;
  tax_amount: number;
  total_amount: number | null;
  scheduled_at: string | null;
  created_at: string;
}
