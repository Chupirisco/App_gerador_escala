"use client";

import { useGeracaoEscala } from "@/services/providers/escala_dia.prov";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import ListaEscalasDia from "./lista_escala";
import { cadastrarDias, criarEscala } from "@/services/api/escala.rep";
import Notificacao from "@/components/Notificacao";
import { useRouter } from "next/navigation";

type ConfigurarDatasProps = {
  acao: Dispatch<SetStateAction<string>>;
};

export default function ConfigurarDatas({ acao }: ConfigurarDatasProps) {
  const router = useRouter();
  const {
    diasSelecionados,
    setDiaAtivo,
    diaAtivo,
    escalas,
    mes,
    ano,
    resetar,
  } = useGeracaoEscala();

  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

  function diaEstaConfigurado(dia: number) {
    if (diaAtivo === dia) return "btn-primary";

    const escalasDoDia = escalas.filter((e) => e.dia === dia);

    if (escalasDoDia.length === 0) return "btn-outline-secondary";

    const existeEscalaIncompleta = escalasDoDia.some(
      (e) => e.funcoes.length === 0 || e.funcoes.some((f) => f.quantidade <= 0),
    );

    if (existeEscalaIncompleta) return "btn-warning";

    return "btn-success";
  }

  function diasNoMes(ano: number, mes: number) {
    return new Date(ano, mes, 0).getDate();
  }

  function primeiroDiaSemana(ano: number, mes: number) {
    return new Date(ano, mes - 1, 1).getDay();
  }

  function gerarCalendario() {
    const totalDias = diasNoMes(ano, mes);
    const inicioSemana = primeiroDiaSemana(ano, mes);

    const cells: JSX.Element[] = [];

    // Espaços vazios antes do dia 1
    for (let i = 0; i < inicioSemana; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const habilitado = diasSelecionados.includes(dia);

      cells.push(
        <button
          key={dia}
          type="button"
          className={`btn btn-sm ${diaEstaConfigurado(dia)}`}
          onClick={() => habilitado && setDiaAtivo(dia)}
          disabled={!habilitado} // dias não selecionados ficam disabled
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

  async function aplicarAlteracoes() {
    // Verifica se todos os dias selecionados têm ao menos uma escala configurada
    const todosConfigurados = diasSelecionados.every((dia) => {
      const escalasDoDia = escalas.filter((e) => e.dia === dia);
      if (escalasDoDia.length === 0) return false; // nenhum registro de escala
      // se alguma escala do dia não tem função configurada, também não está ok
      return escalasDoDia.every((e) => e.funcoes.length > 0);
    });

    if (!todosConfigurados) {
      setNotMenssagem("certifique-se que todos os dias foram configurados!");
      setNotTipo("erro");
      setNot(true);
      return;
    }

    await cadastrarDias(escalas, ano, mes);
    await criarEscala(mes, ano);

    setNotMenssagem("Operação realizada com sucesso!");
    setNotTipo("sucesso");
    setNot(true);

    router.push(`/escala/historico/`);
    // Se passou na verificação, avança
    acao("funcao");
  }

  function voltarPagina() {
    resetar();
    acao("dias");
  }

  return (
    <div>
      {diaAtivo !== null && <ListaEscalasDia />}

      <div className="card-body">
        {/* Cabeçalho dos dias da semana */}
        <div
          className="d-grid mb-2 text-center fw-semibold text-muted"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendário completo do mês */}
        {gerarCalendario()}
      </div>

      <div className="card-footer d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={voltarPagina}>
          Voltar
        </button>
        <button className="btn btn-primary" onClick={aplicarAlteracoes}>
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
