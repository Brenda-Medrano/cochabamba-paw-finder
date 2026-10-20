import { createFileRoute } from "@tanstack/react-router";
import { PetReportForm } from "@/components/PetReportForm";

export const Route = createFileRoute("/reportar-perdida")({
  head: () => ({ meta: [{ title: "Reportar pérdida · FindMyPaw" }, { name: "description", content: "Publica el reporte de tu mascota perdida." }, { property: "og:title", content: "Reportar pérdida · FindMyPaw" }, { property: "og:description", content: "Publica el reporte de tu mascota perdida." }] }),
  component: () => <PetReportForm tipo="perdido" />,
});
