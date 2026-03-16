import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const [loginCredentials, setLoginCredentials] = useState({ email: "", password: "" });
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
      const response = await login(loginCredentials);
      console.log(response);
      if (response.errors) {
        setError(response.errors.error || "Login failed");
        setIsSubmitting(false);
        return;
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
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
        <button>{isSubmitting ? "Loggin in" : "Login"}</button>
      </form>
    </>
  );
}
