import { useSyncExternalStore } from "react";

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const ZONAS = ["Cala Cala", "Queru Queru", "Sarco", "Tupuraya", "Muyurina", "Quillacollo", "Sacaba", "Tiquipaya", "Zona Sud", "Centro"];
export const ESPECIES = ["Perro", "Gato", "Otro"];
export const COLORES = ["Negro", "Blanco", "Café", "Dorado", "Gris", "Atigrado", "Mixto"];
export const TAMANOS = ["Pequeño", "Mediano", "Grande"];

export type Pet = {
  id: string; nombre: string; especie: string; raza?: string; color: string; tamano: string;
  fecha: string; zona: string; estado: "perdido" | "encontrado"; descripcion: string; foto: string; contacto: string;
};
export type Adoptable = {
  id: string; nombre: string; edad: string; tamano: string; salud: string; historia: string;
  albergue: string; foto: string; requisitos: string[];
};
export type Solicitud = { id: string; perroId: string; nombre: string; telefono: string; vivienda: string; experiencia: string; motivo: string; fecha: string };

const REQ = ["Ser mayor de 18 años", "Presentar carnet de identidad", "Vivienda con espacio seguro", "Compromiso de esterilización y vacunas", "Visita de seguimiento"];

let pets: Pet[] = [
  { id: "1", nombre: "Max", especie: "Perro", raza: "Labrador", color: "Dorado", tamano: "Grande", fecha: "2026-10-18", zona: "Cala Cala", estado: "perdido", descripcion: "Max salió de casa por la tarde cerca de la Av. Melchor Pérez. Lleva collar rojo y es muy amigable.", foto: u("photo-1552053831-71594a27632d"), contacto: "70712345" },
  { id: "2", nombre: "Luna", especie: "Gato", color: "Gris", tamano: "Pequeño", fecha: "2026-10-17", zona: "Queru Queru", estado: "perdido", descripcion: "Gata gris de ojos verdes, algo tímida. Se perdió durante una mudanza.", foto: u("photo-1514888286974-6c03e2ca1dba"), contacto: "76543210" },
  { id: "3", nombre: "Sin nombre", especie: "Perro", color: "Café", tamano: "Mediano", fecha: "2026-10-19", zona: "Sarco", estado: "encontrado", descripcion: "Encontrado cerca del mercado. Tiene un pañuelo azul y está bien alimentado.", foto: u("photo-1561037404-61cd46aa615b"), contacto: "71234567" },
  { id: "4", nombre: "Rocky", especie: "Perro", raza: "Pug", color: "Mixto", tamano: "Pequeño", fecha: "2026-10-15", zona: "Tupuraya", estado: "perdido", descripcion: "Pug de 4 años, respira fuerte y le encanta la gente. Necesita medicación diaria.", foto: u("photo-1517849845537-4d257902454a"), contacto: "79876543" },
  { id: "5", nombre: "Sin nombre", especie: "Gato", color: "Atigrado", tamano: "Pequeño", fecha: "2026-10-16", zona: "Sacaba", estado: "encontrado", descripcion: "Gatito atigrado encontrado en la plaza principal de Sacaba. Muy cariñoso.", foto: u("photo-1574158622682-e40e69881006"), contacto: "72223344" },
  { id: "6", nombre: "Toby", especie: "Perro", color: "Blanco", tamano: "Mediano", fecha: "2026-10-12", zona: "Quillacollo", estado: "perdido", descripcion: "Perro blanco con mancha café en la oreja. Responde a su nombre.", foto: u("photo-1543466835-00a7907e9de1"), contacto: "73334455" },
];

let adoptables: Adoptable[] = [
  { id: "a1", nombre: "Canela", edad: "2 años", tamano: "Mediano", salud: "Vacunada, desparasitada y esterilizada", historia: "Canela fue rescatada de la calle en la Zona Sud. Es juguetona y se lleva bien con niños.", albergue: "Albergue Huellitas Cocha", foto: u("photo-1587300003388-59208cc962cb"), requisitos: REQ },
  { id: "a2", nombre: "Bruno", edad: "5 años", tamano: "Grande", salud: "Vacunado, esterilizado", historia: "Bruno es tranquilo y leal. Busca una familia con patio donde pueda descansar al sol.", albergue: "Refugio Patitas Felices", foto: u("photo-1583337130417-3346a1be7dee"), requisitos: REQ },
  { id: "a3", nombre: "Chispa", edad: "8 meses", tamano: "Pequeño", salud: "Primeras vacunas al día", historia: "Chispa llena de energía todo lugar al que va. Ideal para personas activas.", albergue: "Albergue Huellitas Cocha", foto: u("photo-1518717758536-85ae29035b6d"), requisitos: REQ },
  { id: "a4", nombre: "Nala", edad: "3 años", tamano: "Mediano", salud: "Vacunada, esterilizada, sana", historia: "Nala fue abandonada en Tiquipaya. Es dulce y aprende rápido.", albergue: "Refugio Patitas Felices", foto: u("photo-1477884213360-7e9d7dcc1e48"), requisitos: REQ },
];

let solicitudes: Solicitud[] = [
  { id: "s1", perroId: "a1", nombre: "María Rojas", telefono: "70011223", vivienda: "Casa con patio", experiencia: "Tuve dos perros", motivo: "Queremos una compañera para la familia.", fecha: "2026-10-18" },
  { id: "s2", perroId: "a3", nombre: "Jorge Vargas", telefono: "76655443", vivienda: "Departamento", experiencia: "Primera vez", motivo: "Vivo solo y quiero compañía.", fecha: "2026-10-19" },
];

let user: { nombre: string; correo: string } | null = null;

const listeners = new Set<() => void>();
let version = 0;
const emit = () => { version++; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export function useStore() {
  useSyncExternalStore(subscribe, () => version, () => version);
  return { pets, adoptables, solicitudes, user };
}

export const actions = {
  addPet(p: Omit<Pet, "id">) { const id = String(Date.now()); pets = [{ ...p, id }, ...pets]; emit(); return id; },
  addAdoptable(a: Omit<Adoptable, "id" | "requisitos">) { adoptables = [{ ...a, id: "a" + Date.now(), requisitos: REQ }, ...adoptables]; emit(); },
  removeAdoptable(id: string) { adoptables = adoptables.filter((a) => a.id !== id); emit(); },
  addSolicitud(s: Omit<Solicitud, "id" | "fecha">) { solicitudes = [{ ...s, id: "s" + Date.now(), fecha: new Date().toISOString().slice(0, 10) }, ...solicitudes]; emit(); },
  login(nombre: string, correo: string) { user = { nombre, correo }; emit(); },
  logout() { user = null; emit(); },
};

export const fmtFecha = (f: string) => new Date(f + "T12:00:00").toLocaleDateString("es-BO", { day: "numeric", month: "short", year: "numeric" });
export const PLACEHOLDER = u("photo-1450778869180-41d0601e046e");
