'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface Props {
  username: string;
  initialFollowing: boolean;
  /** Follow/unfollow sonrası çağrılır; parent state'i günceller */
  onChange?: (nowFollowing: boolean) => void;
}

export function FollowButton({ username, initialFollowing, onChange }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="px-4 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Takip et
      </button>
    );
  }

  const handleClick = async () => {
    setLoading(true);
    try {
      const endpoint = following ? 'unfollow' : 'follow';
      await api.post(`/users/${username}/${endpoint}/`);
      const next = !following;
      setFollowing(next);
      onChange?.(next);
      toast.success(next ? `@${username} takip edildi` : `Takipten çıkıldı`);
    } catch (err) {
      toast.error('İşlem başarısız');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1.5 text-sm font-semibold rounded-full transition flex items-center gap-1.5 disabled:opacity-60 ${
        following
          ? 'bg-white text-zinc-700 border border-zinc-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : following ? (
        <UserMinus className="w-3.5 h-3.5" />
      ) : (
        <UserPlus className="w-3.5 h-3.5" />
      )}
      {following ? 'Takipten çık' : 'Takip et'}
    </button>
  );
}