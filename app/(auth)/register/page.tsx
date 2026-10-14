import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
export const metadata = { title: 'Register — KaamConnect' };
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
