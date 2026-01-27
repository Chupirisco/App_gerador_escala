"use client";
import Notificacao from "@/components/Notificacao";
import { Localidade } from "@/model/localidade.model";
import { criarIndividuo } from "@/services/api/individuo.rep";
import { listarLocalidade } from "@/services/api/localidade.rep";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CadastrarIndividuo() {
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("ativo");
  const [nivel, setNivel] = useState("");
  const [idLocal, setIdLocal] = useState<number | null>(null);
  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

  const [local, setLocal] = useState<Localidade[]>([]);

  useEffect(() => {
    try {
      listarLocalidade().then((res) => {
        setLocal(res);
      });
    } catch (err) {
      console.error("deu ruim " + err);
    }
  }, []);

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !status || idLocal === null || !nivel) {
      setNotMenssagem("Preencha todos os campos!");
      setNotTipo("erro");
      setNot(true);
      return;
    }

    try {
      const mensagem = await criarIndividuo(nome, status, nivel, idLocal);

      if (mensagem.msg === "Sucesso") {
        setNotMenssagem("Operação realizada com sucesso!");
        setNotTipo("sucesso");
        setNot(true);
        setNome("");
        setNivel("");
        setStatus("ativo");
        setIdLocal(null);
      }
    } catch (err) {
      console.error("deu ruim", err);
    }
  };

  return (
    <div className="w-100 h-auto d-flex align-items-center flex-column my-5">
      <h1>Cadastrar Individuos</h1>
      <div className="card shadow-sm w-75 p-3 mt-5">
        <form className="row align-items-end g-2" onSubmit={cadastrar}>
          <div className="col-md-15">
            <label className="form-label">Nome</label>
            <input
              type="text"
              placeholder="Nome do individuo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select shadow-sm"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Experiência</label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className="form-select shadow-sm"
            >
              <option value="">Nivel</option>
              <option value="experiente">Experiente</option>
              <option value="intermediario">Intermediário</option>
              <option value="novato">Novato</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Local</label>
            <select
              value={idLocal ?? ""}
              onChange={(e) => {
                const valor = e.target.value;
                setIdLocal(valor === "" ? null : Number(valor));
              }}
              className="form-select shadow-sm"
            >
              <option value="">Selecione um local</option>
              {local.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nome}
                </option>
              ))}
            </select>
          </div>

          {/* botões */}
          <Link
            href={"/configuracao/individuo/"}
            className="btn btn-outline-danger text-black col-md-1 mx-2"
          >
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary col-md-1 mx-2">
            Cadastrar
          </button>
        </form>
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
