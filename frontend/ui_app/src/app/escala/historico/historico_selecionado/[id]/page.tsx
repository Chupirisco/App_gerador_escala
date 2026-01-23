"use client";
import { EscalaResultado } from "@/model/escala_resultado";
import { buscarResultados } from "@/services/api/escala.rep";
import { useEffect, useState } from "react";

export default function Page() {
  const [resultados, setResultados] = useState<EscalaResultado[]>([]);

  useEffect(() => {
    buscarResultados().then((res) => {
      setResultados(res);
    });
  }, []);

  return (
    <div>
      Historico
      {resultados.map((r) => (
        <div key={r.id_esr} className="card mb-2">
          <div className="card-body">
            <h6 className="mb-1">{r.funcao}</h6>

            <small className="text-muted">
              {r.data} – {r.horario}
            </small>

            <div className="mt-2">
              {r.individuo ? (
                <span className="badge bg-success">{r.individuo}</span>
              ) : (
                <span className="badge bg-secondary">Não definido</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
