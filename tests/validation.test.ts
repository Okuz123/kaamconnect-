import { describe, it, expect } from 'vitest';
import { phoneSchema, emailSchema, registerSchema, jobRequestSchema } from '@/lib/utils/validation';

describe('phoneSchema', () => {
  it('accepts Indian format', () => {
    expect(phoneSchema.safeParse('+919876543210').success).toBe(true);
    expect(phoneSchema.safeParse('9876543210').success).toBe(true);
  });
  it('rejects short numbers', () => {
    expect(phoneSchema.safeParse('123').success).toBe(false);
  });
});

describe('emailSchema', () => {
  it('accepts valid', () => {
    expect(emailSchema.safeParse('a@b.com').success).toBe(true);
  });
  it('rejects invalid', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('requires a valid role', () => {
    const r = registerSchema.safeParse({
      full_name: 'Test User', phone: '9876543210', primary_role: 'customer',
    });
    expect(r.success).toBe(true);
  });
});

describe('jobRequestSchema', () => {
  it('rejects too-short title', () => {
    const r = jobRequestSchema.safeParse({
      category_id: '00000000-0000-0000-0000-000000000000',
      title: 'ab', description: 'Not long enough description',
    });
    expect(r.success).toBe(false);
  });
});
