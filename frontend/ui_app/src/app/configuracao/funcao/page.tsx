'use client'
import  estiloP from "@/styles/padroes.module.css";
import { Funcao } from "@/model/funcao.model";
import { listarFuncao } from "@/services/api/funcao.rep";
import { useEffect, useState } from "react";

export default function FuncaoPage() {
  const [funcao, setFuncao] = useState<Funcao[]>([]);
 useEffect(() => {
  listarFuncao().then(setFuncao)
    .catch((err) =>
      console.error('Falha no requerimento, função: ' + err)
    );
}, []);

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Funções</h1>
      <div className="table-responsive w-75 shadow-sm table-sm rounded">
        <table className="table table-hover table-bordered align-middle mb-0">
          <thead >
            <tr >
              <th className={`${estiloP.cor} text-center px-4`}>Nº</th>
              <th className={`${estiloP.cor} w-100 ps-4`}>Nome</th>
              <th className={`${estiloP.cor} text-center px-5`}>Ações</th>
            </tr>
          </thead>
          <tbody >
              {funcao.map((fun, index) => (
                <tr key={fun.id}>
                  <th className="text-center">{index + 1}</th>
                  <td className="ps-4" >{fun.nome}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-warning"><i className="bi bi-pen-fill text-white"></i></button>
                    <button className="btn btn-danger"><i className="bi bi-trash-fill text-white"></i></button>                    
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
