import { z } from 'zod';

export const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number');
export const emailSchema = z.string().email('Invalid email');
export const pinSchema = z.string().regex(/^[0-9]{6}$/, 'PIN must be 6 digits');

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name too short').max(80),
  phone: phoneSchema,
  email: emailSchema.optional(),
  primary_role: z.enum(['worker', 'customer', 'both']),
  preferred_language: z.enum(['en', 'hi', 'ur', 'dogri', 'ks']).default('en'),
});

export const workerProfileSchema = z.object({
  public_name: z.string().min(2).max(60),
  bio: z.string().max(500).optional(),
  years_experience: z.number().int().min(0).max(60),
  primary_skill_id: z.string().uuid(),
  daily_rate: z.number().positive().optional(),
  hourly_rate: z.number().positive().optional(),
  preferred_radius_km: z.number().int().min(1).max(100),
});

export const jobRequestSchema = z.object({
  category_id: z.string().uuid(),
  title: z.string().min(4).max(120),
  description: z.string().min(10).max(2000),
  scheduled_at: z.string().datetime().optional(),
  proposed_budget: z.number().positive().optional(),
});
