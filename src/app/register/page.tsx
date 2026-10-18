'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { Loader2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password2) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      toast.success('Hoş geldin! 🎉');
    } catch (err) {
      const axiosErr = err as AxiosError<Record<string, string[]>>;
      const data = axiosErr.response?.data;
      if (data) {
        const firstError = Object.entries(data)[0];
        setError(`${firstError[0]}: ${firstError[1].join(', ')}`);
      } else {
        setError('Kayıt başarısız.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Kullanıcı Adı', type: 'text', required: true },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
    { name: 'first_name', label: 'Ad (opsiyonel)', type: 'text', required: false },
    { name: 'password', label: 'Şifre', type: 'password', required: true },
    { name: 'password2', label: 'Şifre (tekrar)', type: 'password', required: true },
  ] as const;

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
          <UserPlus className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Hesap oluştur</h1>
        <p className="text-sm text-zinc-500 mt-1">Saniyeler içinde katıl</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4"
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        ))}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-zinc-600">
        Hesabın var mı?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Giriş yap
        </Link>
      </p>
    </div>
  );
}