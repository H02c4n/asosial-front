import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asosial',
  description: 'Basit bir sosyal medya uygulaması',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="max-w-2xl mx-auto p-4">{children}</main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '10px',
                background: '#18181b',
                color: '#fafafa',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}