"use client";

import Notificacao from "@/components/Notificacao";
import { useGeracaoEscala } from "@/services/providers/escala_dia.prov";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type EscolherDataProps = {
  ano: number;
  mes: number;
  avancar: Dispatch<SetStateAction<string>>;
};

export default function EscolherData({ ano, mes, avancar }: EscolherDataProps) {
  useEffect(() => {
    setDiasNovos([]);
    setDiasRemovidos([]);
    setDiasSelecionados([]);
  }, [ano, mes]);

  const [diasNovos, setDiasNovos] = useState<number[]>([]);
  const [diasRemovidos, setDiasRemovidos] = useState<number[]>([]);

  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

  const { diasSelecionados, setDiasSelecionados } = useGeracaoEscala();

  const [selecionarTudoChecked, setSelecionarTudoChecked] = useState(false);

  function diasNoMes(ano: number, mes: number) {
    return new Date(ano, mes, 0).getDate();
  }

  function primeiroDiaSemana(ano: number, mes: number) {
    return new Date(ano, mes - 1, 1).getDay();
  }

  function toggleDia(dia: number) {
    // Dia já salvo → marcar/desmarcar para remoção
    if (diasSelecionados.includes(dia)) {
      setDiasRemovidos(
        (prev: number[]) =>
          prev.includes(dia)
            ? prev.filter((d) => d !== dia) // cancela remoção
            : [...prev, dia], // marca para remover
      );
      return;
    }

    setDiasNovos((prev: number[]) =>
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
      const salvo = diasSelecionados.includes(dia);
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
  function selecionarTudo(checked: boolean) {
    if (!ano || !mes) return;

    const totalDias = diasNoMes(ano, mes);
    const todosOsDias = Array.from({ length: totalDias }, (_, i) => i + 1);

    if (checked) {
      setDiasNovos(todosOsDias);
    } else {
      setDiasNovos([]);
    }
  }

  function aplicarAlteracoes() {
    if (diasNovos.length === 0) {
      setNotMenssagem("Nenhum dia selecionado!");
      setNotTipo("erro");
      setNot(true);
      return;
    }

    const novosDias = diasSelecionados
      .filter((dia) => !diasRemovidos.includes(dia))
      .concat(diasNovos)
      .sort((a, b) => a - b);

    setDiasSelecionados(novosDias);
    setDiasNovos([]);
    setDiasRemovidos([]);

    setSelecionarTudoChecked(false);

    setNotMenssagem("Salvo!");
    setNotTipo("sucesso");
    setNot(true);

    avancar("funcao");
  }

  return (
    <div>
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
      <div className="card-footer d-flex justify-content-between align-items-center">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={selecionarTudoChecked}
            onChange={(e) => {
              setSelecionarTudoChecked(e.target.checked);
              selecionarTudo(e.target.checked);
            }}
          />

          <label className="form-check-label">Selecionar tudo</label>
        </div>
        <button className="btn  btn-primary" onClick={aplicarAlteracoes}>
          Avançar
        </button>
      </div>
      {not && (
        <div className="position-fixed end-0 bottom-0 p-3">
          <Notificacao
            mensagem={notMenssagem}
            onClose={() => setNot(false)}
            type={notTipo}
          ></Notificacao>
        </div>
      )}
    </div>
  );
}
