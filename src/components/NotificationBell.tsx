'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, WifiOff } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { timeAgo } from '@/lib/utils';
import { Avatar } from './Avatar';
import type { Notification } from '@/types';

export function NotificationBell() {
  const { notifications, unreadCount, connected, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleClick = async (n: Notification) => {
    if (!n.is_read) await markRead(n.id);
    setOpen(false);
    if (n.post) router.push(`/posts/${n.post}`);
    else if (n.notification_type === 'follow') router.push(`/users/${n.actor.username}`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition"
        aria-label="Bildirimler"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b border-zinc-100 sticky top-0 bg-white">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Bildirimler
              {!connected && <WifiOff className="w-3.5 h-3.5 text-amber-500" title="Bağlantı yok" />}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Tümünü okundu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-sm text-zinc-500 py-8">
              Henüz bildirim yok
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => handleClick(n)}
                    className={`w-full text-left p-3 flex gap-3 hover:bg-zinc-50 transition ${
                      !n.is_read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <Avatar username={n.actor.username} avatar={n.actor.avatar} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900">
                        <span className="font-semibold">@{n.actor.username}</span>{' '}
                        {n.notification_type === 'comment' && 'postunu yorumladı'}
                        {n.notification_type === 'follow' && 'seni takip etti'}
                        {n.notification_type === 'like' && 'postunu beğendi'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}