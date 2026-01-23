"use client";

import { useState } from "react";
import EscolherData from "./escolher_data";
import ConfigurarDatas from "./configurar_datas";

export default function Gerar() {
  const hoje = new Date();

  const [ano, setAno] = useState<number | null>(Number(hoje.getFullYear()));
  const [mes, setMes] = useState(Number(hoje.getMonth() + 1));

  const [pagina, setPagina] = useState("dias");

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Gerar Escala</h1>
      <div className="card mb-4 shadow-sm w-75">
        <div className="card-header">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Ano</label>
              <input
                type="number"
                min={2000}
                className="form-control"
                disabled={pagina !== "dias"}
                value={ano ?? ""}
                onChange={(e) => {
                  setAno(Number(e.target.value));
                }}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Mês</label>
              <input
                type="number"
                min={1}
                max={12}
                disabled={pagina !== "dias"}
                className="form-control"
                value={mes ?? ""}
                onChange={(e) => {
                  setMes(Number(e.target.value));
                }}
              />
            </div>
          </div>
        </div>

        {pagina === "dias" && (
          <EscolherData ano={ano!} mes={mes} avancar={setPagina} />
        )}

        {pagina === "funcao" && <ConfigurarDatas acao={setPagina} />}
      </div>
    </div>
  );
}
