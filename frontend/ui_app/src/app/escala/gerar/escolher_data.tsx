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

  const { diasSelecionados, setDiasSelecionados } = useGeracaoEscala();

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

    // Dia novo → marcar/desmarcar normalmente
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

  function aplicarAlteracoes() {
    const novosDias = diasSelecionados
      .filter((dia) => !diasRemovidos.includes(dia))
      .concat(diasNovos)
      .sort((a, b) => a - b);

    setDiasSelecionados(novosDias);
    setDiasNovos([]);
    setDiasRemovidos([]);

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
      <div className="card-footer d-flex justify-content-end">
        <button className="btn  btn-primary" onClick={aplicarAlteracoes}>
          Avançar
        </button>
      </div>
    </div>
  );
}
