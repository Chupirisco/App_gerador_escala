import { Individuo } from "@/model/individuo.model"
import { api } from "./api";


export const listarIndividuo = () => {
    return api.get<Individuo[]>("/individuo");
}