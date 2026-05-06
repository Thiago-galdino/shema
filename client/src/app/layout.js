import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const outfit = Outfit({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Shema | Plataforma de Gestão',
  description: 'Sistema de gestão da Igreja Batista Shema - Fortaleza, CE',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
