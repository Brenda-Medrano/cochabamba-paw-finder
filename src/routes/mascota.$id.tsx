import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Phone, Eye, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useStore, fmtFecha } from "@/lib/data";
import { StatusBadge, btnPrimary, btnSecondary, inputCls, Field } from "@/components/ui-kit";

export const Route = createFileRoute("/mascota/$id")({
  head: () => ({ meta: [{ title: "Detalle de mascota · FindMyPaw" }, { name: "description", content: "Información del reporte de mascota." }, { property: "og:title", content: "Detalle de mascota · FindMyPaw" }, { property: "og:description", content: "Información del reporte de mascota." }] }),
  component: Detalle,
});

function Detalle() {
  const { id } = Route.useParams();
  const { pets } = useStore();
  const p = pets.find((x) => x.id === id);
  const [modal, setModal] = useState<null | "contacto" | "avistamiento">(null);
  const [sent, setSent] = useState(false);

  if (!p) return <div className="p-16 text-center">Reporte no encontrado. <Link to="/buscar" className="font-bold text-primary">Volver</Link></div>;
  const masked = p.contacto.slice(0, 2) + "•••••" + p.contacto.slice(-1);
  const rows = [["Especie", p.especie], ["Raza", p.raza || "—"], ["Color", p.color], ["Tamaño", p.tamano], ["Fecha del reporte", fmtFecha(p.fecha)], ["Zona aproximada", p.zona]];
  const close = () => { setModal(null); setSent(false); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/buscar" className="mb-6 inline-flex items-center gap-1 font-bold text-primary"><ArrowLeft className="h-4 w-4" />Volver a la búsqueda</Link>
      <div className="grid gap-8 md:grid-cols-2">
        <img src={p.foto} alt={p.nombre} className="aspect-square w-full rounded-3xl object-cover shadow-soft" />
        <div>
          <StatusBadge estado={p.estado} />
          <h1 className="mt-3 text-4xl font-extrabold">{p.nombre}</h1>
          <p className="mt-3 text-lg">{p.descripcion}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {rows.map(([k, v]) => <div key={k} className="rounded-2xl bg-muted p-3"><dt className="text-xs font-bold uppercase text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}
          </dl>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-dashed p-4">
            <Lock className="h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm"><b>Contacto protegido:</b> {masked}<br /><span className="text-muted-foreground">El número completo se comparte solo al enviar un mensaje.</span></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setModal("contacto")} className={btnPrimary}><Phone className="h-4 w-4" />Contactar</button>
            <button onClick={() => setModal("avistamiento")} className={btnSecondary}><Eye className="h-4 w-4" />Reportar avistamiento</button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" onClick={close}>
          <div className="w-full max-w-md animate-in zoom-in-95 rounded-3xl bg-card p-7" onClick={(e) => e.stopPropagation()}>
            {sent ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
                <h2 className="mt-3 text-2xl font-extrabold">{modal === "contacto" ? "¡Mensaje enviado!" : "¡Avistamiento reportado!"}</h2>
                <p className="mt-2 text-muted-foreground">{modal === "contacto" ? `Contacto: ${p.contacto}. El responsable recibió tu mensaje.` : "Gracias por ayudar. Notificamos al responsable del reporte."}</p>
                <button onClick={close} className={btnPrimary + " mt-5"}>Cerrar</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
                <h2 className="text-2xl font-extrabold">{modal === "contacto" ? `Contactar sobre ${p.nombre}` : "Reportar avistamiento"}</h2>
                <Field label="Tu nombre"><input required className={inputCls} /></Field>
                {modal === "avistamiento" && <Field label="¿Dónde lo viste?"><input required className={inputCls} placeholder="Ej: Plaza Colón" /></Field>}
                <Field label="Mensaje"><textarea required rows={3} className={inputCls} /></Field>
                <button className={btnPrimary}>Enviar</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
