'use client'
import  estiloP from "@/styles/padroes.module.css";
import { Funcao } from "@/model/funcao.model";
import { excluirFuncao, listarFuncao } from "@/services/api/funcao.rep";
import { useEffect, useState } from "react";
import Link from "next/link";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import { verificarNivel } from "@/services/utils/verificacoes";

export default function FuncaoPage() {
  const [funcao, setFuncao] = useState<Funcao[]>([]);
  const [funcaoFitro, setFuncaoFiltro] = useState<Funcao[]>([]);
  const [filtro, setFiltro] = useState('');
  
  const [idExcluir, setIdExcluir] = useState<number | null>(null);
  const [modalConf, setModalConf] = useState(false);

const filtrar = (e: React.FormEvent) => {
  e.preventDefault()

  setFuncaoFiltro(
    funcao.filter(fun =>
      fun.nome.toLowerCase().includes(filtro.toLowerCase())
    )
  )
}

  const excluir = async () => {
    try {
    
    const mensagem = await excluirFuncao(idExcluir!);
    if(mensagem.msg === "Sucesso"){
      setFuncao(prev => prev.filter(f => f.id !== idExcluir!));
      setFuncaoFiltro(prev => prev.filter(f => f.id !== idExcluir!));
    }  

    setModalConf(false);
    setIdExcluir(null);
  
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  


     const carregarLocal = async () =>  {
        try{
          const data = await listarFuncao()
          setFuncao(data);
          setFuncaoFiltro(data);
        }catch(err){
          console.error("falha na requisição, funcao: " + err)
        }   
      }
  
  useEffect(() => {
   carregarLocal()
  }, []);

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Funções</h1>

       <div className="d-flex justify-content-end w-75 mb-4">
          <Link href={'/configuracao/funcao/cadastrar_funcao/'} className="btn btn-primary">Cadastrar função +</Link>
        </div>
        <div className="card mb-4 shadow-sm w-75">        
          <div className="card-body">
            <h3 >Filtros</h3>
            <form className="row g-2 align-items-end" onSubmit={filtrar}>             
              <div className="col-md-11">                
                  <input type="text" className="form-control" placeholder="Filtrar por nome" onChange={(e)=> setFiltro(e.target.value)}/>
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
              <th className={`${estiloP.cor} text-center px-4`}>Experiência</th>
              <th className={`${estiloP.cor} text-center px-5`}>Ações</th>
            </tr>
          </thead>
          <tbody >
              {funcaoFitro.map((fun, index) => (
                
                <tr key={fun.id}>
                  <th className="text-center">{index + 1}</th>
                  <td className="ps-4" >{fun.nome}</td>
                  <td className="px-4" >{verificarNivel(fun.nivel)}</td>
                  <td className="d-flex justify-content-center gap-2">                 
                    <button
                    className="btn btn-danger"
                    onClick={() => {
                      setIdExcluir(fun.id)
                      setModalConf(true)
                    }}>
                    <i className="bi bi-trash-fill text-white"></i>
                  </button>                
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {modalConf && (
        <ModalConfirmacao
          mensagem="Deseja realmente excluir este registro?"
          onConfirmar={() => excluir()}
          onCancelar={() => setModalConf(false)}
        />
      )}
    </div>
  );
}
