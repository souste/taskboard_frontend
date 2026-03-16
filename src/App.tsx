import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SingleBoard from "./boards/pages/SingleBoard";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board" element={<SingleBoard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
