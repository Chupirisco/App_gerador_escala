"use client";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import { HistoricoEscala } from "@/model/escala_resultado";
import { Localidade } from "@/model/localidade.model";
import { buscarHistorico, excluirEscalaDia } from "@/services/api/escala.rep";
import { listarLocalidade } from "@/services/api/localidade.rep";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [resultados, setResultados] = useState<HistoricoEscala[]>([]); // original
  const [resultadosFiltrados, setResultadosFiltrados] = useState<
    HistoricoEscala[]
  >([]);

  const [filtroLocal, setFiltroLocal] = useState<number | null>(0);
  const [filtroDia, setFiltroDia] = useState<number | null>(null);
  const [filtroMes, setFiltroMes] = useState<number | null>(null);
  const [filtroAno, setFiltroAno] = useState<number | null>(null);

  const [local, setLocal] = useState<Localidade[]>([]);

  const [modalConf, setModalConf] = useState(false);
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    buscarHistorico().then((res) => {
      setResultados(res);
      setResultadosFiltrados(res);
    });

    listarLocalidade().then((res) => {
      setLocal(res);
    });
  }, []);

  const filtrar = (e: React.FormEvent) => {
    e.preventDefault();

    let filtrado = [...resultados];

    if (filtroLocal && filtroLocal !== 0) {
      filtrado = filtrado.filter((e) => e.id_loc === filtroLocal);
    }

    filtrado = filtrado.filter((escala) => {
      const [ano, mes, dia] = escala.data.split("-").map(Number);

      if (filtroAno && ano !== filtroAno) return false;
      if (filtroMes && mes !== filtroMes) return false;
      if (filtroDia && dia !== filtroDia) return false;

      return true;
    });

    setResultadosFiltrados(filtrado);
  };

  const excluir = async () => {
    try {
      await excluirEscalaDia(id!);

      setResultados((prev) => prev.filter((escala) => escala.id_esd !== id));

      setResultadosFiltrados((prev) =>
        prev.filter((escala) => escala.id_esd !== id),
      );
    } catch (err) {
      alert("Erro ao excluir a escala");
    }
  };

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Histórico</h1>
      <div className="card mb-4 shadow-sm w-75">
        <div className="card-body">
          <h3>Filtros</h3>
          <form className="row g-2 align-items-end" onSubmit={filtrar}>
            <div className="col-md-2">
              <label className="form-label">Local</label>
              <select
                className="form-select shadow-sm"
                value={filtroLocal!}
                onChange={(e) => setFiltroLocal(Number(e.target.value))}
              >
                <option value={""}>Escolha</option>
                {local.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Dia</label>
              <input
                type="number"
                min={1}
                max={31}
                className="form-control shadow-sm"
                onChange={(e) =>
                  setFiltroDia(e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
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

      <div className="row g-3 w-75">
        {resultadosFiltrados.map((escala) => (
          <div key={escala.id_esd} className="col-md-4">
            <div
              className="card shadow-sm h-100 cursor-pointer"
              role="button"
              onClick={() =>
                router.push(
                  `/escala/historico/historico_selecionado/${escala.id_esd}`,
                )
              }
            >
              <div className="card-body d-flex flex-column">
                {/* Cabeçalho */}
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">
                      {escala.local ?? "Local não informado"}
                    </h5>

                    <small className="text-muted">
                      {escala.data} - {escala.horario}
                    </small>
                  </div>

                  {/* Botão excluir */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation(); // agora funciona 100%
                      setId(escala.id_esd);
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
    </div>
  );
}
