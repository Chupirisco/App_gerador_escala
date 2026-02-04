export interface HistoricoResultado {
  id_esr: number;
  funcao: string;
  individuo: string | null;
}

export interface HistoricoLoteSelecionado {
  id_esr: number;
  id_esd: number;
  data: string;
  horario: string;
  local: string;
}

export interface HistoricoLote {
  lote: string;
  mes: number;
  ano: number;
}
