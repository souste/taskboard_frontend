import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SingleBoard from './boards/pages/SingleBoard';
import Signup from './auth/Signup';
import Login from './auth/Login';
import NavBar from './components/NavBar';
import SingleTask from './tasks/SingleTask';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="animate-pulse text-slate-500">Loading session...</p>
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/board" /> : <Login />} />
        <Route path="/board" element={<SingleBoard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks/:taskId" element={<SingleTask />} />
      </Routes>
    </>
  );
}

export default App;
