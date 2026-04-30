import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const success = await login(
      loginCredentials.email,
      loginCredentials.password,
    );
    if (!success) {
      setError('Invalid credentials');
      setIsSubmitting(false);
      return;
    }
    navigate('/');
  };

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    setError('');

    const success = await login('guest@demo.app', 'meow123');

    if (!success) {
      setError('Guest access is currently unavailable');
      setIsSubmitting(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="mt-2 text-slate-600">
            Please enter your details to login
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              value={loginCredentials.email}
              placeholder="name@company.com"
              className="w-full rounded-md border border-slate-300 px-4 py-2 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              value={loginCredentials.password}
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-300 px-4 py-2 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 flex-shrink text-xs text-slate-400 uppercase">
              Or
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isSubmitting}
            className="w-full rounded-md border-2 border-indigo-400 py-2 font-semibold text-indigo-500 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
          >
            Guest Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
