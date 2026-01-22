'use client'

import { buscarIndividuoPorId } from "@/services/api/individuo.rep";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function CadastrarIndisponibilidade() {
    const { id } = useParams();

      const [nome, setNome] = useState("");

    useEffect(() => {
      if (!id) return;
    
      buscarIndividuoPorId(Number(id)).then((res) => {
        setNome(res.nome);
    

      });
    
    }, [id]);
    
    return (
        <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
            <h1 className="mb-5">Cadastrar Indisponibilidade</h1>
            <div className="card mb-4 shadow-sm w-75">
                <div className="card-body">                  
                    <h3 className="form-label" >Nome</h3>  
                    <div className="col-md-15">              
                        <input value={nome} type="text" disabled className="form-control"/>              
                    </div>
                </div>    
            </div>

            <div className="card mb-4 shadow-sm w-75">
                <div className="card-header">
                    <form className="row" action="#">
                        <div className="col-md-3">
                            <label className="form-label">Ano</label>
                            <input className="form-control"/>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Mês</label>
                            <input className="form-control"/>
                        </div>          
                    </form>                                             
                </div>
                <div className="card-body">
                </div>
            </div>
        </div>
       
    )
}