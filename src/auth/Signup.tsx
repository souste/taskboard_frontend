import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [signupCredentials, setSignupCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const success = await signup(signupCredentials.username, signupCredentials.email, signupCredentials.password);
    if (!success) {
      setError("Invalid credentials");
      setIsSubmitting(false);
      return;
    }
    navigate("/");
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
        <button disabled={isSubmitting}>{isSubmitting ? "Signing up..." : "Signup"}</button>
      </form>
    </>
  );
}
