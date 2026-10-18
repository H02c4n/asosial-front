'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircleMore } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { PostCard } from '@/components/PostCard';
import { PostForm } from '@/components/PostForm';
import { PostSkeleton } from '@/components/PostSkeleton';
import { EmptyState } from '@/components/EmptyState';
import type { PaginatedResponse, Post } from '@/types';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Post>>('/posts/');
      setPosts(data.results);
    } catch (err) {
      console.error('Postlar yüklenemedi', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {/* Post atma formu */}
      {!authLoading && user && <PostForm onCreated={fetchPosts} />}

      {!authLoading && !user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-zinc-800 font-medium">
            Mini Social'a katıl, düşüncelerini paylaş!
          </p>
          <div className="mt-3 flex gap-2 justify-center">
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition"
            >
              Kayıt Ol
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-full transition"
            >
              Giriş
            </Link>
          </div>
        </div>
      )}

      {/* Feed */}
      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl">
          <EmptyState
            icon={MessageCircleMore}
            title="Henüz post yok"
            description={
              user
                ? 'İlk postu sen at, sohbeti başlat!'
                : 'İlk postu görmek için giriş yap veya kayıt ol.'
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