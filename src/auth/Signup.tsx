import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";

type SignupCredentials = {
  username: string;
  email: string;
  password: string;
};

type ApiError = {
  error: string;
};

type SignupResponse = {
  success: boolean;
  message?: string;
  errors?: ApiError;
  data: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
};

export default function Signup() {
  const [signupCredentials, setSignupCredentials] = useState<SignupCredentials>({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response: SignupResponse = await signup(signupCredentials);
      if (!response.success) {
        setError(response.message || response.errors?.error || "Signup failed");
        return;
      }
      navigate("/login");
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
      <h1>Signup Page</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          onChange={handleChange}
          value={signupCredentials.username}
          placeholder="username"
        />
        <input name="email" type="email" onChange={handleChange} value={signupCredentials.email} placeholder="email" />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={signupCredentials.password}
          placeholder="password"
        />
        <button>{isSubmitting ? "Signing up..." : "Signup"}</button>
      </form>
    </>
  );
}
