'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from './Avatar';

export function PostForm({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const remaining = 2000 - content.length;
  const isOverLimit = remaining < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit) return;

    setSubmitting(true);
    try {
      await api.post('/posts/', { content });
      setContent('');
      onCreated();
      toast.success('Post paylaşıldı');
    } catch (err) {
      toast.error('Post paylaşılamadı');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-zinc-200 rounded-2xl p-4 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition"
    >
      <div className="flex gap-3">
        <Avatar username={user.username} avatar={user.avatar} size={40} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ne düşünüyorsun?"
          maxLength={2000}
          rows={3}
          className="flex-1 resize-none outline-none text-zinc-900 placeholder:text-zinc-400 text-base pt-2"
        />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
        <span
          className={`text-xs ${
            isOverLimit
              ? 'text-red-600 font-medium'
              : remaining < 200
              ? 'text-amber-600'
              : 'text-zinc-400'
          }`}
        >
          {remaining < 500 && `${remaining} karakter`}
        </span>

        <button
          type="submit"
          disabled={submitting || !content.trim() || isOverLimit}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Paylaş
        </button>
      </div>
    </form>
  );
}