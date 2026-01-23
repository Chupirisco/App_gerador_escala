"use client";

import { Funcao } from "@/model/funcao.model";
import { Localidade } from "@/model/localidade.model";
import { listarFuncao } from "@/services/api/funcao.rep";
import { listarLocalidade } from "@/services/api/localidade.rep";
import { useGeracaoEscala } from "@/services/providers/escala_dia.prov";
import { useEffect, useState } from "react";

import estiloP from "@/styles/padroes.module.css";
import { FuncaoConfigurada } from "@/model/funcao_configurada.model";
import { EscalaDia } from "@/model/escala_dia_config.model";

export default function ModalConfigurarDia() {
  // vem do provider
  const {
    diaAtivo,
    setDiaAtivo,
    escalas,
    setEscalas,
    setEscalaAtivaId,
    escalaAtivaId,
  } = useGeracaoEscala();

  // useStates locais para popular as listas e selects
  const [local, setLocal] = useState<Localidade[]>([]);
  const [funcao, setFuncao] = useState<Funcao[]>([]);

  const [localSelecionado, setLocalSelecionado] = useState<number | null>(null);

  const [horario, setHorario] = useState("19:30");

  //lista com as funções
  const [funcoesConfiguradas, setFuncoesConfiguradas] = useState<
    FuncaoConfigurada[]
  >([]);

  //usereffec verifica se o dia selecionado ja tem algum cadastro no provider
  useEffect(() => {
    const diaSalvo = escalas.find((d) => d.id === escalaAtivaId);

    if (!diaSalvo) {
      // reset (novo dia)
      setLocalSelecionado(null);
      setHorario("19:30");
      setFuncoesConfiguradas([]);
      return;
    }

    // popular dados existentes
    setLocalSelecionado(diaSalvo.localId);
    setHorario(diaSalvo.horario);

    setFuncoesConfiguradas(
      diaSalvo.funcoes.map((f) => ({
        funcao: f.funcao,
        quantidade: f.quantidade,
      })),
    );
  }, [diaAtivo, escalas]);

  //padrao para carregar a lista de função e local
  useEffect(() => {
    try {
      listarLocalidade().then((res) => {
        setLocal(res);
      });

      listarFuncao().then((res) => {
        setFuncao(res);
      });
    } catch (err) {
      console.error("deu ruim " + err);
    }
  }, []);

  //função para carregar função
  function adicionarFuncao(idFuncao: number) {
    const funcaoEscolhida = funcao.find((f) => f.id === idFuncao);
    if (!funcaoEscolhida) return;

    setFuncoesConfiguradas((prev) => {
      if (prev.some((f) => f.funcao.id === idFuncao)) {
        return prev; // evitar funções duplicadas
      }

      return [
        ...prev,
        {
          funcao: funcaoEscolhida,
          quantidade: 1,
        },
      ];
    });
  }

  //remover função
  function removerFuncaoDaLista(id: number) {
    setFuncoesConfiguradas((prev) => prev.filter((f) => f.funcao.id !== id));
  }

  //mexer na quantidade de função
  function alterarQuantidade(idFuncao: number, quantidade: number) {
    if (quantidade < 1) return;

    setFuncoesConfiguradas((prev) =>
      prev.map((f) => (f.funcao.id === idFuncao ? { ...f, quantidade } : f)),
    );
  }

  // função final que salva a lista no provider
  function salvarDia(diaConfig: EscalaDia) {
    if (!diaConfig.localId || diaConfig.funcoes.length === 0) {
      // Aparecer notificação aqui !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      return;
    }

    setEscalas((prev) => {
      const existe = prev.some((e) => e.id === diaConfig.id);

      // edição
      if (existe) {
        return prev.map((e) => (e.id === diaConfig.id ? diaConfig : e));
      }

      // nova escala (mesmo dia pode ter várias!)
      return [...prev, diaConfig];
    });
  }

  return (
    <div>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block" tabIndex={-1}>
        <div
          className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
          style={{ maxWidth: "90vw" }}
        >
          <div className="modal-content h-75">
            <div className="modal-header pb-1">
              <h5 className="">Editar dia {diaAtivo}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setDiaAtivo(null)}
              />
            </div>
            <div
              className="modal-body"
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                paddingTop: "0.5rem",
              }}
            >
              <form
                action="#"
                className="row align-items-end g-2 d-flex justify-content-center"
              >
                <div className="col-md-3">
                  <label className="form-label">Local</label>
                  <select
                    className="form-select shadow-sm"
                    value={localSelecionado ?? ""}
                    onChange={(e) =>
                      setLocalSelecionado(Number(e.target.value))
                    }
                  >
                    <option value="" disabled>
                      Selecione o local
                    </option>
                    {local.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Horário</label>
                  <input
                    type="time"
                    className="form-control shadow-sm"
                    value={horario}
                    //arrumar isso
                    onChange={(e) => {
                      setHorario(e.target.value);
                    }}
                  />
                </div>

                {/* select das funções */}
                <select
                  className="form-select shadow-sm"
                  defaultValue=""
                  onChange={(e) => {
                    adicionarFuncao(Number(e.target.value));
                    e.currentTarget.value = "";
                  }}
                >
                  <option value="" disabled>
                    Selecione uma função
                  </option>
                  {funcao.map((fun) => (
                    <option key={fun.id} value={fun.id}>
                      {fun.nome}
                    </option>
                  ))}
                </select>

                {/* tabela */}
                <table className="table table-hover table-bordered align-middle mb-0">
                  <thead>
                    <tr>
                      <th className={`${estiloP.cor} text-center px-4`}>Nº</th>
                      <th className={`${estiloP.cor} w-100 ps-4`}>Nome</th>
                      <th className={`${estiloP.cor} text-center`}>
                        Quantidade
                      </th>
                      <th className={`${estiloP.cor} text-center px-5`}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {funcoesConfiguradas.map((item, index) => (
                      <tr key={item.funcao.id}>
                        <th className="text-center">{index + 1}</th>

                        <td className="ps-4">{item.funcao.nome}</td>

                        <td className="px-3">
                          <input
                            type="number"
                            min={1}
                            value={item.quantidade}
                            className="form-control"
                            onChange={(e) =>
                              alterarQuantidade(
                                item.funcao.id,
                                Number(e.target.value),
                              )
                            }
                          />
                        </td>

                        <td className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-danger"
                            type="button"
                            onClick={() => removerFuncaoDaLista(item.funcao.id)}
                          >
                            <i className="bi bi-trash-fill text-white"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
            </div>
            {/* Rodapé com os botões */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEscalaAtivaId(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  salvarDia({
                    id: crypto.randomUUID(),
                    dia: diaAtivo!,
                    localId: Number(localSelecionado),
                    horario,
                    funcoes: funcoesConfiguradas,
                    id_local: function (id_local: any): unknown {
                      throw new Error("Function not implemented.");
                    },
                  });
                  setEscalaAtivaId(null);
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
