import { api } from "./api";

export const listarFuncao = () => {
  return api.get("/funcao").then((res) => {
    return res.data.map((f: any) => ({
      id: f.id_fun,
      nome: f.nome_fun,
    }));
  });
};
