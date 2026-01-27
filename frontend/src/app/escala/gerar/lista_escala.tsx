"use client";

import ModalConfigurarDia from "@/components/ModalConfiguracao";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import { Localidade } from "@/model/localidade.model";
import { listarLocalidade } from "@/services/api/localidade.rep";
import { useGeracaoEscala } from "@/services/providers/escala_dia.prov";
import { useEffect, useState } from "react";

export default function ListaEscalasDia() {
  const {
    diaAtivo,
    escalasDoDia,
    setEscalaAtivaId,
    escalaAtivaId,
    removerEscala,
  } = useGeracaoEscala();

  const [locais, setLocais] = useState<Localidade[]>([]);

  const [modalConf, setModalConf] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    listarLocalidade()
      .then(setLocais)
      .catch((err) => console.error("deu ruim", err));
  }, []);

  if (!diaAtivo) return null;

  const escalas = escalasDoDia(diaAtivo);

  return (
    <div className="card mt-3">
      {/* Modal */}
      {escalaAtivaId && <ModalConfigurarDia />}
      <div className="card-body">
        <div className="row g-2">
          {/* Card Nova Escala */}
          <div className="col-12 col-md-6 col-lg-2">
            <div
              className="card h-100 border-primary text-primary text-center cursor-pointer"
              role="button"
              onClick={() => setEscalaAtivaId("nova")}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                <strong>+ Nova escala</strong>
              </div>
            </div>
          </div>

          {/* Cards das escalas */}
          {escalas.map((escala) => {
            const local = locais.find((l) => l.id === escala.localId);

            return (
              <div key={escala.id} className="col-12 col-md-6 col-lg-3">
                <div
                  className="card h-100 cursor-pointer"
                  role="button"
                  onClick={() => setEscalaAtivaId(escala.id)}
                >
                  <div className="card-body d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="card-title mb-1">
                        {local?.nome ?? "Local não encontrado"}
                      </h6>

                      <small className="text-muted">
                        Horário: {escala.horario}
                      </small>

                      <div className="mt-2">
                        <span className="badge bg-success">
                          {escala.funcoes.length} funções
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn btn-sm btn-danger ms-2"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setId(escala.id);
                        setModalConf(true);
                      }}
                    >
                      <i className="bi bi-trash-fill text-white"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {modalConf && (
        <ModalConfirmacao
          mensagem="Deseja realmente excluir este registro?"
          onConfirmar={() => removerEscala(id)}
          onCancelar={() => setModalConf(false)}
        />
      )}
    </div>
  );
}
