'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api, tokenStorage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification, PaginatedResponse } from '@/types';

function getWsBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return '';
  return url
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://')
    .replace(/\/api\/?$/, '');
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get<PaginatedResponse<Notification>>('/notifications/');
      setNotifications(data.results);
      setUnreadCount(data.results.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error('Bildirimler yüklenemedi', err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      wsRef.current?.close(1000, 'logout');
      return;
    }

    let cancelled = false;

    const connect = () => {
      const token = tokenStorage.getAccess();
      if (!token) return;

      const ws = new WebSocket(`${getWsBase()}/ws/notifications/?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!cancelled) setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'notification') {
            const notif = msg.data as Notification;
            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((c) => c + 1);
            toast(`${notif.actor.username} ${getText(notif)}`, { icon: '🔔' });
          }
        } catch (err) {
          console.error('WS parse error', err);
        }
      };

      ws.onclose = (event) => {
        if (cancelled) return;
        setConnected(false);

        if (event.code === 4001) {
          // Token expire olmuş — axios interceptor ile refresh dene
          api.get('/users/me/').then(() => {
            if (!cancelled) reconnectTimeoutRef.current = setTimeout(connect, 1000);
          }).catch(() => {/* refresh de patladı, tekrar denemeyelim */});
        } else if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => ws.close();
    };

    connect();
    fetchNotifications();

    return () => {
      cancelled = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close(1000, 'unmount');
    };
  }, [user, fetchNotifications]);

  const markRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark_all_read/');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return { notifications, unreadCount, connected, markRead, markAllRead };
}

function getText(n: Notification): string {
  switch (n.notification_type) {
    case 'comment': return 'postunu yorumladı';
    case 'follow':  return 'seni takip etti';
    case 'like':    return 'postunu beğendi';
    default:        return 'yeni bir bildirim gönderdi';
  }
}