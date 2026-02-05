"use client";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import Notificacao from "@/components/Notificacao";
import { HistoricoLoteSelecionado } from "@/model/escala_resultado";
import {
  buscarEscalasLoteSelecionado,
  detelarEscalaId,
  detelarEscalaLote,
} from "@/services/api/escala.rep";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { lote } = useParams();
  //filtro
  const [resultados, setResultados] = useState<HistoricoLoteSelecionado[]>([]);
  const [resultadosFiltrados, setResultadosFiltrados] = useState<
    HistoricoLoteSelecionado[]
  >([]);
  const [filtroMes, setFiltroMes] = useState<number | null>(null);
  const [filtroAno, setFiltroAno] = useState<number | null>(null);

  //modal
  const [modalConf, setModalConf] = useState(false);

  //notificação
  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

  //excluir e abrir
  const [id, setId] = useState<number | null>();

  useEffect(() => {
    buscarEscalasLoteSelecionado(lote!.toString()).then((res) => {
      setResultados(res);
      setResultadosFiltrados(res);
    });
  }, []);

  const filtrar = (e: React.FormEvent) => {
    e.preventDefault();

    let filtrado = [...resultados];

    // filtrado = filtrado.filter((escala) => {
    //   if (escala.ano !== filtroAno && filtroAno !== null) return false;
    //   if (escala.mes !== filtroMes && filtroMes !== null) return false;
    //   return true;
    // });

    setResultadosFiltrados(filtrado);
  };

  const excluir = async () => {
    try {
      if (id === null) return;
      const res = await detelarEscalaId(id!);
      if (res !== "Sucesso") {
        setNotMenssagem("Falha ao excluir!");
        setNotTipo("erro");
        setNot(true);
        return;
      }

      setResultados((prev) => prev.filter((escala) => escala.id_esr !== id));
      setResultadosFiltrados((prev) =>
        prev.filter((escala) => escala.id_esr !== id),
      );
      setNotMenssagem("Operação realizado com sucesso!");
      setNotTipo("sucesso");
      setNot(true);
    } catch (err) {
      setNotMenssagem("Falha ao excluir!");
      setNotTipo("erro");
      setNot(true);
    }
  };

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Histórico</h1>
      <div className="card mb-4 shadow-sm w-75">
        <div className="card-body">
          <h3>Filtros</h3>
          <form className="row g-2 align-items-end" onSubmit={filtrar}>
            <div className="col-md-3">
              <label className="form-label">Mês</label>
              <select
                className="form-select shadow-sm"
                onChange={(e) =>
                  setFiltroMes(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Todos</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Ano</label>
              <input
                type="number"
                className="form-control shadow-sm"
                placeholder="Ex: 2026"
                onChange={(e) =>
                  setFiltroAno(e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>

            <button type="submit" className="btn btn-primary col-md-2">
              Filtrar
            </button>
          </form>
        </div>
      </div>

      <div className="row g-4 w-75">
        {resultadosFiltrados.map((escala, index) => (
          <div key={index} className="col-md-4">
            <div
              className="card h-100 shadow-sm border-0 escala-card"
              role="button"
              onClick={() =>
                router.push(
                  `/escala/historico/lote_selecionado/${lote}/dia_selecionado/${escala.id_esd}`,
                )
              }
            >
              <div className="card-body d-flex flex-column justify-content-between">
                {/* Cabeçalho */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold text-primary mb-1">
                      {escala.local}
                    </h6>
                    <small className="text-muted">
                      {escala.data} • {escala.horario}
                    </small>
                  </div>

                  {/* Botão excluir */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setId(escala.id_esr);
                      setModalConf(true);
                    }}
                    title="Excluir escala"
                  >
                    <i className="bi bi-trash-fill text-white"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalConf && (
        <ModalConfirmacao
          mensagem="Deseja realmente excluir este registro?"
          onConfirmar={() => excluir()}
          onCancelar={() => setModalConf(false)}
        />
      )}
      {not && (
        <div className="position-fixed end-0 bottom-0 p-3">
          <Notificacao
            mensagem={notMenssagem}
            type={notTipo}
            onClose={() => setNot(false)}
          ></Notificacao>
        </div>
      )}
    </div>
  );
}
