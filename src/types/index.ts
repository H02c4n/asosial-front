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
  like_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post: number;
  author: User;
  content: string;
  parent: number | null;
  replies: Comment[];
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

export interface Notification {
  id: number;
  actor: User;
  notification_type: 'follow' | 'comment' | 'like';
  notification_type_display: string;
  post: number | null;
  comment: number | null;
  is_read: boolean;
  created_at: string;
}