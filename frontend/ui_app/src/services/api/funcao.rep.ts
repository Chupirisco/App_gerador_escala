import { Funcao } from "@/model/funcao.model";
import { api } from "./api";

export const listarFuncao = () => {
    return api.get<Funcao[]>("/funcao");
}