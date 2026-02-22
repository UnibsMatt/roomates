// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  token: string;
  user_id: number;
  email: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export interface RoomImage {
  id: number;
  room_id: number;
  filename: string;
  url: string;
}

export interface Room {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  price: number;
  is_closed: boolean;
  owner_id: number;
  owner_name: string;
  images: RoomImage[];
  created_at: string;
}

export interface RoomCreate {
  title: string;
  description?: string;
  location?: string;
  price: number;
}

export interface RoomUpdate {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
}

// ─── Applications ─────────────────────────────────────────────────────────────

export interface ApplicationPayload {
  full_name: string;
  email: string;
  phone?: string;
  course: string;
  sex: string;
  age: number;
  message?: string;
}

export interface Application extends ApplicationPayload {
  id: number;
  room_id: number;
  created_at: string;
}
