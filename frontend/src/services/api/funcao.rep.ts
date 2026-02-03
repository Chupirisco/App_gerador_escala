import { api } from "./api";

export const listarFuncao = async () => {
  const res = await api.get("/funcao");
  return res.data.map((f: any) => ({
    id: f.id_fun,
    nome: f.nome_fun,
    nivel: f.nivel_fun,
  }));
};

export const criarFuncao = async (nome: string, nivel: string) => {
  return api
    .post("/funcao", {
      nome_fun: nome,
      nivel_fun: nivel,
    })
    .then((res) => {
      return res.data;
    });
};

export const excluirFuncao = async (id: number) => {
  return api.delete(`/funcao/${id}`).then((res) => {
    return res.data;
  });
};
