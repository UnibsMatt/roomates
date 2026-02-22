import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listRooms } from '../lib/api';
import type { Room } from '../types';

type SortKey = 'newest' | 'price_asc' | 'price_desc';

function RoomCard({ room }: { room: Room }) {
  const cover = room.images[0]?.url;
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800/60 hover:border-emerald-500 transition-colors"
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-700">
        {cover ? (
          <img
            src={cover}
            alt={room.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm">
            Nessuna foto
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h2 className="font-semibold text-white line-clamp-1">{room.title}</h2>
        {room.location && (
          <p className="text-sm text-slate-400 line-clamp-1">📍 {room.location}</p>
        )}
        {room.description && (
          <p className="text-sm text-slate-400 line-clamp-2">{room.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-emerald-400">€{room.price}/mese</span>
          <span className="text-xs text-slate-500">di {room.owner_name}</span>
        </div>
      </div>
    </Link>
  );
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');

  useEffect(() => {
    setLoading(true);
    listRooms()
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rooms
    .filter((r) => (minPrice === '' ? true : r.price >= Number(minPrice)))
    .filter((r) => (maxPrice === '' ? true : r.price <= Number(maxPrice)))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">Stanze disponibili</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Prezzo min €</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-24 rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Prezzo max €</label>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="∞"
            className="w-24 rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-slate-400">Ordina</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="newest">Più recenti</option>
            <option value="price_asc">Prezzo ↑</option>
            <option value="price_desc">Prezzo ↓</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-center text-slate-400 py-16">Caricamento…</p>
      )}
      {error && (
        <p className="text-center text-red-400 py-16">{error}</p>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-slate-400 py-16">Nessuna stanza disponibile con questi filtri.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
