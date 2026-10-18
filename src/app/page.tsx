'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { PostCard } from '@/components/PostCard';
import { PostForm } from '@/components/PostForm';
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

  if (authLoading || loading) {
    return <p className="text-center mt-8 text-gray-500">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-4">
      {user && <PostForm onCreated={fetchPosts} />}

      {!user && (
        <div className="text-center text-gray-500 py-4 border rounded">
          Post atmak için{' '}
          <a href="/login" className="text-blue-500 underline">
            giriş yap
          </a>
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">Henüz post yok.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} onDeleted={fetchPosts} />)
      )}
    </div>
  );
}