'use client';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/membros': 'Gestão de Membros',
  '/celulas': 'Células & Ministérios',
  '/eventos': 'Eventos & Cultos',
  '/feed': 'Feed da Comunidade',
};

export default function Header({ onMenuToggle }) {
  const pathname = usePathname();
  const base = '/' + pathname.split('/')[1];
  const title = pageNames[base] || 'Plataforma';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Abrir menu">
          <span /><span /><span />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.right}>
        <div className={styles.badge}>✦ Igreja Batista Shema</div>
      </div>
    </header>
  );
}
