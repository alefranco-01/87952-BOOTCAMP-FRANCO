import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import {
  crearAlumno,
  fetchAlumno,
  fetchAlumnos,
  getBaseUrl,
  setBaseUrl,
  type Alumno,
} from "@/lib/alumnos-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alumnos · Consola API" },
      { name: "description", content: "Listá, buscá por legajo y registrá alumnos en tu API REST local." },
      { property: "og:title", content: "Alumnos · Consola API" },
      { property: "og:description", content: "Listá, buscá por legajo y registrá alumnos en tu API REST local." },
    ],
  }),
  component: Index,
});

const nombreRule = (campo: string) =>
  z
    .string()
    .trim()
    .min(1, `El ${campo} es obligatorio`)
    .max(100)
    .regex(/^\p{L}+$/u, `El ${campo} no puede tener espacios ni números`)
    .refine((v) => v[0] === v[0]?.toUpperCase(), `El ${campo} debe comenzar con mayúscula`);

const formSchema = z.object({
  legajo: z.coerce.number({ message: "Legajo inválido" }).int("Legajo inválido").positive("El legajo debe ser mayor que 0"),
  nombre: nombreRule("nombre"),
  apellido: nombreRule("apellido"),
  fechaDeNacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha obligatoria")
    .refine((v) => v <= new Date().toISOString().slice(0, 10), "La fecha no puede ser futura"),
});

type FormState = { legajo: string; nombre: string; apellido: string; fechaDeNacimiento: string };
type Status = "idle" | "loading" | "ok" | "error";

const empty: FormState = { legajo: "", nombre: "", apellido: "", fechaDeNacimiento: "" };

