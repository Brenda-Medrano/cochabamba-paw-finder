import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { actions } from "@/lib/data";
import { Field, inputCls, btnPrimary, btnOutline, Success } from "@/components/ui-kit";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión · FindMyPaw" }, { name: "description", content: "Ingresa o crea tu cuenta en FindMyPaw." }, { property: "og:title", content: "Iniciar sesión · FindMyPaw" }, { property: "og:description", content: "Ingresa o crea tu cuenta en FindMyPaw." }] }),
  component: Login,
});

function Login() {
  const [tab, setTab] = useState<"login" | "registro">("login");
  const [done, setDone] = useState<string | null>(null);
  const [f, setF] = useState({ nombre: "", correo: "", pass: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = tab === "registro" ? f.nombre : (f.correo.split("@")[0] ?? f.correo);
    actions.login(nombre, f.correo);
    setDone(tab === "registro" ? `¡Bienvenido/a, ${nombre}! Tu cuenta fue creada.` : `Hola de nuevo, ${nombre}.`);
  };

  if (done) return <div className="px-4 py-16"><Success title="¡Listo!" text={done}><Link to="/buscar" className={btnPrimary}>Buscar mascotas</Link><Link to="/panel-albergue" className={btnOutline}>Panel de albergue</Link></Success></div>;

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl bg-card p-8 shadow-soft">
        <div className="mb-6 grid grid-cols-2 rounded-full bg-muted p-1">
          {(["login", "registro"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full py-2 font-bold transition ${tab === t ? "bg-ink text-ink-foreground" : ""}`}>{t === "login" ? "Iniciar sesión" : "Registrarse"}</button>
          ))}
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {tab === "registro" && <Field label="Nombre completo"><input required className={inputCls} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></Field>}
          <Field label="Correo electrónico"><input required type="email" className={inputCls} value={f.correo} onChange={(e) => setF({ ...f, correo: e.target.value })} /></Field>
          <Field label="Contraseña"><input required type="password" minLength={6} className={inputCls} value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} /></Field>
          <button className={btnPrimary + " mt-2"}>{tab === "login" ? "Ingresar" : "Crear cuenta"}</button>
        </form>
      </div>
    </div>
  );
}
