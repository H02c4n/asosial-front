'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { MessageCircleMore, Loader2 } from 'lucide-react';
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
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true); // İlk yükleme
  const [loadingMore, setLoadingMore] = useState(false); // Ek yükleme
  
  const observerTarget = useRef(null);

  // İlk postları getir
  const fetchInitialPosts = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Post>>('/posts/');
      setPosts(data.results);
      setNextUrl(data.next);
    } catch (err) {
      console.error('Postlar yüklenemedi', err);
    } finally {
      setLoading(false);
    }
  };

  // Sonraki sayfayı getir
  const fetchMorePosts = useCallback(async () => {
    if (!nextUrl || loadingMore) return;
    
    setLoadingMore(true);
    try {
      // nextUrl tam bir URL olarak gelir (örn: http://localhost:8000/api/posts/?page=2)
      // Axios baseURL'i zaten tanımlı olduğu için sadece path kısmını almamız yeterli
      const url = new URL(nextUrl);
      const path = url.pathname.replace('/api', '') + url.search;
      
      const { data } = await api.get<PaginatedResponse<Post>>(path);
      
      // Yeni postları mevcutların sonuna ekle
      setPosts((prev) => [...prev, ...data.results]);
      setNextUrl(data.next);
    } catch (err) {
      console.error('Daha fazla post yüklenemedi', err);
    } finally {
      setLoadingMore(false);
    }
  }, [nextUrl, loadingMore]);

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  // IntersectionObserver kurulumu
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Eğer hedef görünür olduysa ve yüklenecek sayfa varsa
        if (entries[0].isIntersecting && nextUrl && !loadingMore) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 } // Eleman %100 görünür olduğunda tetikle
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [nextUrl, loadingMore, fetchMorePosts]);

  return (
    <div className="space-y-4">
      {/* Post Atma Formu */}
      {!authLoading && user && <PostForm onCreated={fetchInitialPosts} />}

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
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDeleted={fetchInitialPosts} />
          ))}

          {/* Sonsuz Kaydırma Tetikleyicisi */}
          <div ref={observerTarget} className="py-8 flex justify-center text-zinc-400">
            {loadingMore ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            ) : nextUrl ? (
              <span className="text-sm">Daha fazla yükleniyor...</span>
            ) : (
              <span className="text-sm">Tüm postları gördün 🎉</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}