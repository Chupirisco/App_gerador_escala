"use client";

import { EscalaDia } from "@/model/escala_dia_config.model";
import { createContext, useContext, useState, ReactNode } from "react";

// Tipagem do contexto

// esses dados armazenados sao temporarios
type GeracaoEscalaContextType = {
  ano: number;
  setAno: (ano: number) => void;

  mes: number;
  setMes: (mes: number) => void;

  diasSelecionados: number[];
  setDiasSelecionados: (dias: number[]) => void;

  diaAtivo: number | null;
  setDiaAtivo: (dia: number | null) => void;

  escalas: EscalaDia[];
  setEscalas: React.Dispatch<React.SetStateAction<EscalaDia[]>>;

  escalaAtivaId: string | null;
  setEscalaAtivaId: (id: string | null) => void;

  escalasDoDia: (dia: number) => EscalaDia[];
  resetar: () => void;
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

  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);

  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);
  const [diaAtivo, setDiaAtivo] = useState<number | null>(null);

  const [escalas, setEscalas] = useState<EscalaDia[]>([]);
  const [escalaAtivaId, setEscalaAtivaId] = useState<string | null>(null);

  function escalasDoDia(dia: number) {
    return escalas.filter((e) => e.dia === dia);
  }

  function resetar() {
    setDiasSelecionados([]);
    setDiaAtivo(null);
    setEscalas([]);
    setEscalaAtivaId(null);
  }

  return (
    <GeracaoEscalaContext.Provider
      value={{
        ano,
        mes,
        setAno,
        setMes,

        resetar,

        diasSelecionados,
        setDiasSelecionados,

        diaAtivo,
        setDiaAtivo,

        escalas,
        setEscalas,

        escalaAtivaId,
        setEscalaAtivaId,

        escalasDoDia,
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
