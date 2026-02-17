import type { Application, ApplicationPayload } from '../types';

// In production with Nginx reverse proxy, use /api
// In development, fallback to direct backend URL
const API_BASE_URL =
  import.meta.env.PROD
    ? '/api'
    : import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function submitApplication(
  payload: ApplicationPayload,
): Promise<Application> {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to submit application (status ${res.status})`);
  }

  return (await res.json()) as Application;
}

export async function getApplications(password: string): Promise<Application[]> {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    headers: { 'X-Admin-Password': password },
  });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch applications (status ${res.status})`);
  }

  return (await res.json()) as Application[];
}

