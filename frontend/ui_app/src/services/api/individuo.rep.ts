import { api } from "./api";


export const listarIndividuo = async () => {
    const res = await api.get('/individuo');
    return res.data.map((i: any) => ({
        id: i.id_ind,
        nome: i.nome_ind,
        status: i.status_ind,
        id_loc_fk: i.id_loc_fk,
    }));
}

export const criarIndividuo = async (nome: string, status: string, id: number) => {
    return api.post('/individuo', {
        "nome_ind": nome,
        "status_ind": status,
        "id_loc_fk": id
    }).then((res) => {
        return res.data;
    });
}

export const excluirIndividuo = async (id: number) => {
    return api.delete(`/individuo/${id}`).then((res) => {
        return res.data;
    });
}

