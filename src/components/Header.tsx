'use client';

import Link from 'next/link';
import { LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {NotificationBell} from './NotificationBell';
import { Avatar } from './Avatar';

export function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-20">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="text-zinc-900">Asosial</span>
        </Link>

        <nav className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 bg-zinc-100 rounded-full animate-pulse" />
          ) : user ? (
            <>
            <NotificationBell />
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-2 hover:bg-zinc-100 rounded-full pl-1 pr-3 py-1 transition"
              >
                <Avatar username={user.username} avatar={user.avatar} size={32} />
                <span className="text-sm font-medium text-zinc-700 hidden sm:block">
                  @{user.username}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                aria-label="Çıkış yap"
                title="Çıkış yap"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-full transition"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition flex items-center gap-1.5"
              >
                <UserIcon className="w-4 h-4" />
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}