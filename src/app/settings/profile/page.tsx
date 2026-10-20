'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Avatar } from '@/components/Avatar';

export default function ProfileSettingsPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sayfa ilk açıldığında mevcut verileri forma doldur
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  if (authLoading) return <p className="text-center mt-8">Yükleniyor...</p>;
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Önizleme için URL oluştur
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Multipart form-data hazırlığı
      const formData = new FormData();
      formData.append('first_name', form.first_name);
      formData.append('last_name', form.last_name);
      formData.append('bio', form.bio);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // API'ye PATCH isteği
      await api.patch('/users/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Context'teki kullanıcıyı güncelle
      await refreshUser();
      
      toast.success('Profil başarıyla güncellendi');
      router.push(`/users/${user.username}`);
    } catch (err) {
      console.error(err);
      toast.error('Profil güncellenemedi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-zinc-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <h1 className="text-xl font-bold text-zinc-900">Profili Düzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
        {/* Avatar Yükleme */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative group">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Önizleme"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
              />
            ) : (
              <Avatar username={user.username} avatar={user.avatar} size={96} className="shadow-sm" />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
              title="Fotoğraf değiştir"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-zinc-900">Profil Fotoğrafı</h3>
            <p className="text-xs text-zinc-500 mt-1">
              JPG veya PNG, maks. 2MB. Kare boyutlar en iyi sonucu verir.
            </p>
            {avatarFile && (
              <button
                type="button"
                onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                className="text-xs text-red-500 hover:underline mt-2"
              >
                Fotoğraf seçimini iptal et
              </button>
            )}
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* Metin Alanları */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Ad</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Soyad</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Biyografi</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              placeholder="Kendinden bahset..."
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-zinc-400 mt-1 text-right">{form.bio.length}/500</p>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {submitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}