"use client";
import { HistoricoEscala } from "@/model/escala_resultado";
import { buscarHistoricoPorId } from "@/services/api/escala.rep";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import estiloP from "@/styles/padroes.module.css";

export default function Page() {
  const { id } = useParams();

  const [resultados, setResultados] = useState<HistoricoEscala>();

  useEffect(() => {
    console.log("ID:", id, typeof id);
    buscarHistoricoPorId(Number(id)).then((res) => {
      setResultados(res);
    });
  }, []);

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h2 className="mb-4">Informações</h2>
      {/* Cabeçalho */}
      {resultados && (
        <div className="card mb-4 shadow-sm w-50">
          <div className="card-body text-center">
            {/* Local */}
            <h4 className="mb-2 fw-semibold">
              {resultados.local ?? "Local não informado"}
            </h4>

            {/* Data e horário */}
            <div className="d-flex justify-content-center gap-4 text-muted">
              <div className="d-flex align-items-center gap-1">
                <i className="bi bi-calendar-event"></i>
                <span>{resultados.data}</span>
              </div>

              <div className="d-flex align-items-center gap-1">
                <i className="bi bi-clock"></i>
                <span>{resultados.horario}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {resultados && (
        <div className="card shadow-sm w-75">
          {/* Corpo */}
          <div className="card-body p-0">
            {resultados.resultados.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle mb-0">
                  <thead>
                    <tr>
                      <th className={`${estiloP.cor} text-center px-5`}>
                        Função
                      </th>
                      <th className={`${estiloP.cor} text-center px-5`}>
                        Indivíduo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.resultados.map((r) => (
                      <tr key={r.id_esr}>
                        <td className="ps-5">{r.funcao}</td>
                        <td className="ps-5">
                          {r.individuo ?? (
                            <span className="text-muted">Não definido</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted m-3">
                Nenhuma função cadastrada para esta escala.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
