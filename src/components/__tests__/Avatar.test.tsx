import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';
import { describe, it, expect } from 'vitest';

describe('Avatar Component', () => {
  it('kullanıcı adının baş harflerini gösterir (resim yoksa)', () => {
    render(<Avatar username="testuser" avatar={null} />);
    // "TE" harflerini içeren bir element var mı?
    expect(screen.getByText('TE')).toBeTruthy();
  });

  it('resim varsa img etiketi oluşturur', () => {
    render(<Avatar username="testuser" avatar="/media/avatar.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('/media/avatar.jpg');
  });
});