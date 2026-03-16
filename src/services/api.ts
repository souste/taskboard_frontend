const API_BASE = "http://localhost:3000";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (loginData: LoginData) => {
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
        errors: { error: result.message || "Login failed" },
      };
    }
    if (result.data?.token) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
    }
    return result;
  } catch (err) {
    console.error("Login error", err);
    return { errors: { error: "Network error. Please try again" } };
  }
};
