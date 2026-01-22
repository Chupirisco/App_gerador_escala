"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/* =========================
   Tipagem do contexto
========================= */
type GeracaoEscalaContextType = {
  // dados da tabela escala_dia
  ano: number;
  mes: number;
  diasSalvos: number[];
  id_local: number;

  setAno: (ano: number) => void;
  setMes: (mes: number) => void;
  setIdLocal: (id_local: number) => void;
  setDiasSalvos: (dias: number[]) => void;
};

// Criação do Context
const GeracaoEscalaContext = createContext<
  GeracaoEscalaContextType | undefined
>(undefined);

// Provider
type GeracaoEscalaProviderProps = {
  children: ReactNode;
};

export function GeracaoEscalaProvider({
  children,
}: GeracaoEscalaProviderProps) {
  const hoje = new Date();

  const [ano, setAno] = useState<number>(hoje.getFullYear());
  const [mes, setMes] = useState<number>(hoje.getMonth() + 1);
  const [id_local, setIdLocal] = useState(0);
  const [diasSalvos, setDiasSalvos] = useState<number[]>([]);

  return (
    <GeracaoEscalaContext.Provider
      value={{
        ano,
        mes,
        id_local,
        diasSalvos,
        setAno,
        setMes,
        setIdLocal,

        setDiasSalvos,
      }}
    >
      {children}
    </GeracaoEscalaContext.Provider>
  );
}

// Hook de consumo
export function useGeracaoEscala() {
  const context = useContext(GeracaoEscalaContext);

  if (!context) {
    throw new Error(
      "useGeracaoEscala deve ser usado dentro de GeracaoEscalaProvider",
    );
  }

  return context;
}
