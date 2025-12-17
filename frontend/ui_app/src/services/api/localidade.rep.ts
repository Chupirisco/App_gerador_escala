import { api } from "./api"

export const listarLocalidade = () => {
    return api.get('/local').then((res)=> {
        return res.data.map((l: any) => ({
            id: l.id_loc,
            nome: l.nome_loc,
        }))
    } )
}


