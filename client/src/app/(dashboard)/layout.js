'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Toaster } from 'react-hot-toast';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.content}>
        <Header onMenuToggle={() => setSidebarOpen(p => !p)} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
