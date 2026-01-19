import { api } from "./api";

export const listarFuncao = async () => {
  const res = await api.get("/funcao");
  return res.data.map((f: any) => ({
    id: f.id_fun,
    nome: f.nome_fun,
  }));
};

export const criarFuncao = async (nome: string) => {
  return api.post('/funcao', {
    "nome_fun": nome
  }).then((res)=> {
    return res.data;
  });
}
