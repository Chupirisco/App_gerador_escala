import { FuncaoConfigurada } from "./funcao_configurada.model";

export type EscalaDia = {
  id_local(id_local: any): unknown;
  id: string;
  dia: number;
  localId: number;
  horario: string;
  funcoes: FuncaoConfigurada[];
};
