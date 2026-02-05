export interface HistoricoResultado {
  data: string;
  local: string;
  horario: string;
  resultado: resultado[];
}
// isso é pra ser usado no historico resultado pois vem desse jeito da api
type resultado = {
  funcao: string;
  individuo: string;
};

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
