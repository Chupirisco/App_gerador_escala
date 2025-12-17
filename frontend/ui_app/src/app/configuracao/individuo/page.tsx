'use client'
import { Individuo } from "@/model/individuo.model";
import { listarIndividuo } from "@/services/api/individuo.rep";
import  estiloP from "@/styles/padroes.module.css";
import { useEffect, useState } from "react";



export default function IndividuoPage() {
  // useStates
  const [individuo, setIndividuo] = useState<Individuo[]>([]);
  const [individuoFiltro, setIndividuoFiltro] = useState<Individuo[]>([]);
  const [inativo, setInativo] = useState(false);

  // métodos
  const mostrarInativos = () => {
    setInativo(!inativo);
    console.log(inativo);
  }

  const carregarIndividuos  = async () =>  {
    try{
      const data = await listarIndividuo()
     setIndividuo(data);
     setIndividuoFiltro(individuo.filter(ind => ind.status === 'ativo'));     
    }catch(err){
      console.error("falha na requisição, individuo: " + err)
    }   
  }

  // useEffect
  useEffect(()=>{
   carregarIndividuos();
  },[]);

  useEffect(()=>{
    inativo ?
    setIndividuoFiltro(individuo) : setIndividuoFiltro(individuo.filter(ind => ind.status === 'ativo'));
  }, [inativo, individuo])

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Individuos</h1>
      <div className="table-responsive w-75 shadow-sm table-sm rounded">
        <table className="table table-hover table-bordered align-middle mb-0">
          <thead >
            <tr >
              <th className={`${estiloP.cor} text-center px-4`}>Nº</th>
              <th className={`${estiloP.cor} w-100 ps-4`}>Nome</th>
              <th className={`${estiloP.cor} text-center px-5`}>Status</th>
              <th className={`${estiloP.cor} text-center px-5`}>Ações</th>
            </tr>
          </thead>
          <tbody >
              {individuoFiltro.map((ind, index) => (
                <tr key={ind.id}>
                  <th className="text-center">{index + 1}</th>
                  <td className="ps-4" >{ind.nome}</td>
                  <td className='text-center'> 
                   <span
                    className={`badge rounded-2 p-2
                      ${ind.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                    {ind.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-warning"><i className="bi bi-pen-fill text-white"></i></button>
                    <button className="btn btn-danger"><i className="bi bi-trash-fill text-white"></i></button>                    
                  </td>
                </tr>
              ))}
          </tbody>        
        </table>
        <div className="d-flex bg-white justify-content-end py-2 px-3">
          <input type="checkbox" id="check" className="form-check-input"  onChange={mostrarInativos} />
          <label htmlFor="check" className="ms-2 form-check-label">Mostrar inativos </label>
        </div>
      </div>
    </div>
  );
}
