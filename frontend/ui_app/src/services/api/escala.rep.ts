import { EscalaDia } from "@/model/escala_dia_config.model";
import { api } from "./api";

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
