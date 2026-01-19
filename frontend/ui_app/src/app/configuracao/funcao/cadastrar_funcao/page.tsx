'use client'

import Notificacao from "@/components/Notificacao";
import { criarFuncao } from "@/services/api/funcao.rep";
import Link from "next/link";
import { useState } from "react";

export default function CadastrarFuncao(){
    
        const [nome, setNome] = useState("");
        const [not, setNot] = useState(false);
    
        const cadastrar = async (e: React.FormEvent) => {
            e.preventDefault();
    
            try{
                const mensagem = await criarFuncao(nome);
                
               if(mensagem.msg === "Sucesso"){
                    setNot(true);
                    setNome("")
               }
    
    
            }catch(err){
                console.error("deu ruim" + err);
            }
        }
     return (
        <div className="w-100 h-auto d-flex align-items-center flex-column my-5">
            <h1>Cadastrar funções</h1>
            <div className="card shadow-sm w-75 p-3 mt-5">
                <form className="row align-items-end g-2" onSubmit={cadastrar} >
                    <div className="col-md-15">
                        <label className="form-label">Nome</label>
                        <input type="text" placeholder="Nome da função" value={nome} onChange={(e) => setNome(e.target.value)} className="form-control"/>
                    </div>                  

                    {/* botões */}
                    <Link href={'/configuracao/funcao/'} className="btn btn-outline-danger text-black col-md-1 mx-2">Cancelar</Link>
                    <button type="submit" className="btn btn-primary col-md-1 mx-2">Cadastrar</button>
                </form>
            </div>     
           {not && 
           <div className="position-fixed end-0 bottom-0 p-3">
                <Notificacao mensagem="Operação realizada com sucesso!" onClose={() => setNot(false)} ></Notificacao>
           </div>
            }     
        </div>
    );
}