function Index() {
  const [baseInput, setBaseInput] = useState("");
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [listError, setListError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Alumno | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setListError(null);
    try {
      const data = await fetchAlumnos();
      setAlumnos(data);
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setListError(e instanceof Error ? e.message : "Error desconocido");
    }
  }, []);

  useEffect(() => {
    setBaseInput(getBaseUrl());
    load();
  }, [load]);

  const saveBase = () => {
    const v = baseInput.trim();
    if (!/^https?:\/\/.+/.test(v)) {
      setListError("La URL debe comenzar con http:// o https://");
      setStatus("error");
      return;
    }
    setBaseUrl(v);
    load();
  };

  const verAlumno = async (legajo: number) => {
    try {
      setSelected(await fetchAlumno(legajo));
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Error");
    }
  };

  const buscar = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d+$/.test(search)) return;
    try {
      setListError(null);
      setSelected(await fetchAlumno(Number(search)));
    } catch (err) {
      setSelected(null);
      setListError(err instanceof Error ? err.message : "Error");
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await crearAlumno(parsed.data);
      setFeedback({ ok: true, msg: "Alumno guardado correctamente" });
      setForm(empty);
      load();
    } catch (err) {
      setFeedback({ ok: false, msg: err instanceof Error ? err.message : "No se pudo guardar" });
    } finally {
      setSubmitting(false);
    }
  };

  const connection =
    status === "ok"
      ? { label: "Conectado", cls: "bg-ok/10 ring-ok/30 text-ok", dot: "bg-ok" }
      : status === "loading"
        ? { label: "Conectando…", cls: "bg-warn/10 ring-warn/30 text-warn", dot: "bg-warn animate-pulse" }
        : status === "error"
          ? { label: "Sin conexión", cls: "bg-destructive/10 ring-destructive/30 text-destructive", dot: "bg-destructive" }
          : { label: "Inactivo", cls: "bg-muted ring-border text-muted-foreground", dot: "bg-muted-foreground" };

  const field = (k: keyof FormState) =>
    `field mt-1.5 ${errors[k] ? "border-destructive/60 ring-2 ring-destructive/20" : ""}`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-display text-foreground antialiased">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent)] blur-2xl" />
      <div className="pointer-events-none absolute top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,oklch(0.65_0.15_275/0.14),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-7 sm:px-6">
        <header className="panel rise flex flex-wrap items-center gap-4 px-5 py-4">
          <div className="flex items-center gap-3 border-border/50 pr-4 sm:border-r">
            <div className="grid h-9 w-9 place-items-center rounded-[12px] bg-accent/15 ring-1 ring-accent/30">
              <span className="font-mono text-sm font-medium text-accent">A</span>
            </div>
            <div>
              <p className="text-[15px] leading-none font-semibold tracking-tight">Alumnos</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">Consola API · REST</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveBase();
            }}
            className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-border/70 bg-black/25 px-3 py-2 focus-within:ring-2 focus-within:ring-accent/40"
          >
            <label htmlFor="base" className="shrink-0 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              URL base
            </label>
            <input
              id="base"
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              maxLength={300}
              className="w-full bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
              placeholder="https://mi-api.ejemplo.com/"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-foreground transition-colors hover:bg-accent/85"
            >
              Guardar
            </button>
          </form>

          <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${connection.cls}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connection.dot}`} />
            <span className="text-[12px] font-medium">{connection.label}</span>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.75fr_1fr]">
          <section className="panel rise p-5 [animation-delay:80ms]">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-[22px] font-semibold tracking-tight">Alumnos registrados</h2>
                <p className="mt-1 font-mono text-[12px] text-muted-foreground">
                  GET /alumnos · {alumnos.length} registros
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form onSubmit={buscar} className="flex items-center gap-1 rounded-xl border border-border/70 bg-black/25 px-2 py-1">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value.replace(/\D/g, ""))}
                    placeholder="Buscar legajo"
                    className="w-28 bg-transparent font-mono text-[12px] outline-none placeholder:text-muted-foreground/70"
                  />
                  <button type="submit" className="font-mono text-[12px] text-muted-foreground hover:text-accent">
                    →
                  </button>
                </form>
                <button onClick={load} className="font-mono text-[12px] text-muted-foreground transition-colors hover:text-accent">
                  ↻ Refrescar
                </button>
              </div>
            </div>

            {selected && (
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3">
                <div className="font-mono text-[12px]">
                  <span className="text-accent">#{selected.legajo}</span>{" "}
                  <span className="text-foreground">
                    {selected.nombre} {selected.apellido}
                  </span>{" "}
                  <span className="text-muted-foreground">· {selected.fechaDeNacimiento}</span>
                </div>
                <button onClick={() => setSelected(null)} className="font-mono text-[12px] text-muted-foreground hover:text-accent">
                  ✕
                </button>
              </div>
            )}

            {listError && (
              <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[12px] text-destructive">
                {listError}
                {status === "error" && (
                  <p className="mt-1 text-muted-foreground">
                    Si es un túnel de VS Code, abrí la URL en otra pestaña y confirmá el aviso, y asegurate de que sea público.
                  </p>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[64px_1.1fr_1fr_130px_80px] gap-3 border-b border-border/50 px-3 pb-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  <span>Legajo</span>
                  <span>Nombre</span>
                  <span>Apellido</span>
                  <span>Nacimiento</span>
                  <span className="text-right">Acción</span>
                </div>
                <div className="divide-y divide-border/40">
                  {status === "loading" && alumnos.length === 0 &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="px-3 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted/60" />
                      </div>
                    ))}
                  {status === "ok" && alumnos.length === 0 && (
                    <p className="px-3 py-8 text-center font-mono text-[12px] text-muted-foreground">
                      No hay alumnos cargados todavía.
                    </p>
                  )}
                  {alumnos.map((a, i) => (
                    <div
                      key={a.legajo}
                      style={{ animationDelay: `${120 + i * 40}ms` }}
                      className="rise grid grid-cols-[64px_1.1fr_1fr_130px_80px] items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-foreground/[0.04]"
                    >
                      <span className="font-mono text-[13px] text-accent">{a.legajo}</span>
                      <span className="truncate text-[14px] font-medium">{a.nombre}</span>
                      <span className="truncate text-[14px] text-muted-foreground">{a.apellido}</span>
                      <span className="font-mono text-[12px] text-muted-foreground">{a.fechaDeNacimiento}</span>
                      <button
                        onClick={() => verAlumno(a.legajo)}
                        className="justify-self-end font-mono text-[12px] text-muted-foreground transition-colors hover:text-accent"
                      >
                        Ver →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="panel rise flex flex-col p-5 [animation-delay:140ms]">
            <h2 className="text-[22px] font-semibold tracking-tight">Alta de alumno</h2>
            <p className="mt-1 mb-5 font-mono text-[12px] text-muted-foreground">POST /alumnos</p>

            <form onSubmit={submit} noValidate className="flex flex-col">
              <div className="space-y-3.5">
                {(
                  [
                    ["legajo", "Legajo", "1046", "font-mono", "text"],
                    ["nombre", "Nombre", "Nombre", "", "text"],
                    ["apellido", "Apellido", "Apellido", "", "text"],
                    ["fechaDeNacimiento", "Fecha de nacimiento", "", "font-mono", "date"],
                  ] as const
                ).map(([k, label, ph, extra, type]) => (
                  <label key={k} className="block">
                    <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">{label}</span>
                    <input
                      type={type}
                      inputMode={k === "legajo" ? "numeric" : undefined}
                      value={form[k]}
                      placeholder={ph}
                      maxLength={100}
                      max={type === "date" ? new Date().toISOString().slice(0, 10) : undefined}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      className={`${field(k)} ${extra} [color-scheme:dark]`}
                    />
                    {errors[k] && <span className="mt-1 block font-mono text-[11px] text-destructive">✕ {errors[k]}</span>}
                  </label>
                ))}
              </div>

              {feedback && (
                <div
                  className={`mt-5 flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                    feedback.ok ? "border-ok/30 bg-ok/10 text-ok" : "border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${feedback.ok ? "bg-ok" : "bg-destructive"}`} />
                  <p className="text-[12px] font-medium">{feedback.msg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full rounded-2xl bg-accent py-3 text-[14px] font-semibold tracking-tight text-accent-foreground transition-colors hover:bg-accent/85 disabled:opacity-60"
              >
                {submitting ? "Guardando…" : "Agregar alumno"}
              </button>
            </form>
          </section>
        </div>

        <footer className="rise mt-5 flex flex-wrap items-center justify-between gap-2 px-1 [animation-delay:220ms]">
          <p className="font-mono text-[11px] text-muted-foreground">GET /alumnos · GET /alumnos/:legajo · POST /alumnos</p>
          <p className="font-mono text-[11px] text-muted-foreground/70">Alumnos · Consola local de administración</p>
        </footer>
      </div>
    </div>
  );
}
