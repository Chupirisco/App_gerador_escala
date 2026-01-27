import { Indisponibilidade } from "@/model/indisponibilidade";
import { api } from "./api"

export const criarIndisponibilidade = async (idInd: number, ano: number, mes: number, dias: number[]) => {
    return api.post('/indisponibilidade/lote', {
    "id_ind_fk": idInd,
    "ano": ano,
    "mes": mes,
    "dias": dias}).then((res) => {
        return res.data;
    });
}

export const buscarIndisponibilidadePorMes = async (idInd: number, ano: number, mes: number): Promise<Indisponibilidade> => {
    const res = await api.get(`/indisponibilidade/${idInd}/mes?ano=${ano}&mes=${mes}`); 
        return {
            mes: res.data.mes,
            ano: res.data.ano,
            id_ind_fk: res.data.id_ind_fk,
            dias: res.data.dias
        };
    
}
