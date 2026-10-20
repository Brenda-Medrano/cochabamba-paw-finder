import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { useStore, ESPECIES, COLORES, ZONAS, fmtFecha } from "@/lib/data";
import { PageTitle, Select, inputCls, StatusBadge } from "@/components/ui-kit";

export const Route = createFileRoute("/buscar")({
  head: () => ({ meta: [{ title: "Buscar mascotas · FindMyPaw" }, { name: "description", content: "Mascotas perdidas y encontradas en Cochabamba." }, { property: "og:title", content: "Buscar mascotas · FindMyPaw" }, { property: "og:description", content: "Mascotas perdidas y encontradas en Cochabamba." }] }),
  component: Buscar,
});

function Buscar() {
  const { pets } = useStore();
  const [q, setQ] = useState("");
  const [fl, setFl] = useState({ especie: "", color: "", zona: "", fecha: "", estado: "" });
  const set = (k: keyof typeof fl) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setFl({ ...fl, [k]: e.target.value });

  const list = pets.filter((p) =>
    (!q || `${p.nombre} ${p.descripcion} ${p.raza ?? ""} ${p.zona}`.toLowerCase().includes(q.toLowerCase())) &&
    (!fl.especie || p.especie === fl.especie) && (!fl.color || p.color === fl.color) && (!fl.zona || p.zona === fl.zona) &&
    (!fl.fecha || p.fecha >= fl.fecha) && (!fl.estado || p.estado === fl.estado));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageTitle title="Mascotas perdidas y encontradas" subtitle="Busca y filtra los reportes de la comunidad." />
      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input className={inputCls + " pl-12"} placeholder="Buscar por nombre, raza, descripción…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select options={ESPECIES} value={fl.especie} onChange={set("especie")} aria-label="Especie" />
          <Select options={COLORES} value={fl.color} onChange={set("color")} aria-label="Color" />
          <Select options={ZONAS} value={fl.zona} onChange={set("zona")} aria-label="Zona" />
          <input type="date" className={inputCls} value={fl.fecha} onChange={set("fecha")} aria-label="Desde fecha" />
          <select className={inputCls} value={fl.estado} onChange={set("estado")} aria-label="Estado"><option value="">Todos los estados</option><option value="perdido">Perdido</option><option value="encontrado">Encontrado</option></select>
        </div>
      </div>
      <p className="mt-6 font-bold text-muted-foreground">{list.length} resultado(s)</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
            <div className="relative">
              <img src={p.foto} alt={p.nombre} className="h-52 w-full object-cover" />
              <div className="absolute left-3 top-3"><StatusBadge estado={p.estado} /></div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-xl font-extrabold">{p.nombre}</h3>
              <p className="text-sm font-bold text-primary">{p.especie}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{fmtFecha(p.fecha)}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{p.zona}</span>
              </div>
              <Link to="/mascota/$id" params={{ id: p.id }} className="mt-4 rounded-full bg-ink py-2.5 text-center font-bold text-ink-foreground">Ver más</Link>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="col-span-full rounded-3xl bg-muted p-10 text-center">No encontramos coincidencias. Prueba con otros filtros.</p>}
      </div>
    </div>
  );
}
