import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, CheckCircle2 } from "lucide-react";
import { actions, useStore, TAMANOS, PLACEHOLDER, fmtFecha } from "@/lib/data";
import { PageTitle, Field, Select, inputCls, btnPrimary, PhotoInput } from "@/components/ui-kit";

export const Route = createFileRoute("/panel-albergue")({
  head: () => ({ meta: [{ title: "Panel de albergue · FindMyPaw" }, { name: "description", content: "Gestiona perros en adopción y solicitudes." }, { property: "og:title", content: "Panel de albergue · FindMyPaw" }, { property: "og:description", content: "Gestiona perros en adopción y solicitudes." }] }),
  component: Panel,
});

const TABS = [["perros", "Perros publicados"], ["agregar", "Agregar perro"], ["solicitudes", "Solicitudes recibidas"]] as const;

function Panel() {
  const { adoptables, solicitudes } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("perros");
  const empty = { nombre: "", edad: "", tamano: "", salud: "", historia: "", albergue: "Albergue Huellitas Cocha", foto: "" };
  const [f, setF] = useState(empty);
  const [ok, setOk] = useState(false);
  const [estados, setEstados] = useState<Record<string, string>>({});
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageTitle title="Panel de albergue" subtitle="Albergue Huellitas Cocha · Gestión de adopciones" />
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); setOk(false); }} className={`rounded-full px-5 py-2 font-bold ${tab === k ? "bg-ink text-ink-foreground" : "bg-muted"}`}>
            {l}{k === "solicitudes" && <span className="ml-2 rounded-full bg-secondary px-2 text-xs text-secondary-foreground">{solicitudes.length}</span>}
          </button>
        ))}
      </div>

      {tab === "perros" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adoptables.map((a) => (
            <div key={a.id} className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-soft">
              <img src={a.foto} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1"><div className="font-display text-lg font-bold">{a.nombre}</div><div className="truncate text-sm text-muted-foreground">{a.edad} · {a.tamano}</div><div className="truncate text-xs text-muted-foreground">{a.albergue}</div></div>
              <button onClick={() => actions.removeAdoptable(a.id)} aria-label="Eliminar" className="rounded-full p-2 text-destructive hover:bg-muted"><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </div>
      )}

      {tab === "agregar" && (ok ? (
        <div className="rounded-3xl border-2 border-success bg-card p-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-success" /><h2 className="mt-2 text-2xl font-extrabold">¡Perro publicado en adopción!</h2><button onClick={() => setOk(false)} className={btnPrimary + " mt-4"}>Agregar otro</button></div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); actions.addAdoptable({ ...f, foto: f.foto || PLACEHOLDER }); setF(empty); setOk(true); }} className="grid gap-5 rounded-3xl bg-card p-6 shadow-soft sm:grid-cols-2 sm:p-8">
          <Field label="Nombre"><input required className={inputCls} value={f.nombre} onChange={set("nombre")} /></Field>
          <Field label="Edad aproximada"><input required className={inputCls} placeholder="Ej: 2 años" value={f.edad} onChange={set("edad")} /></Field>
          <Field label="Tamaño"><Select required options={TAMANOS} value={f.tamano} onChange={set("tamano")} /></Field>
          <Field label="Estado de salud"><input required className={inputCls} value={f.salud} onChange={set("salud")} /></Field>
          <div className="sm:col-span-2"><Field label="Historia breve"><textarea required rows={3} className={inputCls} value={f.historia} onChange={set("historia")} /></Field></div>
          <div className="sm:col-span-2"><Field label="Foto"><PhotoInput preview={f.foto} onChange={(foto) => setF({ ...f, foto })} /></Field></div>
          <button className={btnPrimary + " sm:col-span-2"}>Publicar en adopción</button>
        </form>
      ))}

      {tab === "solicitudes" && (
        <div className="space-y-4">
          {solicitudes.map((s) => {
            const perro = adoptables.find((a) => a.id === s.perroId);
            const est = estados[s.id];
            return (
              <div key={s.id} className="rounded-3xl bg-card p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><div className="font-display text-lg font-bold">{s.nombre} → {perro?.nombre ?? "—"}</div><div className="text-sm text-muted-foreground">{fmtFecha(s.fecha)} · Tel. {s.telefono}</div></div>
                  {est ? <span className={`rounded-full px-3 py-1 text-sm font-bold ${est === "Aprobada" ? "bg-success text-success-foreground" : "bg-muted"}`}>{est}</span> : (
                    <div className="flex gap-2">
                      <button onClick={() => setEstados({ ...estados, [s.id]: "Aprobada" })} className="rounded-full bg-success px-4 py-1.5 text-sm font-bold text-success-foreground">Aprobar</button>
                      <button onClick={() => setEstados({ ...estados, [s.id]: "Rechazada" })} className="rounded-full border-2 px-4 py-1.5 text-sm font-bold">Rechazar</button>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm"><b>Vivienda:</b> {s.vivienda} · <b>Experiencia:</b> {s.experiencia}</p>
                <p className="mt-1 text-sm"><b>Motivo:</b> {s.motivo}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
