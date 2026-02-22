import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoom, submitApplication } from '../lib/api';
import type { ApplicationPayload, Room } from '../types';
import { useAuth } from '../contexts/AuthContext';

// ─── Image carousel ───────────────────────────────────────────────────────────

function Carousel({ images }: { images: { url: string; id: number }[] }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0)
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-800 text-slate-500">
        Nessuna foto disponibile
      </div>
    );
  return (
    <div className="relative overflow-hidden rounded-xl">
      <img
        src={images[idx].url}
        alt={`Foto ${idx + 1}`}
        className="aspect-video w-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1.5 text-white hover:bg-black/70"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1.5 text-white hover:bg-black/70"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Application form ─────────────────────────────────────────────────────────

function ApplicationForm({ roomId }: { roomId: number }) {
  const [form, setForm] = useState<ApplicationPayload>({
    full_name: '',
    email: '',
    phone: '',
    course: '',
    sex: 'M',
    age: 18,
    message: '',
  });
  const [errors, setErrors] = useState<{ full_name?: string; email?: string; phone?: string; course?: string; age?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.full_name.trim()) e.full_name = 'Nome obbligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email non valida';
    if (form.phone && !/^[\d\s+\-()]{6,20}$/.test(form.phone)) e.phone = 'Telefono non valido';
    if (!form.course.trim()) e.course = 'Corso obbligatorio';
    if (form.age < 18 || form.age > 100) e.age = 'Età 18–100';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await submitApplication(roomId, {
        ...form,
        phone: form.phone || undefined,
        message: form.message || undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Errore invio candidatura');
    } finally {
      setLoading(false);
    }
  }

  if (success)
    return (
      <div className="rounded-xl border border-emerald-700 bg-emerald-900/30 p-6 text-center text-emerald-300">
        <p className="text-lg font-semibold">Candidatura inviata!</p>
        <p className="mt-1 text-sm text-emerald-400">Verrai contattato dal proprietario se selezionato.</p>
      </div>
    );

  const field =
    'w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none text-sm';
  const errCls = 'mt-1 text-xs text-red-400';
  const label = 'block text-sm text-slate-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800/60 p-6">
      <h2 className="text-lg font-semibold text-white">Candidati per questa stanza</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Nome e cognome *</label>
          <input className={field} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          {errors.full_name && <p className={errCls}>{errors.full_name}</p>}
        </div>
        <div>
          <label className={label}>Email *</label>
          <input type="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p className={errCls}>{errors.email}</p>}
        </div>
        <div>
          <label className={label}>Telefono</label>
          <input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {errors.phone && <p className={errCls}>{errors.phone}</p>}
        </div>
        <div>
          <label className={label}>Corso / Facoltà *</label>
          <input className={field} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
          {errors.course && <p className={errCls}>{errors.course}</p>}
        </div>
        <div>
          <label className={label}>Sesso *</label>
          <select className={field} value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}>
            <option value="M">Maschio</option>
            <option value="F">Femmina</option>
            <option value="O">Altro</option>
          </select>
        </div>
        <div>
          <label className={label}>Età *</label>
          <input type="number" min={18} max={100} className={field} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
          {errors.age && <p className={errCls}>{errors.age}</p>}
        </div>
      </div>

      <div>
        <label className={label}>Messaggio (opzionale)</label>
        <textarea
          rows={3}
          maxLength={2000}
          className={field}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {apiError && <p className="text-sm text-red-400">{apiError}</p>}

      <p className="text-xs text-slate-500">
        I tuoi dati verranno utilizzati esclusivamente per la gestione della candidatura e non condivisi con terze parti.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-emerald-600 py-2 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Invio in corso…' : 'Invia candidatura'}
      </button>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getRoom(Number(id))
      .then(setRoom)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="py-20 text-center text-slate-400">Caricamento…</p>;
  if (error) return <p className="py-20 text-center text-red-400">{error}</p>;
  if (!room) return null;

  const isOwner = user?.user_id === room.owner_id;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-400 hover:text-white transition-colors">
        ← Torna alla lista
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Carousel images={room.images} />

          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-6 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-bold text-white">{room.title}</h1>
              {room.is_closed && (
                <span className="shrink-0 rounded-full bg-red-900/60 px-2 py-0.5 text-xs font-medium text-red-300">
                  Chiuso
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-emerald-400">€{room.price}<span className="text-base font-normal text-slate-400">/mese</span></p>

            {room.location && (
              <p className="text-sm text-slate-300">📍 {room.location}</p>
            )}

            {room.description && (
              <p className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed">{room.description}</p>
            )}

            <p className="text-xs text-slate-500">
              Pubblicato da {room.owner_name} il{' '}
              {new Date(room.created_at).toLocaleDateString('it-IT')}
            </p>

            {isOwner && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/rooms/${room.id}/edit`)}
                  className="flex-1 rounded-md border border-slate-600 py-1.5 text-sm text-slate-300 hover:border-white hover:text-white transition-colors"
                >
                  Modifica
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          {isOwner ? (
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-6 text-slate-300 text-sm">
              <p className="text-base font-semibold text-white mb-2">Sei il proprietario</p>
              <p>Vai a <strong>Le mie stanze</strong> per vedere le candidature e gestire l'annuncio.</p>
              <button
                onClick={() => navigate('/my-rooms')}
                className="mt-4 w-full rounded-md bg-emerald-600 py-2 text-white hover:bg-emerald-500 transition-colors"
              >
                Le mie stanze
              </button>
            </div>
          ) : room.is_closed ? (
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-6 text-center text-slate-400">
              <p className="text-lg font-semibold text-slate-300">Candidature chiuse</p>
              <p className="mt-1 text-sm">Questo annuncio non accetta più candidature.</p>
            </div>
          ) : (
            <ApplicationForm roomId={room.id} />
          )}
        </div>
      </div>
    </div>
  );
}
