'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Avatar } from './Avatar';

interface Props {
  postId: number;
  onCreated: () => void;
}

export function CommentForm({ postId, onCreated }: Props) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-4 text-sm text-zinc-500 border border-dashed border-zinc-300 rounded-xl">
        Yorum yapmak için{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          giriş yap
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/comments/', { post: postId, content: content.trim() });
      setContent('');
      onCreated();
    } catch (err) {
      toast.error('Yorum gönderilemedi');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start">
      <Avatar username={user.username} avatar={user.avatar} size={36} />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Yorumunu yaz..."
          rows={2}
          maxLength={1000}
          className="w-full border border-zinc-300 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
        />
        <div className="flex justify-end mt-1.5">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Gönder
          </button>
        </div>
      </div>
    </form>
  );
}