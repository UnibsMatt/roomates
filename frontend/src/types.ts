export interface ApplicationPayload {
  full_name: string;
  email: string;
  phone?: string;
  course: string;
  message?: string;
  sex?: string;
  age?: number;
}

export interface Application extends ApplicationPayload {
  id: number;
  created_at: string;
}

