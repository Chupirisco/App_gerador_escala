"use client";

import { useState } from "react";

export default function Gerar() {
  const hoje = new Date();

  const [ano, setAno] = useState<number | null>(Number(hoje.getFullYear()));
  const [mes, setMes] = useState(Number(hoje.getMonth() + 1));

  const [diasSalvos, setDiasSalvos] = useState<number[]>([]);
  const [diasNovos, setDiasNovos] = useState<number[]>([]);
  const [diasRemovidos, setDiasRemovidos] = useState<number[]>([]);

  function diasNoMes(ano: number, mes: number) {
    return new Date(ano, mes, 0).getDate();
  }

  function primeiroDiaSemana(ano: number, mes: number) {
    return new Date(ano, mes - 1, 1).getDay();
  }

  function toggleDia(dia: number) {
    // Dia já salvo → marcar/desmarcar para remoção
    if (diasSalvos.includes(dia)) {
      setDiasRemovidos(
        (prev) =>
          prev.includes(dia)
            ? prev.filter((d) => d !== dia) // cancela remoção
            : [...prev, dia], // marca para remover
      );
      return;
    }

    // Dia novo → marcar/desmarcar normalmente
    setDiasNovos((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia],
    );
  }

  function renderCalendario() {
    if (!ano || !mes) {
      return (
        <div className="text-muted text-center">
          Selecione o ano e o mês para escolher os dias
        </div>
      );
    }

    const totalDias = diasNoMes(ano, mes);
    const inicioSemana = primeiroDiaSemana(ano, mes);

    const cells = [];

    for (let i = 0; i < inicioSemana; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const salvo = diasSalvos.includes(dia);
      const removido = diasRemovidos.includes(dia);
      const novo = diasNovos.includes(dia);

      let classe = "btn-outline-secondary";

      if (salvo && !removido) classe = "btn-success";
      else if (salvo && removido) classe = "btn-danger";
      else if (novo) classe = "btn-primary";

      cells.push(
        <button
          key={dia}
          type="button"
          className={`btn btn-sm ${classe}`}
          onClick={() => toggleDia(dia)}
        >
          {dia}
        </button>,
      );
    }

    return (
      <div
        className="d-grid"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}
      >
        {cells}
      </div>
    );
  }

  function aplicarAlteracoes() {
    setDiasSalvos((prev) => {
      const removidos = prev.filter((dia) => !diasRemovidos.includes(dia));

      const adicionados = diasNovos.filter((dia) => !removidos.includes(dia));

      return [...removidos, ...adicionados].sort((a, b) => a - b);
    });

    setDiasNovos([]);
    setDiasRemovidos([]);
  }

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
                className="form-control"
                value={ano ?? ""}
                onChange={(e) => {
                  setAno(Number(e.target.value));
                  setDiasNovos([]);
                }}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Mês</label>
              <input
                type="number"
                min={1}
                max={12}
                className="form-control"
                value={mes ?? ""}
                onChange={(e) => {
                  setMes(Number(e.target.value));
                  setDiasNovos([]);
                }}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="mb-2 fw-semibold text-center">Dias escaláveis</div>

          {/* Cabeçalho dos dias da semana */}
          <div
            className="d-grid mb-2 text-center fw-semibold text-muted"
            style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
          >
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendário */}
          {renderCalendario()}
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button className="btn  btn-primary" onClick={aplicarAlteracoes}>
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}
