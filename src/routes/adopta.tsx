import { createFileRoute, Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useStore } from "@/lib/data";
import { PageTitle, btnSecondary } from "@/components/ui-kit";

export const Route = createFileRoute("/adopta")({
  head: () => ({ meta: [{ title: "Adopta · FindMyPaw" }, { name: "description", content: "Perros de albergues de Cochabamba esperando un hogar." }, { property: "og:title", content: "Adopta · FindMyPaw" }, { property: "og:description", content: "Perros de albergues de Cochabamba esperando un hogar." }] }),
  component: Adopta,
});

function Adopta() {
  const { adoptables } = useStore();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageTitle title="Adopta un amigo" subtitle="Perros de albergues de Cochabamba esperando una familia responsable." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {adoptables.map((a) => (
          <div key={a.id} className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
            <img src={a.foto} alt={a.nombre} className="h-52 w-full object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-xl font-extrabold">{a.nombre}</h3>
              <div className="mt-1 flex gap-2 text-xs font-bold">
                <span className="rounded-full bg-accent px-2.5 py-1">{a.edad}</span>
                <span className="rounded-full bg-accent px-2.5 py-1">{a.tamano}</span>
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm text-muted-foreground"><Home className="h-4 w-4" />{a.albergue}</p>
              <Link to="/adopcion/$id" params={{ id: a.id }} className={btnSecondary + " mt-4 py-2.5"}>Ver detalle</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
