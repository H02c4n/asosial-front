'use client';

// Image importunu kaldır
// import Image from 'next/image'; 
import { backendUrl, getAvatarColor, getInitials } from '@/lib/utils';

interface AvatarProps {
  username: string;
  avatar?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ username, avatar, size = 40, className = '' }: AvatarProps) {
  const url = backendUrl(avatar);

  if (url) {
    return (
      // Standart <img> etiketi kullanıyoruz
      <img
        src={url}
        alt={username}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${getAvatarColor(username)} rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.4) }}
      aria-label={username}
    >
      {getInitials(username)}
    </div>
  );
}