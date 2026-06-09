'use client';

import { useAuth } from '../lib/auth';
import { LoginPage } from './LoginPage';

export function LoginGate({ children }: { children: React.ReactNode }) {
  const { authed, authLoading } = useAuth();

  if (authLoading) return null;
  if (!authed) return <LoginPage />;

  return <>{children}</>;
}
