export type LoginData = {
  email: string;
  password: string;
};

export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type SafeUser = {
  id: string;
  email: string;
  username: string;
};

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  errors?: { error: string };
  data?: T;
};
export type MeResponse = ApiResponse<{
  user: SafeUser;
}>;

export type LoginResponse = ApiResponse<{
  user: SafeUser;
  token: string;
}>;

export type SignupResponse = ApiResponse<{
  id: number;
  username: string;
  email: string;
  created_at: string;
}>;
