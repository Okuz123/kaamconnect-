import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = { title: 'Register — KaamConnect' };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-sm text-gray-500 mb-6">Join as a customer, worker, or both</p>
      <Suspense fallback={<p>Loading…</p>}>
        <RegisterForm />
      </Suspense>
    </>
  );
}
