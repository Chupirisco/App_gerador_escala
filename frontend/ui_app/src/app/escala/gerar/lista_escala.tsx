"use client";

import ModalConfigurarDia from "@/components/ModalConfiguracao";
import { Localidade } from "@/model/localidade.model";
import { listarLocalidade } from "@/services/api/localidade.rep";
import { useGeracaoEscala } from "@/services/providers/escala_dia.prov";
import { useEffect, useState } from "react";

export default function ListaEscalasDia() {
  const { diaAtivo, escalasDoDia, setEscalaAtivaId, setDiaAtivo } =
    useGeracaoEscala();

  const [locais, setLocais] = useState<Localidade[]>([]);

  useEffect(() => {
    listarLocalidade()
      .then(setLocais)
      .catch((err) => console.error("deu ruim", err));
  }, []);

  const escalas = escalasDoDia(diaAtivo!);

  return (
    <div className="card mt-3">
      <h1>Esta tela</h1>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Escalas do dia {diaAtivo}</h5>

        <button
          className="btn btn-sm btn-primary"
          onClick={() => setEscalaAtivaId("nova")}
        >
          + Nova escala
        </button>
      </div>

      <div className="card-body">
        {escalas.length === 0 && (
          <div className="text-muted text-center">
            Nenhuma escala cadastrada
          </div>
        )}

        <div className="list-group">
          {escalas.map((escala) => {
            const local = locais.find((l) => l.id === escala.localId);

            return (
              <button
                key={escala.id}
                className="list-group-item list-group-item-action d-flex justify-content-between"
                onClick={() => setEscalaAtivaId(escala.id)}
              >
                <span>
                  {local?.nome ?? "Local não encontrado"} — {escala.horario}
                </span>

                <span className="badge bg-success">
                  {escala.funcoes.length} funções
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-footer d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => setDiaAtivo(null)}>
          Voltar
        </button>
      </div>

      <ModalConfigurarDia />
    </div>
  );
}
