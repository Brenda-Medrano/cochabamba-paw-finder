import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { actions, ESPECIES, COLORES, TAMANOS, ZONAS, PLACEHOLDER } from "@/lib/data";
import { Field, Select, inputCls, btnPrimary, btnOutline, Success, PageTitle, PhotoInput } from "@/components/ui-kit";

export function PetReportForm({ tipo }: { tipo: "perdido" | "encontrado" }) {
  const lost = tipo === "perdido";
  const empty = { nombre: "", especie: "", raza: "", color: "", tamano: "", fecha: "", zona: "", descripcion: "", foto: "", contacto: "" };
  const [f, setF] = useState(empty);
  const [id, setId] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  if (id) return (
    <div className="px-4 py-16">
      <Success title={lost ? "¡Reporte publicado!" : "¡Hallazgo publicado!"} text="Tu publicación ya es visible para la comunidad de Cochabamba.">
        <Link to="/mascota/$id" params={{ id }} className={btnPrimary}>Ver publicación</Link>
        <button onClick={() => { setF(empty); setId(null); }} className={btnOutline}>Nuevo reporte</button>
      </Success>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageTitle title={lost ? "Reportar mascota perdida" : "Reportar mascota encontrada"} subtitle={lost ? "Mientras más detalles, más fácil será encontrarla." : "Ayuda a que vuelva con su familia."} />
      <form
        onSubmit={(e) => { e.preventDefault(); setId(actions.addPet({ ...f, nombre: lost ? f.nombre : "Sin nombre", raza: f.raza || undefined, estado: tipo, foto: f.foto || PLACEHOLDER })); }}
        className="grid gap-5 rounded-3xl bg-card p-6 shadow-soft sm:grid-cols-2 sm:p-8"
      >
        {lost && <Field label="Nombre de la mascota"><input required className={inputCls} value={f.nombre} onChange={set("nombre")} /></Field>}
        <Field label="Especie"><Select required options={ESPECIES} value={f.especie} onChange={set("especie")} /></Field>
        {lost && <Field label="Raza" optional><input className={inputCls} value={f.raza} onChange={set("raza")} /></Field>}
        <Field label="Color"><Select required options={COLORES} value={f.color} onChange={set("color")} /></Field>
        <Field label="Tamaño"><Select required options={TAMANOS} value={f.tamano} onChange={set("tamano")} /></Field>
        <Field label={lost ? "Fecha de pérdida" : "Fecha del hallazgo"}><input required type="date" className={inputCls} value={f.fecha} onChange={set("fecha")} /></Field>
        <Field label="Zona"><Select required options={ZONAS} value={f.zona} onChange={set("zona")} /></Field>
        <Field label="Contacto (teléfono)"><input required type="tel" className={inputCls} value={f.contacto} onChange={set("contacto")} /></Field>
        <div className="sm:col-span-2"><Field label="Descripción"><textarea required rows={4} className={inputCls} value={f.descripcion} onChange={set("descripcion")} placeholder="Señas particulares, collar, comportamiento…" /></Field></div>
        <div className="sm:col-span-2"><Field label="Foto"><PhotoInput preview={f.foto} onChange={(foto) => setF({ ...f, foto })} /></Field></div>
        <button className={btnPrimary + " sm:col-span-2"}>{lost ? "Publicar reporte" : "Publicar hallazgo"}</button>
      </form>
    </div>
  );
}
