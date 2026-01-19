'use client'
import  estiloP from "@/styles/padroes.module.css";

import { useEffect, useState } from "react";
import { Localidade } from "@/model/localidade.model";
import { listarLocalidade } from "@/services/api/localidade.rep";
import Link from "next/link";


export default function LocalidadePage() {
  const [local, setLocal] = useState<Localidade[]>([]);
  const [localFiltro, setlocalFiltro] = useState<Localidade[]>([]);

  const [filtro, setFiltro] = useState('');

  const filtrar = (e: React.FormEvent) => {
    e.preventDefault();

    let lista = [...local];

    setlocalFiltro(
      lista.filter(loc =>
        loc.nome.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  };


    const carregarLocal = async () =>  {
      try{
        const data = await listarLocalidade()
        setLocal(data);
        setlocalFiltro(data);
      }catch(err){
        console.error("falha na requisição, local: " + err)
      }   
    }

  useEffect(()=>{
   carregarLocal();
  },[]);

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Localidade</h1>

        <div className="d-flex justify-content-end w-75 mb-4">
          <Link href={'/configuracao/localidade/cadastrar_local/'}>
           <button className="btn btn-primary" >Cadastrar local +</button>
          </Link>
         
        </div>
        <div className="card mb-4 shadow-sm w-75">        
          <div className="card-body">
            <h3 >Filtros</h3>
            <form className="row g-2 align-items-end" onSubmit={filtrar}>             
              <div className="col-md-11">                
                  <input type="text" className="form-control" placeholder="Buscar por nome" onChange={(e)=> setFiltro(e.target.value)}/>
              </div>            
              <button type="submit" className="btn btn-primary col-md-1">Filtrar</button>
            </form>        
          </div>  
      </div>     

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
              {localFiltro.map((loc, index) => (
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
