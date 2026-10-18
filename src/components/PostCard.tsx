'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Post } from '@/types';
import { Avatar } from './Avatar';

export function PostCard({ post, onDeleted }: { post: Post; onDeleted: () => void }) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const isOwner = user?.id === post.author.id;

  const handleDelete = async () => {
    if (!confirm('Bu postu silmek istiyor musun?')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${post.id}/`);
      onDeleted();
      toast.success('Post silindi');
    } catch (err) {
      toast.error('Post silinemedi');
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <article className="bg-white border border-zinc-200 rounded-2xl p-4 hover:border-zinc-300 transition">
      <div className="flex gap-3">
        <Link href={`/users/${post.author.username}`}>
          <Avatar username={post.author.username} avatar={post.author.avatar} size={40} />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 min-w-0">
              <Link
                href={`/users/${post.author.username}`}
                className="font-semibold text-zinc-900 hover:underline truncate"
              >
                {post.author.first_name || post.author.username}
              </Link>
              <span className="text-sm text-zinc-500 truncate">
                @{post.author.username}
              </span>
              <span className="text-sm text-zinc-400">·</span>
              <span className="text-sm text-zinc-500 whitespace-nowrap">
                {timeAgo(post.created_at)}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition shrink-0"
                aria-label="Sil"
                title="Postu sil"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <p className="mt-1 text-zinc-900 whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {post.content}
          </p>

          <div className="mt-3 flex items-center gap-1 text-zinc-500">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
              title="Yorumlar (yakında)"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comment_count}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}