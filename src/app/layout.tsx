import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth';
import { AppShell } from '../components/AppShell';
import { LoginGate } from '../components/LoginGate';

export const metadata: Metadata = {
  title: 'GPL AI Control Tower',
  description: 'Construction Operations Center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LoginGate>
            <AppShell>{children}</AppShell>
          </LoginGate>
        </AuthProvider>
      </body>
    </html>
  );
}
