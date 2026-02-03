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
  id_loc: number;
  resultados: HistoricoResultado[];
}

export interface HistoricoLote {
  lote: string;
  mes: number;
  ano: number;
}
