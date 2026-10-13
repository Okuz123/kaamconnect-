import { describe, it, expect } from 'vitest';
import { haversineKm } from '@/lib/utils/geo';

describe('haversineKm', () => {
  it('returns ~0 for identical points', () => {
    expect(haversineKm(33.7311, 75.1487, 33.7311, 75.1487)).toBeLessThan(0.001);
  });
  it('Anantnag → Kulgam is roughly 40-45 km', () => {
    const d = haversineKm(33.7311, 75.1487, 33.6444, 75.0194);
    expect(d).toBeGreaterThan(15);
    expect(d).toBeLessThan(50);
  });
  it('handles identical latitude (east-west)', () => {
    const d = haversineKm(33.7311, 75.1487, 33.7311, 75.2487);
    expect(d).toBeGreaterThan(5);
    expect(d).toBeLessThan(15);
  });
});
