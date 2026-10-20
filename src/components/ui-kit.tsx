import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, CheckCircle2, PawPrint } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { actions, useStore } from "@/lib/data";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/buscar", label: "Buscar" },
  { to: "/reportar-perdida", label: "Reportar pérdida" },
  { to: "/reportar-hallazgo", label: "Reportar hallazgo" },
  { to: "/adopta", label: "Adopta" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useStore();
  const linkCls = "rounded-full px-4 py-2 text-sm font-bold transition-colors hover:bg-accent";
  const active = { className: "bg-ink text-ink-foreground hover:bg-ink" };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo.url} alt="FindMyPaw" className="h-11 w-11 rounded-xl object-cover object-[50%_40%]" />
          <span className="font-display text-xl font-extrabold">FindMyPaw</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={active} activeOptions={{ exact: true }}>{n.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to="/panel-albergue" className={linkCls}>Panel albergue</Link>
              <button onClick={actions.logout} className="rounded-full border-2 border-ink px-4 py-2 text-sm font-bold">Salir ({user.nombre.split(" ")[0]})</button>
            </>
          ) : (
            <Link to="/login" className="rounded-full bg-secondary px-5 py-2 text-sm font-bold text-secondary-foreground">Iniciar sesión</Link>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menú">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t px-4 py-3 lg:hidden" onClick={() => setOpen(false)}>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={active} activeOptions={{ exact: true }}>{n.label}</Link>
          ))}
          <Link to="/panel-albergue" className={linkCls}>Panel albergue</Link>
          {user ? <button onClick={actions.logout} className={linkCls + " text-left"}>Cerrar sesión</button> : <Link to="/login" className={linkCls}>Iniciar sesión</Link>}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm sm:flex-row">
        <span className="flex items-center gap-2 font-display text-lg font-bold"><PawPrint className="h-5 w-5" /> FindMyPaw · Cochabamba</span>
        <span className="opacity-80">Cada huella merece volver a casa · Prototipo académico</span>
      </div>
    </footer>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Field({ label, children, optional }: { label: string; children: ReactNode; optional?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold">{label} {optional && <span className="font-normal text-muted-foreground">(opcional)</span>}</span>
      {children}
    </label>
  );
}

export const inputCls = "w-full rounded-xl border-2 bg-card px-4 py-2.5 outline-none transition focus:border-primary";
export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-soft transition hover:brightness-110";
export const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 font-bold text-secondary-foreground shadow-soft transition hover:brightness-110";
export const btnOutline = "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink px-6 py-3 font-bold transition hover:bg-accent";

export function Select({ options, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select className={inputCls} {...p}>
      <option value="">Seleccionar…</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

export function Success({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-lg animate-in zoom-in-95 fade-in rounded-3xl border-2 border-success bg-card p-10 text-center shadow-soft">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <h2 className="mt-4 text-2xl font-extrabold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}

export function StatusBadge({ estado }: { estado: "perdido" | "encontrado" }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${estado === "perdido" ? "bg-secondary text-secondary-foreground" : "bg-success text-success-foreground"}`}>
      {estado}
    </span>
  );
}

export function PhotoInput({ onChange, preview }: { onChange: (url: string) => void; preview?: string }) {
  return (
    <div className="flex items-center gap-4">
      {preview ? <img src={preview} alt="" className="h-20 w-20 rounded-xl object-cover" /> : <div className="grid h-20 w-20 place-items-center rounded-xl bg-muted"><PawPrint className="text-muted-foreground" /></div>}
      <input type="file" accept="image/*" className="text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(URL.createObjectURL(f)); }} />
    </div>
  );
}
