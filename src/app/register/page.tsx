'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AxiosError } from 'axios';

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
    } catch (err) {
      const axiosErr = err as AxiosError<Record<string, string[]>>;
      const data = axiosErr.response?.data;
      if (data) {
        // DRF hata formatı: {"username": ["Bu kullanıcı adı zaten var."], ...}
        const firstError = Object.entries(data)[0];
        setError(`${firstError[0]}: ${firstError[1].join(', ')}`);
      } else {
        setError('Kayıt başarısız.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(['username', 'email', 'first_name', 'password', 'password2'] as const).map(
          (field) => (
            <div key={field}>
              <label className="block text-sm mb-1 capitalize">{field}</label>
              <input
                type={field.startsWith('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required={field !== 'first_name'}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-600">
        Hesabın var mı?{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          Giriş yap
        </Link>
      </p>
    </div>
  );
}