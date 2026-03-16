import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to the Taskboard</h1>
      <button onClick={() => navigate("/board")}>To Board</button>
    </>
  );
}
