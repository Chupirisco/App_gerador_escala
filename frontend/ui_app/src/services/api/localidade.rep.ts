import { api } from "./api"
import { Localidade } from "@/model/localidade.model"

export const listarLocalidade = () => {
    return api.get<Localidade[]>("/local");
}