import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, uploadImage } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function CreateRoomPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(ev: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(ev.target.files ?? []);
    setFiles((prev) => [...prev, ...selected]);
    selected.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!title.trim() || !price) {
      setError('Titolo e prezzo sono obbligatori');
      return;
    }
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const room = await createRoom(token, {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        price: Number(price),
      });
      // Upload images sequentially
      for (const file of files) {
        await uploadImage(token, room.id, file);
      }
      navigate(`/rooms/${room.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante la pubblicazione');
    } finally {
      setLoading(false);
    }
  }

  const field =
    'w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none text-sm';
  const label = 'block text-sm text-slate-300 mb-1';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-400 hover:text-white transition-colors">
        ← Indietro
      </button>
      <h1 className="mb-6 text-2xl font-bold text-white">Pubblica una stanza</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-slate-700 bg-slate-800/60 p-6">
        <div>
          <label className={label}>Titolo *</label>
          <input
            className={field}
            placeholder="Es. Stanza singola in centro, luminosa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Prezzo mensile (€) *</label>
            <input
              type="number"
              min="1"
              step="any"
              className={field}
              placeholder="350"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={label}>Indirizzo / zona</label>
            <input
              className={field}
              placeholder="Via Bligny 25, Brescia"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label}>Descrizione</label>
          <textarea
            rows={5}
            maxLength={5000}
            className={field}
            placeholder="Descrivi la stanza, i servizi inclusi, le regole della casa…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Image upload */}
        <div>
          <label className={label}>Foto</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-md border border-dashed border-slate-500 bg-slate-700/50 px-4 py-3 text-sm text-slate-300 hover:border-emerald-500 hover:text-white transition-colors w-full"
          >
            + Aggiungi foto
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFiles}
          />

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group aspect-square overflow-hidden rounded-lg">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Pubblicazione in corso…' : 'Pubblica annuncio'}
        </button>
      </form>
    </div>
  );
}
