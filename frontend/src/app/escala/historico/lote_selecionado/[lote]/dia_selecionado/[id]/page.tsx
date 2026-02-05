"use client";

import { HistoricoResultado } from "@/model/escala_resultado";
import { buscarPorLoteEId } from "@/services/api/escala.rep";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams<{ lote: string; id: string }>();

  const { lote, id } = params;

  const [resultado, setResultado] = useState<HistoricoResultado | null>(null);

  useEffect(() => {
    if (!lote || !id) return;

    buscarPorLoteEId(lote.toString(), Number(id)).then((res) => {
      setResultado(res);
    });
  }, [lote, id]);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Histórico da Escala</h2>

      {!resultado ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="card shadow-sm border-0 p-4">
          {/* Cabeçalho */}
          <div className="mb-3">
            <h5 className="mb-1 text-primary">
              {resultado.data} — {resultado.horario}
            </h5>
            <p className="text-muted mb-0"> {resultado.local}</p>
          </div>

          <hr />

          {/* Tabela */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Função</th>
                  <th>Indivíduo</th>
                </tr>
              </thead>
              <tbody>
                {resultado.resultado.map((item, index) => (
                  <tr key={index}>
                    <td>{item.funcao}</td>
                    <td>{item.individuo ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
