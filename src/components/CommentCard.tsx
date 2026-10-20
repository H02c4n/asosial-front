'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Trash2, CornerDownRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Comment } from '@/types';
import { Avatar } from './Avatar';

interface Props {
  comment: Comment;
  onDeleted: () => void;
  depth?: number; // Girinti seviyesi
}

export function CommentCard({ comment, onDeleted, depth = 0 }: Props) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const isOwner = user?.id === comment.author.id;

  const handleDelete = async () => {
    if (!confirm('Bu yorumu silmek istiyor musun?')) return;
    setDeleting(true);
    try {
      await api.delete(`/comments/${comment.id}/`);
      toast.success('Yorum silindi');
      onDeleted();
    } catch (err) {
      toast.error('Silinemedi');
      setDeleting(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      await api.post('/comments/', {
        post: comment.post,
        content: replyContent.trim(),
        parent: comment.id, // Yanıtladığımız yorumun ID'si
      });
      setReplyContent('');
      setIsReplying(false);
      onDeleted(); // Listeyi yenile
      toast.success('Yanıt gönderildi');
    } catch (err) {
      toast.error('Yanıt gönderilemedi');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className={`py-3 ${depth > 0 ? 'ml-4 sm:ml-8 border-l-2 border-zinc-100 pl-4' : ''}`}>
      <div className="flex gap-3">
        <Link href={`/users/${comment.author.username}`}>
          <Avatar username={comment.author.username} avatar={comment.author.avatar} size={32} />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-baseline flex-wrap gap-x-2">
              <Link href={`/users/${comment.author.username}`} className="font-semibold text-sm hover:underline">
                {comment.author.first_name || comment.author.username}
              </Link>
              <span className="text-xs text-zinc-500">@{comment.author.username}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-500">{timeAgo(comment.created_at)}</span>
            </div>

            {isOwner && (
              <button onClick={handleDelete} disabled={deleting} className="text-zinc-400 hover:text-red-600 p-1">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <p className="mt-0.5 text-sm text-zinc-800 whitespace-pre-wrap">{comment.content}</p>

          {/* Yanıtla Butonu */}
          {user && depth < 2 && ( // Çok derinleşmesin diye max 2 seviye
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="mt-1 text-xs font-medium text-zinc-500 hover:text-blue-600 flex items-center gap-1"
            >
              <CornerDownRight className="w-3 h-3" /> Yanıtla
            </button>
          )}

          {/* Yanıt Formu */}
          {isReplying && (
            <form onSubmit={handleReply} className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Yanıtını yaz..."
                className="flex-1 text-sm border-b border-zinc-300 focus:border-blue-500 outline-none py-1 bg-transparent"
                autoFocus
              />
              <button type="submit" disabled={submittingReply || !replyContent.trim()} className="text-xs font-medium text-blue-600 disabled:opacity-50">
                {submittingReply ? '...' : 'Gönder'}
              </button>
            </form>
          )}

          {/* Alt Yanıtlar (Recursive) */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentCard key={reply.id} comment={reply} onDeleted={onDeleted} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}