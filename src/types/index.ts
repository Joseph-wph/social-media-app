/* ================================
   USER
================================ */

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string;
  bio?: string | null;
};

export interface UserSearchResult {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}

export interface UserSearchData {
  users: UserSearchResult[];
  pagination: Pagination;
}

/* ================================
   AUTH REQUEST
================================ */

export type RegisterRequest = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

/* ================================
   AUTH RESPONSE
================================ */

export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
};

export type AuthData = {
  token: string;
  user: AuthUser;
};

/* ================================
   PROFILE
================================ */

export type MyProfile = {
  profile: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
};

export type UpdateMyProfileRequest = {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: File;
  avatarUrl?: string;
};

export type PublicProfile = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
};

/* ================================
   FOLLOW
================================ */

export type FollowUser = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
};

export type FollowUsersData = {
  users: FollowUser[];
  pagination: Pagination;
};

/* ================================
   POSTS
================================ */

export type PostAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type UserPostsData = {
  posts: Post[];
  pagination: Pagination;
};

/* ================================
   COMMENTS
================================ */

export type CommentAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type Comment = {
  id: number;
  text: string;
  createdAt: string;
  author: CommentAuthor;
  isMine: boolean;
};

export type CreateCommentRequest = {
  text: string;
};

export type CommentsData = {
  comments: Comment[];
  pagination: Pagination;
};

/* ================================
   PAGINATION
================================ */

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* ================================
   FEED RESPONSE DATA
================================ */

export type FeedData = {
  items: Post[];
  pagination: Pagination;
};

/* ================================
   EXPLORE RESPONSE DATA
================================ */

export type ExplorePostsData = {
  posts: Post[];
  pagination: Pagination;
};

/* ================================
   API RESPONSE
================================ */

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
