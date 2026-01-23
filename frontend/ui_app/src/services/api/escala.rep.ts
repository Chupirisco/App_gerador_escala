import { EscalaDia } from "@/model/escala_dia_config.model";
import { api } from "./api";
import { HistoricoEscala, HistoricoResultado } from "@/model/escala_resultado";

export const cadastrarDias = async (
  escalas: EscalaDia[],
  ano: number,
  mes: number,
) => {
  for (const escala of escalas) {
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

export const buscarResultados = async (): Promise<HistoricoResultado[]> => {
  const res = await api.get<HistoricoResultado[]>("/escala-resultado/");

  return res.data.map((i) => ({
    id_esr: i.id_esr,
    funcao: i.funcao,
    individuo: i.individuo,
  }));
};

export const buscarHistorico = async (): Promise<HistoricoEscala[]> => {
  const res = await api.get("/escala-dia/historico");
  return res.data;
};

export const excluirEscalaDia = async (id: number) => {
  await api.delete(`/escala-dia/${id}`);
};
