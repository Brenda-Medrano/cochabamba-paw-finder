import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, HeartPulse, Home } from "lucide-react";
import { useStore } from "@/lib/data";
import { btnSecondary } from "@/components/ui-kit";

export const Route = createFileRoute("/adopcion/$id")({
  head: () => ({ meta: [{ title: "Detalle de adopción · FindMyPaw" }, { name: "description", content: "Conoce a tu próximo compañero." }, { property: "og:title", content: "Detalle de adopción · FindMyPaw" }, { property: "og:description", content: "Conoce a tu próximo compañero." }] }),
  component: Detalle,
});

function Detalle() {
  const { id } = Route.useParams();
  const a = useStore().adoptables.find((x) => x.id === id);
  if (!a) return <div className="p-16 text-center">No encontrado. <Link to="/adopta" className="font-bold text-primary">Volver</Link></div>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/adopta" className="mb-6 inline-flex items-center gap-1 font-bold text-primary"><ArrowLeft className="h-4 w-4" />Volver a adopciones</Link>
      <div className="grid gap-8 md:grid-cols-2">
        <img src={a.foto} alt={a.nombre} className="aspect-square w-full rounded-3xl object-cover shadow-soft" />
        <div>
          <h1 className="text-4xl font-extrabold">{a.nombre}</h1>
          <div className="mt-3 flex gap-2 font-bold"><span className="rounded-full bg-accent px-3 py-1">{a.edad}</span><span className="rounded-full bg-accent px-3 py-1">{a.tamano}</span></div>
          <p className="mt-5 text-lg">{a.historia}</p>
          <div className="mt-5 space-y-3">
            <p className="flex gap-2 rounded-2xl bg-muted p-3"><HeartPulse className="h-5 w-5 shrink-0 text-secondary" /><span><b>Salud:</b> {a.salud}</span></p>
            <p className="flex gap-2 rounded-2xl bg-muted p-3"><Home className="h-5 w-5 shrink-0 text-primary" /><span><b>Albergue responsable:</b> {a.albergue}</span></p>
          </div>
          <h2 className="mt-6 text-xl font-extrabold">Requisitos de adopción</h2>
          <ul className="mt-2 space-y-1.5">{a.requisitos.map((r) => <li key={r} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-success" />{r}</li>)}</ul>
          <Link to="/solicitar/$id" params={{ id: a.id }} className={btnSecondary + " mt-7"}>Solicitar adopción</Link>
        </div>
      </div>
    </div>
  );
}
