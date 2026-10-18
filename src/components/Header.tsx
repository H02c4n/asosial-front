'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-2xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Mini Social
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <span className="text-gray-400 text-sm">...</span>
          ) : user ? (
            <>
              <Link href="/" className="text-sm text-gray-600 hover:text-black">
                @{user.username}
              </Link>
              <button
                onClick={logout}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-black">
                Giriş
              </Link>
              <Link
                href="/register"
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}