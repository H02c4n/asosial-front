'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Pencil } from 'lucide-react';
import type { User } from '@/types';
import { Avatar } from './Avatar';
import { FollowButton } from './FollowButton';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  profile: User;
  onFollowChange?: (nowFollowing: boolean) => void;
}

export function ProfileHeader({ profile, onFollowChange }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="p-1.5 hover:bg-zinc-100 rounded-full transition"
          aria-label="Geri"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-zinc-900">
            {profile.first_name || profile.username}
          </h1>
          <p className="text-xs text-zinc-500">{profile.followers_count} takipçi</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <Avatar username={profile.username} avatar={profile.avatar} size={80} />

          {profile.is_me ? (
            <Link
              href="/settings/profile"
              className="px-4 py-1.5 text-sm font-semibold border border-zinc-300 rounded-full hover:bg-zinc-50 transition flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              Düzenle
            </Link>
          ) : (
            <FollowButton
              username={profile.username}
              initialFollowing={!!profile.is_following}
              onChange={onFollowChange}
            />
          )}
        </div>

        <div className="mt-3">
          <h2 className="text-xl font-bold text-zinc-900">
            {profile.first_name || profile.username}{' '}
            {profile.last_name && (
              <span className="text-zinc-600 font-normal">{profile.last_name}</span>
            )}
          </h2>
          <p className="text-sm text-zinc-500">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-zinc-800 whitespace-pre-wrap">{profile.bio}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm text-zinc-600">
          <span>
            <strong className="text-zinc-900">{profile.following_count}</strong>{' '}
            <span className="text-zinc-500">takip edilen</span>
          </span>
          <span>
            <strong className="text-zinc-900">{profile.followers_count}</strong>{' '}
            <span className="text-zinc-500">takipçi</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(profile.date_joined).toLocaleDateString('tr-TR', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </>
  );
}