import ModalConfigurarDia from "@/components/ModalConfiguracao";
import { useGeracaoEscala } from "@/services/providers/escala_dia.prov";
import { Dispatch, SetStateAction } from "react";
import ListaEscalasDia from "./lista_escala";

type ConfigurarDatasProps = {
  acao: Dispatch<SetStateAction<string>>;
};

export default function ConfigurarDatas({ acao }: ConfigurarDatasProps) {
  const { diasSelecionados, setDiaAtivo, diaAtivo, escalas } =
    useGeracaoEscala();

  function diaEstaConfigurado(dia: number) {
    const escalasDoDia = escalas.filter((e) => e.dia === dia);

    if (escalasDoDia.length === 0) {
      return "btn-outline-secondary";
    }

    const existeEscalaIncompleta = escalasDoDia.some(
      (e) => e.funcoes.length === 0 || e.funcoes.some((f) => f.quantidade <= 0),
    );

    if (existeEscalaIncompleta) {
      return "btn-warning";
    }

    return "btn-success";
  }

  function aplicarAlteracoes() {
    acao("funcao");
  }

  function voltarPagina() {
    acao("dias");
  }

  function gerarTabela() {
    if (diasSelecionados.length === 0) {
      return (
        <div className="text-muted text-center">Nenhum dia selecionado</div>
      );
    }

    return (
      <div
        className="d-grid"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}
      >
        {[...diasSelecionados]
          .sort((a, b) => a - b)
          .map((dia) => (
            <button
              key={dia}
              type="button"
              className={`btn ${diaEstaConfigurado(dia)}`}
              onClick={() => setDiaAtivo(dia)}
            >
              {dia}
            </button>
          ))}
      </div>
    );
  }

  return (
    <div>
      {diaAtivo !== null && <ListaEscalasDia />}

      <div className="card-body">{gerarTabela()}</div>
      <div className="card-footer d-flex justify-content-between">
        <button className="btn  btn-secondary" onClick={voltarPagina}>
          Voltar
        </button>
        <button className="btn  btn-primary" onClick={aplicarAlteracoes}>
          Avançar
        </button>
      </div>
    </div>
  );
}
