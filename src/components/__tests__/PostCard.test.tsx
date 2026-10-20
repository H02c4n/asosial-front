import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostCard } from '../PostCard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

// Mock'lar (Sahte fonksiyonlar)
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('PostCard Component', () => {
  const mockPost = {
    id: 1,
    content: 'Bu bir test postudur.',
    author: { id: 2, username: 'testuser', first_name: 'Test', avatar: null },
    like_count: 0,
    is_liked: false,
    comment_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(), // <-- EKLE
    image: null,                          // <-- EKLE
    recent_comments: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Varsayılan olarak giriş yapmış bir kullanıcı (farklı ID'ye sahip)
    (useAuth as any).mockReturnValue({ user: { id: 1, username: 'me' } });
  });

  it('post içeriğini ve yazarını doğru gösterir', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Bu bir test postudur.')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('beğeni butonuna tıklandığında optimistik olarak UI günceller ve API çağırır', async () => {
    (api.post as any).mockResolvedValue({ data: { is_liked: true } });
    
    render(<PostCard post={mockPost} />);
    
    // Kalbin olduğu butonu bul (SVG ikonundan veya başlangıç sayısı 0'dan)
    const likeButton = screen.getByRole('button', { name: /beğen/i }); // İçinde 0 yazan buton
    fireEvent.click(likeButton);

    // Optimistic UI: Tıklar tıklamaz sayı 1 olmalı
    expect(screen.getByText('1')).toBeInTheDocument();

    // API çağrısı doğru endpoint'e gitti mi?
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/posts/1/like/');
    });
  });

  it('kendi postunu beğenmeye çalışınca API çağırmaz', async () => {
    // Postun sahibini, giriş yapmış kullanıcı yap
    const ownPost = { ...mockPost, author: { id: 1, username: 'me' } };
    render(<PostCard post={ownPost} />);

    const likeButton = screen.getByRole('button', { name: /beğen/i });
    fireEvent.click(likeButton);

    // Sayı değişmemeli ve API çağrılmamalı
    expect(api.post).not.toHaveBeenCalled();
  });
});