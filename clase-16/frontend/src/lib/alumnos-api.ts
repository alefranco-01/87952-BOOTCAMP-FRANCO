export interface Alumno {
  legajo: number;
  nombre: string;
  apellido: string;
  fechaDeNacimiento: string;
}

const DEFAULT_BASE_URL = "https://wjgpgdmb-5000.brs.devtunnels.ms/";
const STORAGE_KEY = "alumnos-api-base-url";

export function getBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BASE_URL;
  return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_BASE_URL;
}

export function setBaseUrl(url: string): void {
  window.localStorage.setItem(STORAGE_KEY, url);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-base": getBaseUrl(),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : `Error ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export function fetchAlumnos(): Promise<Alumno[]> {
  return request<Alumno[]>("/api/public/alumnos");
}

export function fetchAlumno(legajo: number): Promise<Alumno> {
  return request<Alumno>(`/api/public/alumnos?legajo=${legajo}`);
}

export function crearAlumno(alumno: Alumno): Promise<Alumno> {
  return request<Alumno>("/api/public/alumnos", {
    method: "POST",
    body: JSON.stringify(alumno),
  });
}
