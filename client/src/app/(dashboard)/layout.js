'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>✦</div>
          <div className="spinner" style={{ borderColor: 'rgba(201,168,76,0.3)', borderTopColor: 'var(--accent)', margin: '0 auto', width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
