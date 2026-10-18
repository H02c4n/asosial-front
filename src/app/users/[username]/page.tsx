'use client';

import { use, useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { ProfileHeader } from '@/components/ProfileHeader';
import { PostCard } from '@/components/PostCard';
import { PostSkeleton } from '@/components/PostSkeleton';
import { EmptyState } from '@/components/EmptyState';
import type { PaginatedResponse, Post, User } from '@/types';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get<User>(`/users/${username}/`);
      setProfile(data);
    } catch (err: any) {
      if (err?.response?.status === 404) setNotFound(true);
      console.error('Profil yüklenemedi', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Post>>(
        `/posts/?author=${username}`
      );
      setPosts(data.results);
    } catch (err) {
      console.error('Postlar yüklenemedi', err);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchProfile(), fetchPosts()]);
      setLoading(false);
    })();
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <EmptyState
        title="Kullanıcı bulunamadı"
        description={`@${username} adında bir kullanıcı yok.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ProfileHeader profile={profile} />

      <div className="flex items-center gap-2 px-1">
        <FileText className="w-4 h-4 text-zinc-500" />
        <h2 className="text-sm font-semibold text-zinc-700">Postlar</h2>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl">
          <EmptyState
            icon={FileText}
            title="Henüz post yok"
            description={
              profile.is_me
                ? 'İlk postunu atmaya ne dersin?'
                : `@${username} henüz bir şey paylaşmadı.`
            }
          />
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onDeleted={fetchPosts} />
        ))
      )}
    </div>
  );
}