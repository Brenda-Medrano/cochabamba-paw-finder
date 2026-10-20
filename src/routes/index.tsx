import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, AlertTriangle, MapPin, Heart, LogIn } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { useStore, fmtFecha } from "@/lib/data";
import { StatusBadge, btnPrimary, btnSecondary, btnOutline } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FindMyPaw · Cada huella merece volver a casa" },
      { name: "description", content: "Encuentra mascotas perdidas, reporta hallazgos y adopta en Cochabamba." },
      { property: "og:title", content: "FindMyPaw · Cochabamba" },
      { property: "og:description", content: "Encuentra mascotas perdidas, reporta hallazgos y adopta en Cochabamba." },
    ],
  }),
  component: Index,
});

function Index() {
  const { pets, adoptables } = useStore();
  const actionsList = [
    { to: "/buscar", label: "Buscar mascota", icon: Search, cls: btnPrimary },
    { to: "/reportar-perdida", label: "Reportar pérdida", icon: AlertTriangle, cls: btnSecondary },
    { to: "/reportar-hallazgo", label: "Reportar hallazgo", icon: MapPin, cls: btnOutline },
    { to: "/adopta", label: "Adopta", icon: Heart, cls: btnOutline },
    { to: "/login", label: "Iniciar sesión", icon: LogIn, cls: btnOutline },
  ] as const;
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="rounded-full bg-card px-4 py-1.5 text-sm font-bold">🐾 Cochabamba, Bolivia</span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] sm:text-6xl">Cada huella merece <span className="text-primary">volver a casa</span></h1>
            <p className="mt-5 max-w-md text-lg">FindMyPaw es una plataforma para encontrar mascotas perdidas, reportar hallazgos y apoyar la adopción responsable en Cochabamba.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {actionsList.map((a) => (
                <Link key={a.to} to={a.to} className={a.cls}><a.icon className="h-4 w-4" />{a.label}</Link>
              ))}
            </div>
          </div>
          <img src={logo.url} alt="Logo FindMyPaw" className="mx-auto w-full max-w-md rounded-[2.5rem] shadow-soft" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[[pets.filter((p) => p.estado === "perdido").length, "mascotas buscando su hogar"], [pets.filter((p) => p.estado === "encontrado").length, "hallazgos reportados"], [adoptables.length, "perros esperando adopción"]].map(([n, t]) => (
            <div key={t} className="rounded-3xl bg-card p-6 shadow-soft">
              <div className="font-display text-4xl font-extrabold text-secondary">{n}</div>
              <div className="font-bold">{t}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-end justify-between">
          <h2 className="text-3xl font-extrabold">Reportes recientes</h2>
          <Link to="/buscar" className="font-bold text-primary">Ver todos →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.slice(0, 3).map((p) => (
            <Link key={p.id} to="/mascota/$id" params={{ id: p.id }} className="overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1">
              <img src={p.foto} alt={p.nombre} className="h-48 w-full object-cover" />
              <div className="flex items-center justify-between p-4">
                <div><div className="font-display text-lg font-bold">{p.nombre}</div><div className="text-sm text-muted-foreground">{p.zona} · {fmtFecha(p.fecha)}</div></div>
                <StatusBadge estado={p.estado} />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[["1. Reporta", "Publica tu mascota perdida o un animal que encontraste con foto y zona."], ["2. Busca", "Filtra por especie, color, zona y fecha para encontrar coincidencias."], ["3. Reencuentra", "Contacta de forma protegida y reporta avistamientos."]].map(([t, d]) => (
            <div key={t} className="rounded-3xl border-2 border-dashed border-primary/40 p-6">
              <h3 className="text-xl font-extrabold text-primary">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
