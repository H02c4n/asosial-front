'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Post } from '@/types';
import { Avatar } from './Avatar';

interface Props {
  post: Post;
  onDeleted?: () => void;
  /** PostCard detay sayfasında gösteriliyorsa false yap */
  clickable?: boolean;
}

export function PostCard({ post, onDeleted, clickable = true }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const isOwner = user?.id === post.author.id;

  const goToDetail = () => {
    if (clickable) router.push(`/posts/${post.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bu postu silmek istiyor musun?')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${post.id}/`);
      toast.success('Post silindi');
      if (onDeleted) onDeleted();
      else router.push('/');
    } catch (err) {
      toast.error('Post silinemedi');
      console.error(err);
      setDeleting(false);
    }
  };

  const openComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/posts/${post.id}`);
  };

  return (
    <article
      onClick={goToDetail}
      className={`bg-white border border-zinc-200 rounded-2xl p-4 transition ${
        clickable
          ? 'hover:border-zinc-300 hover:shadow-sm cursor-pointer'
          : ''
      }`}
    >
      <div className="flex gap-3">
        <Link
          href={`/users/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar username={post.author.username} avatar={post.author.avatar} size={40} />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 min-w-0">
              <Link
                href={`/users/${post.author.username}`}
                onClick={(e) => e.stopPropagation()}
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
              onClick={openComments}
              className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
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