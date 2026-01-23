"use client";
import { HistoricoEscala } from "@/model/escala_resultado";
import { Localidade } from "@/model/localidade.model";
import {
  buscarHistorico,
  buscarResultados,
  excluirEscalaDia,
} from "@/services/api/escala.rep";
import { listarLocalidade } from "@/services/api/localidade.rep";
import Link from "next/link";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";

export default function Page() {
  const [resultados, setResultados] = useState<HistoricoEscala[]>([]);

  const [filtroLocal, setFiltroLocal] = useState<number | null>(0);
  const [filtroData, setFiltroData] = useState("");

  const [local, setLocal] = useState<Localidade[]>([]);

  useEffect(() => {
    buscarHistorico().then((res) => {
      setResultados(res);
    });

    listarLocalidade().then((res) => {
      setLocal(res);
    });
  }, []);

  const filtrar = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const excluir = async (id: number) => {
    const confirmar = confirm("Tem certeza que deseja excluir esta escala?");
    if (!confirmar) return;

    try {
      await excluirEscalaDia(id);

      // remove do estado (sem recarregar a página)
      setResultados((prev) => prev.filter((escala) => escala.id_esd !== id));
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
            <div className="col-md-3">
              <label className="form-label">Local</label>
              <select
                className="form-select shadow-sm"
                value={filtroLocal!}
                onChange={(e) => setFiltroLocal(Number(e.target.value))}
              >
                <option>Escolha</option>
                {local.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Data</label>
              <input
                type="date"
                value={filtroData}
                className="form-control shadow-sm"
                onChange={(e) => setFiltroData(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary col-md-1">
              Filtrar
            </button>
          </form>
        </div>
      </div>

      <div className="row g-3 w-75">
        {resultados.map((escala) => (
          <div key={escala.id_esd} className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                {/* Cabeçalho */}
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">
                      {escala.local ?? "Local não informado"}
                    </h5>

                    <small className="text-muted">
                      {escala.data} • {escala.horario}
                    </small>
                  </div>

                  {/* Botão excluir */}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => excluir(escala.id_esd)}
                    title="Excluir escala"
                  >
                    ✕
                  </button>
                </div>

                <hr />

                {/* Resultados */}
                <div className="flex-grow-1">
                  {escala.resultados.map((r) => (
                    <div
                      key={r.id_esr}
                      className="d-flex justify-content-between"
                    >
                      <span>{r.funcao}</span>
                      <strong>{r.individuo ?? "—"}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
