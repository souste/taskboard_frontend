import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-8 py-4 shadow-md">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-500 font-bold text-white">
          K
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Kanban<span className="text-indigo-400">Flow</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium text-slate-200">
            {user.username || user.email}
          </span>
          <span className="text-[10px] tracking-wider text-slate-400 uppercase">
            Workspace Admin
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md border border-slate-700 bg-slate-800 px-4 py-1.5 text-sm font-semibold text-slate-200 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
