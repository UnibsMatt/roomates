import { useEffect, useState } from 'react';
import { getApplications } from '../lib/api';
import type { Application } from '../types';

const SESSION_KEY = 'admin_password';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authedPassword, setAuthedPassword] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchApplications(pwd: string) {
    setLoading(true);
    setError('');
    try {
      const data = await getApplications(pwd);
      setApplications(data);
      setAuthedPassword(pwd);
      sessionStorage.setItem(SESSION_KEY, pwd);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      if (message === 'Unauthorized') {
        setError('Password errata.');
      } else {
        setError('Errore durante il caricamento delle candidature.');
      }
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      fetchApplications(stored);
    }
  }, []);

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthedPassword(null);
    setApplications([]);
    setPassword('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim()) {
      fetchApplications(password.trim());
    }
  }

  if (!authedPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
          <h1 className="mb-2 text-center text-2xl font-bold text-slate-100">Area Amministratore</h1>
          <p className="mb-6 text-center text-sm text-slate-400">Inserisci la password per visualizzare le candidature.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Candidature ricevute</h1>
            <p className="text-sm text-slate-400">{applications.length} candidatura/e totale/i</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
          >
            Esci
          </button>
        </div>

        {applications.length === 0 ? (
          <p className="text-center text-slate-500">Nessuna candidatura ancora.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Telefono</th>
                  <th className="px-4 py-3">Corso</th>
                  <th className="px-4 py-3">Sesso</th>
                  <th className="px-4 py-3">Età</th>
                  <th className="px-4 py-3">Messaggio</th>
                  <th className="px-4 py-3">Inviata il</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map(app => (
                  <tr key={app.id} className="bg-slate-900/40 transition hover:bg-slate-800/60">
                    <td className="px-4 py-3 text-slate-500">{app.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-100">{app.full_name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${app.email}`} className="text-indigo-400 hover:underline">{app.email}</a>
                    </td>
                    <td className="px-4 py-3">{app.phone ?? '—'}</td>
                    <td className="px-4 py-3">{app.course}</td>
                    <td className="px-4 py-3">{app.sex}</td>
                    <td className="px-4 py-3">{app.age}</td>
                    <td className="max-w-xs px-4 py-3">
                      <span className="line-clamp-2 block text-slate-400">{app.message ?? '—'}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(app.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
