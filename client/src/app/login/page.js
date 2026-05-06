'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>

      <div className={styles.container}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon} style={{ borderRadius: '50%', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
            <Image src="/logo.png" alt="Shema Logo" width={72} height={72} style={{ objectFit: 'cover' }} />
          </div>
          <h1 className={styles.logoText}>Igreja Batista Shema</h1>
          <p className={styles.logoSub}>Fortaleza – CE</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Entrar na Plataforma</h2>
            <p className={styles.cardSub}>Acesse com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? <><div className="spinner" />Entrando...</> : 'Entrar'}
            </button>
          </form>

          <div className={styles.hint}>
            <span>Demo: </span>
            <code>admin@igrejashema.com</code>
            <span> / </span>
            <code>Shema@2024</code>
          </div>
        </div>

        <p className={styles.footer}>© 2024 Igreja Batista Shema • Todos os direitos reservados</p>
      </div>
    </div>
  );
}
