import { EscalaDia } from "@/model/escala_dia_config.model";
import { api } from "./api";
import { HistoricoLote } from "@/model/escala_resultado";

export const cadastrarDias = async (
  escalas: EscalaDia[],
  ano: number,
  mes: number,
) => {
  for (const escala of escalas) {
    console.log(escala.id);
    const data = new Date(ano, mes - 1, escala.dia);

    const payload = {
      data_esd: data.toISOString().split("T")[0], // YYYY-MM-DD
      horario_esd: escala.horario, // HH:MM:SS
      id_loc_fk: escala.localId,
      funcoes: escala.funcoes.map((f) => ({
        quantidade: f.quantidade,
        id_fun_fk: f.funcao.id,
      })),
    };

    try {
      await api.post("/escala-dia", payload);
    } catch (err) {
      console.log(err);
    }
  }
};

export const criarEscala = async (mes: number, ano: number) => {
  return api.post(`/gerar-escala/${ano}/${mes}`).then((res) => {
    return res.data;
  });
};

export const buscarTodasEscalas = async () => {
  const res = await api.get("/escala-resultado/lotes");
  return res.data.map((res: HistoricoLote) => ({
    lote: res.lote,
    ano: res.ano,
    mes: res.mes,
  }));
};

export const detelarEscalaLote = async (lote: string) => {
  return await api.delete(`/escala-resultado/lotes/${lote}`).then((res) => {
    return res.data.msg;
  });
};
