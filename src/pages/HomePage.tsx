import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/auth";
import type { SafeUser } from "../types/auth.types";

export default function HomePage() {
  const [user, setUser] = useState<SafeUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <h1>Welcome to the Taskboard</h1>
      <p>Welcome {user?.email} </p>
      <button onClick={() => navigate("/board")}>To Board</button>
    </>
  );
}
