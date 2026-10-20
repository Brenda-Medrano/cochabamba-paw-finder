import { createFileRoute } from "@tanstack/react-router";
import { PetReportForm } from "@/components/PetReportForm";

export const Route = createFileRoute("/reportar-hallazgo")({
  head: () => ({ meta: [{ title: "Reportar hallazgo · FindMyPaw" }, { name: "description", content: "Publica una mascota que encontraste." }, { property: "og:title", content: "Reportar hallazgo · FindMyPaw" }, { property: "og:description", content: "Publica una mascota que encontraste." }] }),
  component: () => <PetReportForm tipo="encontrado" />,
});
