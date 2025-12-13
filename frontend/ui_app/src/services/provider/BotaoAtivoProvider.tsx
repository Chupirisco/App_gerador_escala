"use client";

import { createContext, ReactNode, useState } from "react";

interface ContextProps {
  ativo: string;
  setAtivo: (v: string) => void;
}

export const BotaoContext = createContext<ContextProps | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export function BotaoProvider({ children }: ProviderProps) {
  const [ativo, setAtivo] = useState("Inicio");

  return (
    <BotaoContext.Provider value={{ ativo, setAtivo }}>
      {children}
    </BotaoContext.Provider>
  );
}
