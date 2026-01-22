"use client";

import Notificacao from "@/components/Notificacao";
import {
  buscarIndisponibilidadePorMes,
  criarIndisponibilidade,
} from "@/services/api/indisponibilidade.rep";
import { buscarIndividuoPorId } from "@/services/api/individuo.rep";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const hoje = new Date();
  const { id } = useParams();

  const [nome, setNome] = useState("");

  const [ano, setAno] = useState<number | null>(Number(hoje.getFullYear()));
  const [mes, setMes] = useState(Number(hoje.getMonth() + 1));
  const [diasSalvos, setDiasSalvos] = useState<number[]>([]);
  const [diasNovos, setDiasNovos] = useState<number[]>([]);
  const [diasRemovidos, setDiasRemovidos] = useState<number[]>([]);

  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

  useEffect(() => {
    if (!id) return;
    buscarIndividuoPorId(Number(id)).then((res) => {
      setNome(res.nome);
    });
  }, [id]);

  useEffect(() => {
    if (!id || !ano || !mes || ano < 2000 || mes < 1 || mes > 12) return;

    buscarIndisponibilidadePorMes(Number(id), ano, mes)
      .then((res) => {
        setDiasSalvos(res.dias);
        setDiasNovos([]);
        setDiasRemovidos([]);
      })
      .catch(() => {
        setDiasSalvos([]);
      });
  }, [id, ano, mes]);

  function diasNoMes(ano: number, mes: number) {
    return new Date(ano, mes, 0).getDate();
  }

  function primeiroDiaSemana(ano: number, mes: number) {
    return new Date(ano, mes - 1, 1).getDay();
  }

  function toggleDia(dia: number) {
    // Caso 1: dia já estava salvo
    if (diasSalvos.includes(dia)) {
      setDiasRemovidos(
        (prev) =>
          prev.includes(dia)
            ? prev.filter((d) => d !== dia) // cancela remoção
            : [...prev, dia], // marca para remover
      );
      return;
    }

    // Caso 2: dia novo
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

  const cadastrar = async () => {
    if (verificarNull()) {
      return;
    }

    if (diasNovos.length === 0 && diasRemovidos.length === 0) {
      setNotMenssagem("Nenhum dia selecionado!");
      setNotTipo("erro");
      setNot(true);
      return;
    }
    const diasFinais = [
      ...diasSalvos.filter((d) => !diasRemovidos.includes(d)),
      ...diasNovos,
    ];

    criarIndisponibilidade(Number(id), ano!, mes, diasFinais).then((res) => {
      if (res.msg === "Sucesso") {
        buscarIndisponibilidadePorMes(Number(id), ano!, mes).then((res) =>
          setDiasSalvos(res.dias),
        );
        (setDiasNovos([]), setDiasRemovidos([]));
        setNotMenssagem("Operação realizada com sucesso!");
        setNotTipo("sucesso");
        setNot(true);
        return;
      } else if (res.msg === "dias ja cadastrados") {
        setNotMenssagem("Dia(s) já cadastrado(s)!");
        setNotTipo("erro");
        setNot(true);
        return;
      }
      setNotMenssagem("Falha ao executar operação!");
      setNotTipo("erro");
      setNot(true);
      return;
    });
  };

  const verificarNull = () => {
    if (ano === null || ano < 2000 || mes === 0) {
      setNotMenssagem("Preencha corretamente os campos ANO e MÊS!");
      setNotTipo("erro");
      setNot(true);
      return true;
    }
    return false;
  };

  return (
    <div className="d-flex h-100 w-100 py-5 flex-column align-items-center">
      <h1 className="mb-5">Cadastrar Indisponibilidade</h1>
      <div className="card-body text-center border-warning mb-4 shadow-sm">
        <div className="alert alert-warning mb-0">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          Selecione um mês por vez!
          <br />
          Selecione os dias que o individuo selecionado <strong>
            não
          </strong>{" "}
          pode ser escalado
          <br />
        </div>
      </div>
      <div className="card mb-4 shadow-sm w-75">
        <div className="card-body">
          <h3 className="form-label">Nome</h3>
          <input value={nome} type="text" disabled className="form-control" />
        </div>
      </div>

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
          <div className="mb-2 fw-semibold text-center">Dias indisponíveis</div>

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

        <div className="card-footer gap-2 d-flex justify-content-end">
          <Link href={"/configuracao/individuo"} className="btn btn-secondary">
            Cancelar
          </Link>
          <button onClick={cadastrar} className="btn  btn-primary ">
            Confirmar
          </button>
        </div>
      </div>
      {not && (
        <div className="position-fixed end-0 bottom-0 p-3">
          <Notificacao
            mensagem={notMenssagem}
            onClose={() => setNot(false)}
            type={notTipo === "sucesso" ? "sucesso" : "erro"}
          ></Notificacao>
        </div>
      )}
    </div>
  );
}
