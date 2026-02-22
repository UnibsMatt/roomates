import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { closeRoom, deleteRoom, getRoomApplications, listMyRooms } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { Application, Room } from '../types';

function ApplicationsPanel({ roomId, token }: { roomId: number; token: string }) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRoomApplications(token, roomId)
      .then(setApps)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [roomId, token]);

  if (loading) return <p className="text-sm text-slate-400 py-2">Caricamento candidature…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (apps.length === 0)
    return <p className="text-sm text-slate-500 py-2 italic">Nessuna candidatura ricevuta.</p>;

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="min-w-full text-xs text-slate-300">
        <thead>
          <tr className="border-b border-slate-700 text-slate-400 text-left">
            <th className="py-2 pr-4">Nome</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Tel.</th>
            <th className="py-2 pr-4">Corso</th>
            <th className="py-2 pr-4">Sesso</th>
            <th className="py-2 pr-4">Età</th>
            <th className="py-2">Inviata il</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a.id} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
              <td className="py-2 pr-4 font-medium text-white">{a.full_name}</td>
              <td className="py-2 pr-4">
                <a href={`mailto:${a.email}`} className="text-emerald-400 hover:underline">
                  {a.email}
                </a>
              </td>
              <td className="py-2 pr-4">{a.phone ?? '—'}</td>
              <td className="py-2 pr-4">{a.course}</td>
              <td className="py-2 pr-4">{a.sex}</td>
              <td className="py-2 pr-4">{a.age}</td>
              <td className="py-2 whitespace-nowrap">
                {new Date(a.created_at).toLocaleString('it-IT')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {apps.some((a) => a.message) && (
        <div className="mt-3 flex flex-col gap-2">
          {apps
            .filter((a) => a.message)
            .map((a) => (
              <div key={a.id} className="rounded-lg bg-slate-700/40 p-3">
                <p className="text-xs font-semibold text-slate-300">{a.full_name}</p>
                <p className="mt-1 text-xs text-slate-400 whitespace-pre-wrap">{a.message}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function RoomRow({ room, token, onUpdate }: { room: Room; token: string; onUpdate: () => void }) {
  const navigate = useNavigate();
  const [showApps, setShowApps] = useState(false);
  const [closing, setClosing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleClose() {
    if (!confirm('Chiudere le candidature per questa stanza?')) return;
    setClosing(true);
    try {
      await closeRoom(token, room.id);
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setClosing(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Eliminare definitivamente questo annuncio e tutte le candidature?')) return;
    setDeleting(true);
    try {
      await deleteRoom(token, room.id);
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore');
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white">{room.title}</h2>
            {room.is_closed ? (
              <span className="rounded-full bg-red-900/60 px-2 py-0.5 text-xs text-red-300">Chiuso</span>
            ) : (
              <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-xs text-emerald-300">Attivo</span>
            )}
          </div>
          <p className="text-sm text-slate-400">
            €{room.price}/mese{room.location ? ` · ${room.location}` : ''}
          </p>
          <p className="text-xs text-slate-500">
            Pubblicato il {new Date(room.created_at).toLocaleDateString('it-IT')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-slate-300 hover:border-white hover:text-white transition-colors"
          >
            Visualizza
          </button>
          <button
            onClick={() => navigate(`/rooms/${room.id}/edit`)}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-slate-300 hover:border-white hover:text-white transition-colors"
          >
            Modifica
          </button>
          {!room.is_closed && (
            <button
              onClick={handleClose}
              disabled={closing}
              className="rounded-md border border-amber-700 px-3 py-1.5 text-amber-400 hover:border-amber-400 hover:text-amber-300 disabled:opacity-50 transition-colors"
            >
              {closing ? 'Chiusura…' : 'Chiudi candidature'}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md border border-red-800 px-3 py-1.5 text-red-400 hover:border-red-500 hover:text-red-300 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Eliminazione…' : 'Elimina'}
          </button>
          <button
            onClick={() => setShowApps((v) => !v)}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-slate-300 hover:border-white hover:text-white transition-colors"
          >
            {showApps ? 'Nascondi candidature' : 'Candidature'}
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {showApps && (
        <ApplicationsPanel roomId={room.id} token={token} />
      )}
    </div>
  );
}

export default function MyRoomsPage() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
  }, [isAuthenticated, navigate]);

  function load() {
    if (!token) return;
    setLoading(true);
    listMyRooms(token)
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [token]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Le mie stanze</h1>
        <button
          onClick={() => navigate('/rooms/new')}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500 transition-colors"
        >
          + Pubblica nuova stanza
        </button>
      </div>

      {loading && <p className="text-center text-slate-400 py-16">Caricamento…</p>}
      {error && <p className="text-center text-red-400 py-16">{error}</p>}
      {!loading && !error && rooms.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p>Non hai ancora pubblicato annunci.</p>
          <button
            onClick={() => navigate('/rooms/new')}
            className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 transition-colors"
          >
            Pubblica la tua prima stanza
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <RoomRow key={room.id} room={room} token={token!} onUpdate={load} />
        ))}
      </div>
    </div>
  );
}
