import { api } from "./api";


export const listarIndividuo = () => {
    return api.get('/individuo').then((res) =>{
       return res.data.map((i: any) => ({
            id: i.id_ind,
            nome: i.nome_ind,
            status: i.status_ind,
            id_loc_fk: i.id_loc_fk,

    }))
    })
}
