import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { actions, useStore } from "@/lib/data";
import { Field, Select, inputCls, btnPrimary, btnOutline, Success, PageTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/solicitar/$id")({
  head: () => ({ meta: [{ title: "Solicitud de adopción · FindMyPaw" }, { name: "description", content: "Envía tu solicitud de adopción." }, { property: "og:title", content: "Solicitud de adopción · FindMyPaw" }, { property: "og:description", content: "Envía tu solicitud de adopción." }] }),
  component: Solicitar,
});

function Solicitar() {
  const { id } = Route.useParams();
  const a = useStore().adoptables.find((x) => x.id === id);
  const [f, setF] = useState({ nombre: "", telefono: "", vivienda: "", experiencia: "", motivo: "" });
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  if (done) return <div className="px-4 py-16"><Success title="¡Solicitud enviada!" text={`${a?.albergue ?? "El albergue"} revisará tu solicitud para adoptar a ${a?.nombre ?? "tu nuevo amigo"} y te contactará pronto.`}><Link to="/adopta" className={btnPrimary}>Ver más perros</Link><Link to="/" className={btnOutline}>Inicio</Link></Success></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <PageTitle title={`Adoptar a ${a?.nombre ?? ""}`} subtitle="Cuéntanos un poco sobre ti." />
      <form onSubmit={(e) => { e.preventDefault(); actions.addSolicitud({ ...f, perroId: id }); setDone(true); }} className="flex flex-col gap-5 rounded-3xl bg-card p-6 shadow-soft sm:p-8">
        <Field label="Nombre completo"><input required className={inputCls} value={f.nombre} onChange={set("nombre")} /></Field>
        <Field label="Teléfono"><input required type="tel" className={inputCls} value={f.telefono} onChange={set("telefono")} /></Field>
        <Field label="Tipo de vivienda"><Select required options={["Casa con patio", "Casa sin patio", "Departamento", "Otro"]} value={f.vivienda} onChange={set("vivienda")} /></Field>
        <Field label="Experiencia con mascotas"><Select required options={["Primera vez", "Tuve mascotas antes", "Tengo mascotas actualmente"]} value={f.experiencia} onChange={set("experiencia")} /></Field>
        <Field label="Motivo de adopción"><textarea required rows={4} className={inputCls} value={f.motivo} onChange={set("motivo")} /></Field>
        <button className={btnPrimary}>Enviar solicitud</button>
      </form>
    </div>
  );
}
