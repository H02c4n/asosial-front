'use client';

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { Post } from '@/types';

export function PostCard({ post, onDeleted }: { post: Post; onDeleted: () => void }) {
  const { user } = useAuth();
  const isOwner = user?.id === post.author.id;

  const handleDelete = async () => {
    if (!confirm('Bu postu silmek istiyor musun?')) return;
    try {
      await api.delete(`/posts/${post.id}/`);
      onDeleted();
    } catch (err) {
      console.error('Silinemedi', err);
    }
  };

  return (
    <article className="border rounded p-4 bg-white">
      <header className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold">@{post.author.username}</span>
          <span className="text-xs text-gray-500 ml-2">
            {new Date(post.created_at).toLocaleString('tr-TR')}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Sil
          </button>
        )}
      </header>
      <p className="whitespace-pre-wrap">{post.content}</p>
      <footer className="mt-3 text-sm text-gray-500">
        💬 {post.comment_count} yorum
      </footer>
    </article>
  );
}