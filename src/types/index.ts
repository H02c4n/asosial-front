export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar: string | null;
  date_joined: string;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
  is_me?: boolean;
}

export interface Post {
  id: number;
  author: User;
  content: string;
  image: string | null;
  comment_count: number;
  recent_comments: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post: number;
  author: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}