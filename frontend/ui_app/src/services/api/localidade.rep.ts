import { api } from "./api"

export const listarLocalidade = async ()  => {
    return api.get('/local').then((res)=> {
        return res.data.map((l: any) => ({
            id: l.id_loc,
            nome: l.nome_loc,
        }))
    } )
}

export const criarLocal = async (nome: string) => {
    return api.post('/local', 
        {
            "nome_loc": nome
        }).then((res) =>{
     return res.data;
    });
}


