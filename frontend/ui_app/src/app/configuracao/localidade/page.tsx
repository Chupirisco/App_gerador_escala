'use client'
import  estiloP from "@/styles/padroes.module.css";

import { useEffect, useState } from "react";
import { Localidade } from "@/model/localidade.model";
import { listarLocalidade } from "@/services/api/localidade.rep";


export default function LocalidadePage() {
  const [local, setLocal] = useState<Localidade[]>([]);
  useEffect(()=>{
    listarLocalidade().then(setLocal).catch((err)=> console.error("falha na requisição, localidade: " + err));
  },[]);

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Localidade</h1>
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
              {local.map((loc, index) => (
                <tr key={loc.id}>
                  <th className="text-center">{index + 1}</th>
                  <td className="ps-4" >{loc.nome}</td>
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
