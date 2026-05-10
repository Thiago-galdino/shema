'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/membros', icon: '👥', label: 'Membros' },
  { href: '/celulas', icon: '🏠', label: 'Células' },
  { href: '/eventos', icon: '📅', label: 'Eventos' },
  { href: '/feed', icon: '💬', label: 'Feed' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon} style={{ borderRadius: '50%', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
          <Image src="/logo.png" alt="Shema Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
        </div>
        <div>
          <div className={styles.logoName}>Shema</div>
          <div className={styles.logoSub}>Gestão</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navLabel}>Menu Principal</div>
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${active ? styles.active : ''}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel2}>{item.label}</span>
              {active && <div className={styles.activeDot} />}
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userCard}>
          <div className={`avatar avatar-sm ${styles.userAvatar}`}>
            {getInitials(user?.name)}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name?.split(' ')[0]}</div>
            <div className={styles.userRole}>{user?.role === 'admin' ? 'Administrador' : user?.role === 'lider' ? 'Líder' : 'Membro'}</div>
          </div>
          <button onClick={logout} className={styles.logoutBtn} title="Sair">⏻</button>
        </div>
      </div>
    </aside>
  );
}
