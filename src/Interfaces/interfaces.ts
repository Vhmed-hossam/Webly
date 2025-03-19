export interface RegisterData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  gender: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Post {
  _id: string;
  body: string;
  image: string;
  user: User;
  createdAt: string;
  comments: Comment[];
  id: string;
}

export interface User {
  _id: string;
  name: string;
  photo: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  createdAt?: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  photo: string;
}

export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  createdAt: string;
}

export interface ChangePasswordI {
  password: string;
  newPassword: string;
}

export interface AxiosErrorResponse {
  code: string;
  message: string;
  name: string;
  status: number;
  statusText: string;
  stack?: string;
  config: {
    transitional?: Record<string, unknown>;
    adapter?: unknown[];
    transformRequest?: unknown[];
    transformResponse?: unknown[];
    timeout: number;
  };
  request: XMLHttpRequest;
  response?: {
    data: {
      error: string;
    };
    headers: Record<string, string>;
    status: number;
    statusText: string;
  };
}

export interface PaginationInfo {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  total?: number;
}

export interface AxiosSuccessResponse<T> {
  config: {
    transitional?: Record<string, unknown>;
    adapter?: unknown[];
    transformRequest?: unknown[];
    transformResponse?: unknown[];
    timeout: number;
  };
  data: {
    message: string;
    paginationInfo?: PaginationInfo;
    posts: T[];
  };
  headers: Record<string, string>;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}
export interface DataResponse {
  id: string;
  name: string;
}

