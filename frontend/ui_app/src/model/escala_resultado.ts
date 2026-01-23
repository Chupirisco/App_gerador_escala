export interface HistoricoResultado {
  id_esr: number;
  funcao: string;
  individuo: string | null;
}

export interface HistoricoEscala {
  id_esd: number;
  data: string;
  horario: string;
  local: string | null;
  resultados: HistoricoResultado[];
}
