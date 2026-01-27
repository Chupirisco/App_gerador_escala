"use client";
import Notificacao from "@/components/Notificacao";
import { criarLocal } from "@/services/api/localidade.rep";
import Link from "next/link";
import { useState } from "react";

export default function CadastrarLocal() {
  const [nome, setNome] = useState("");

  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nome === "") {
      setNotMenssagem("Preencha todos os campos!");
      setNotTipo("erro");
      setNot(true);
      return;
    }
    try {
      const mensagem = await criarLocal(nome);

      if (mensagem.msg === "Sucesso") {
        setNotMenssagem("Operação realizada com sucesso!");
        setNotTipo("sucesso");
        setNot(true);
        setNome("");
      }
    } catch (err) {
      console.error("deu ruim" + err);
    }
  };

  return (
    <div className="w-100 h-auto d-flex align-items-center flex-column my-5">
      <h1>Cadastrar Locais</h1>
      <div className="card shadow-sm w-75 p-3 mt-5">
        <form className="row align-items-end g-2" onSubmit={cadastrar}>
          <div className="col-md-15">
            <label className="form-label">Nome</label>
            <input
              type="text"
              placeholder="Nome do local"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="form-control"
            />
          </div>

          {/* botões */}
          <Link
            href={"/configuracao/localidade/"}
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
            type={notTipo}
          ></Notificacao>
        </div>
      )}
    </div>
  );
}
