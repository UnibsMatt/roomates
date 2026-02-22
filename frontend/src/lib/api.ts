import type {
  Application,
  ApplicationPayload,
  Room,
  RoomCreate,
  RoomImage,
  RoomUpdate,
  TokenResponse,
} from '../types';

const API_BASE_URL =
  import.meta.env.PROD
    ? '/api'
    : import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// ─── Shared ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const json = await res.json();
      detail = json.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function authHeaders(token: string): Record<string, string> {
  return { 'X-Auth-Token': token };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<TokenResponse>(res);
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<TokenResponse>(res);
}

export async function logout(token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export async function listRooms(params?: {
  min_price?: number;
  max_price?: number;
}): Promise<Room[]> {
  const qs = new URLSearchParams();
  if (params?.min_price !== undefined) qs.set('min_price', String(params.min_price));
  if (params?.max_price !== undefined) qs.set('max_price', String(params.max_price));
  const res = await fetch(`${API_BASE_URL}/rooms?${qs}`);
  return handleResponse<Room[]>(res);
}

export async function getRoom(id: number): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}`);
  return handleResponse<Room>(res);
}

export async function createRoom(token: string, data: RoomCreate): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  return handleResponse<Room>(res);
}

export async function updateRoom(token: string, id: number, data: RoomUpdate): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  return handleResponse<Room>(res);
}

export async function deleteRoom(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

export async function closeRoom(token: string, id: number): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}/close`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  return handleResponse<Room>(res);
}

export async function listMyRooms(token: string): Promise<Room[]> {
  const res = await fetch(`${API_BASE_URL}/my-rooms`, {
    headers: authHeaders(token),
  });
  return handleResponse<Room[]>(res);
}

// ─── Images ───────────────────────────────────────────────────────────────────

export async function uploadImage(token: string, roomId: number, file: File): Promise<RoomImage> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/images`, {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  });
  return handleResponse<RoomImage>(res);
}

export async function deleteImage(token: string, roomId: number, imageId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/images/${imageId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function submitApplication(
  roomId: number,
  payload: ApplicationPayload,
): Promise<Application> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Application>(res);
}

export async function getRoomApplications(token: string, roomId: number): Promise<Application[]> {
  const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/applications`, {
    headers: authHeaders(token),
  });
  return handleResponse<Application[]>(res);
}
