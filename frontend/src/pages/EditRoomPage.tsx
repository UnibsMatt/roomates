import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteImage, getRoom, updateRoom, uploadImage } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { Room, RoomImage } from '../types';

export default function EditRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [existingImages, setExistingImages] = useState<RoomImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    getRoom(Number(id))
      .then((r) => {
        if (user && r.owner_id !== user.user_id) {
          navigate('/');
          return;
        }
        setRoom(r);
        setTitle(r.title);
        setDescription(r.description ?? '');
        setLocation(r.location ?? '');
        setPrice(String(r.price));
        setExistingImages(r.images);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetchLoading(false));
  }, [id, user, navigate]);

  function handleFiles(ev: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(ev.target.files ?? []);
    setNewFiles((prev) => [...prev, ...selected]);
    selected.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setNewPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  }

  function removeNewFile(idx: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleDeleteExistingImage(imgId: number) {
    if (!token || !room) return;
    try {
      await deleteImage(token, room.id, imgId);
      setExistingImages((prev) => prev.filter((i) => i.id !== imgId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore eliminazione immagine');
    }
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!title.trim() || !price || !token || !room) return;
    setLoading(true);
    setError('');
    try {
      await updateRoom(token, room.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        price: Number(price),
      });
      for (const file of newFiles) {
        await uploadImage(token, room.id, file);
      }
      navigate(`/rooms/${room.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore aggiornamento');
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) return <p className="py-20 text-center text-slate-400">Caricamento…</p>;
  if (error && !room) return <p className="py-20 text-center text-red-400">{error}</p>;

  const field =
    'w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none text-sm';
  const label = 'block text-sm text-slate-300 mb-1';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-400 hover:text-white transition-colors">
        ← Indietro
      </button>
      <h1 className="mb-6 text-2xl font-bold text-white">Modifica annuncio</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-slate-700 bg-slate-800/60 p-6">
        <div>
          <label className={label}>Titolo *</label>
          <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Prezzo mensile (€) *</label>
            <input
              type="number"
              min="1"
              step="any"
              className={field}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={label}>Indirizzo / zona</label>
            <input className={field} value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>

        <div>
          <label className={label}>Descrizione</label>
          <textarea
            rows={5}
            maxLength={5000}
            className={field}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div>
            <label className={label}>Foto esistenti</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group aspect-square overflow-hidden rounded-lg">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New images */}
        <div>
          <label className={label}>Aggiungi nuove foto</label>
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
          {newPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {newPreviews.map((src, i) => (
                <div key={i} className="relative group aspect-square overflow-hidden rounded-lg">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
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
          {loading ? 'Salvataggio…' : 'Salva modifiche'}
        </button>
      </form>
    </div>
  );
}
