'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { PostSkeleton } from '@/components/PostSkeleton';
import { CommentCard } from '@/components/CommentCard';
import { CommentForm } from '@/components/CommentForm';
import { EmptyState } from '@/components/EmptyState';
import type { Comment, PaginatedResponse, Post } from '@/types';

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchPost = async () => {
    try {
      const { data } = await api.get<Post>(`/posts/${id}/`);
      setPost(data);
      setNotFound(false);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      }
      console.error('Post yüklenemedi', err);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Comment>>(
        `/comments/?post=${id}`
      );
      setComments(data.results);
    } catch (err) {
      console.error('Yorumlar yüklenemedi', err);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchPost(), fetchComments()]);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <BackButton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div>
        <BackButton />
        <EmptyState
          title="Post bulunamadı"
          description="Bu post silinmiş veya hiç var olmamış olabilir."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BackButton />

      <PostCard
        post={post}
        clickable={false}
        onDeleted={() => router.push('/')}
      />

      <div className="bg-white border border-zinc-200 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-zinc-700 mb-3">
          Yorumlar {comments.length > 0 && `(${comments.length})`}
        </h2>

        <CommentForm postId={Number(id)} onCreated={fetchComments} />

        <div className="mt-3 divide-y divide-zinc-100">
          {comments.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="Henüz yorum yok"
              description="İlk yorumu sen yap!"
            />
          ) : (
            comments.map((c) => (
              <CommentCard key={c.id} comment={c} onDeleted={fetchComments} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition"
    >
      <ArrowLeft className="w-4 h-4" />
      Geri
    </button>
  );
}