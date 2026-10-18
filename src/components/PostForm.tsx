'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function PostForm({ onCreated }: { onCreated: () => void }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/posts/', { content });
      setContent('');
      onCreated();
    } catch (err) {
      console.error('Post atılamadı', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-3 bg-white">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ne düşünüyorsun?"
        maxLength={2000}
        rows={3}
        className="w-full resize-none outline-none"
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{content.length}/2000</span>
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? 'Atılıyor...' : 'Paylaş'}
        </button>
      </div>
    </form>
  );
}