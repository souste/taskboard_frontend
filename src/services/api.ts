import type { LoginData, SignupData, AuthSuccessPayload, MeResponse, ApiResponse } from "../types/auth.types";

const API_BASE = "http://localhost:3000";

export const login = async (loginData: LoginData): Promise<ApiResponse<AuthSuccessPayload>> => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: { error: result.message || "Login failed" },
      };
    }

    return result;
  } catch (err) {
    console.error("Login error", err);
    return { success: false, errors: { error: "Network error. Please try again" } };
  }
};

export const signup = async (signupData: SignupData): Promise<ApiResponse<AuthSuccessPayload>> => {
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: { error: result.message || "Signup failed" },
      };
    }
    return result;
  } catch (err) {
    console.error("Signup error", err);
    return { success: false, errors: { error: "Network error. Please try again" } };
  }
};

export const getMe = async (): Promise<MeResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      success: false,
      errors: { error: "No token" },
    };
  }

  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      errors: { error: result.message || "Token invalid" },
    };
  }
  return result;
};
