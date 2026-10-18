'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Comment } from '@/types';
import { Avatar } from './Avatar';

interface Props {
  comment: Comment;
  onDeleted: () => void;
}

export function CommentCard({ comment, onDeleted }: Props) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const isOwner = user?.id === comment.author.id;

  const handleDelete = async () => {
    if (!confirm('Bu yorumu silmek istiyor musun?')) return;
    setDeleting(true);
    try {
      await api.delete(`/comments/${comment.id}/`);
      toast.success('Yorum silindi');
      onDeleted();
    } catch (err) {
      toast.error('Yorum silinemedi');
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-3 py-3">
      <Link href={`/users/${comment.author.username}`}>
        <Avatar
          username={comment.author.username}
          avatar={comment.author.avatar}
          size={32}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 min-w-0">
            <Link
              href={`/users/${comment.author.username}`}
              className="font-semibold text-sm text-zinc-900 hover:underline truncate"
            >
              {comment.author.first_name || comment.author.username}
            </Link>
            <span className="text-xs text-zinc-500 truncate">
              @{comment.author.username}
            </span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-500 whitespace-nowrap">
              {timeAgo(comment.created_at)}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-zinc-400 hover:text-red-600 p-1 rounded-full transition shrink-0"
              aria-label="Yorumu sil"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        <p className="mt-0.5 text-sm text-zinc-800 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}