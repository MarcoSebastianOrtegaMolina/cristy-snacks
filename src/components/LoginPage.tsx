'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        const { error } = await signUp(email, password);
        if (error) { setError(error); }
        else { setSuccess('¡Cuenta creada! Revisa tu email para confirmar, o inicia sesión.'); }
      } else {
        const { error } = await signIn(email, password);
        if (error) { setError(error); }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/logo.png" alt="Cristy Snacks" className="login-logo" />
        <h1 className="login-title">Cristy Snack&apos;s</h1>
        <p className="login-subtitle">
          {isRegister ? 'Crea tu cuenta para empezar' : 'Sistema de Gestión'}
        </p>

        {error && <div className="login-error">{error}</div>}
        {success && (
          <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}
            style={{ marginTop: 8, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Cargando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: '#8A9A8A' }}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
            style={{ background: 'none', border: 'none', color: '#7CB342', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
}
