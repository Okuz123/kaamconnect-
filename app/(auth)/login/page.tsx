import LoginForm from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign in — KaamConnect' };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-sm text-gray-500 mb-6">Sign in to continue</p>
      <LoginForm />
    </>
  );
}
