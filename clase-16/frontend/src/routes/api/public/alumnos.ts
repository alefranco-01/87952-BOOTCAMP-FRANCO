import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const baseUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((u) => u.startsWith("https://") || u.startsWith("http://"), {
    message: "La URL base debe ser http(s)",
  });

const alumnoSchema = z.object({
  legajo: z.number().int().positive(),
  nombre: z.string().trim().min(1).max(100),
  apellido: z.string().trim().min(1).max(100),
  fechaDeNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function resolveBase(request: Request): string | null {
  const raw = request.headers.get("x-api-base") ?? "";
  const parsed = baseUrlSchema.safeParse(raw);
  if (!parsed.success) return null;
  return parsed.data.replace(/\/+$/, "");
}

async function forward(
  base: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return Response.json(
      { error: "No se pudo conectar con la API. Verificá la URL base y que el túnel esté activo." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const Route = createFileRoute("/api/public/alumnos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = resolveBase(request);
        if (!base) return Response.json({ error: "URL base inválida" }, { status: 400 });
        const url = new URL(request.url);
        const legajo = url.searchParams.get("legajo");
        if (legajo !== null) {
          if (!/^\d+$/.test(legajo)) {
            return Response.json({ error: "Legajo inválido" }, { status: 400 });
          }
          return forward(base, `/alumnos/${legajo}`);
        }
        return forward(base, "/alumnos");
      },
      POST: async ({ request }) => {
        const base = resolveBase(request);
        if (!base) return Response.json({ error: "URL base inválida" }, { status: 400 });
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
        }
        const parsed = alumnoSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Datos del alumno inválidos" }, { status: 400 });
        }
        return forward(base, "/alumnos", {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });
      },
    },
  },
});
