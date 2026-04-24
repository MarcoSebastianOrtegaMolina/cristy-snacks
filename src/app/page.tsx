'use client';

import { useAuth } from '@/lib/auth-context';
import LoginPage from '@/components/LoginPage';
import AppShell from '@/components/AppShell';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#F5F7F3',
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="Cristy Snacks" style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 16 }} />
          <p style={{ color: '#5A6B5A', fontSize: 14 }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AppShell />;
}
