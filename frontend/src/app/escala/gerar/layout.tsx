import { GeracaoEscalaProvider } from "@/services/providers/escala_dia.prov";

export default function EscalaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GeracaoEscalaProvider>{children}</GeracaoEscalaProvider>;
}
