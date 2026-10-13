import type { UserRole } from '../types';

export const ROLE_LABELS: Record<UserRole, string> = {
  worker: 'Worker',
  customer: 'Customer',
  both: 'Worker & Customer',
  admin: 'Administrator',
  manager: 'Manager',
};

export function canAccessDashboard(
  role: UserRole | undefined,
  dashboard: 'worker' | 'customer' | 'admin'
): boolean {
  if (!role) return false;
  if (role === 'admin') return true;

  if (dashboard === 'admin') return role === 'manager';
  if (dashboard === 'worker') return role === 'worker' || role === 'both';
  if (dashboard === 'customer') return role === 'customer' || role === 'both';
  return false;
}
