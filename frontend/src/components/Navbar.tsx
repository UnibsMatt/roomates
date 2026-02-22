import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-emerald-400 tracking-tight">
          Roomates
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">
            Stanze
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-rooms" className="text-slate-300 hover:text-white transition-colors">
                Le mie stanze
              </Link>
              <Link
                to="/rooms/new"
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500 transition-colors"
              >
                + Pubblica
              </Link>
              <span className="text-slate-400 hidden sm:inline">Ciao, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                Esci
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                Accedi
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500 transition-colors"
              >
                Registrati
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
