import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore di registrazione');
    } finally {
      setLoading(false);
    }
  }

  const field =
    'w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none';

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/60 p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Crea un account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Nome</label>
            <input
              type="text"
              required
              autoComplete="name"
              className={field}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password (min. 6 caratteri)</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Registrazione…' : 'Registrati'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Hai già un account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
