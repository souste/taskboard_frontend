import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

type SafeUser = {
  id: string;
  email: string;
  username: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type ApiError = {
  error: string;
};

type LoginResponse = {
  success: boolean;
  message?: string;
  errors?: ApiError;
  data?: {
    user: SafeUser;
    token: string;
  };
};

export default function Login() {
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response: LoginResponse = await login(loginCredentials);

      if (!response.success) {
        setError(response.message || response.errors?.error || "Login failed");
        return;
      }
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1>Login Page</h1>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="email" type="email" onChange={handleChange} value={loginCredentials.email} placeholder="email" />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={loginCredentials.password}
          placeholder="password"
        />
        <button>{isSubmitting ? "Logging in..." : "Login"}</button>
      </form>
    </>
  );
}
