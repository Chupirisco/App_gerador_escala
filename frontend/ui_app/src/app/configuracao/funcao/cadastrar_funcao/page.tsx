"use client";

import Notificacao from "@/components/Notificacao";
import { criarFuncao } from "@/services/api/funcao.rep";
import Link from "next/link";
import { useState } from "react";

export default function CadastrarFuncao() {
  const [nome, setNome] = useState("");
  const [nivel, setNivel] = useState("");

  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nivel === "" || nome === "") {
      setNotMenssagem("Preencha todos os campos!");
      setNotTipo("erro");
      setNot(true);
      return;
    }

    try {
      const mensagem = await criarFuncao(nome, nivel);

      if (mensagem.msg === "Sucesso") {
        (setNotMenssagem("Operação realizada com sucesso!"),
          setNotTipo("sucesso"));
        setNot(true);
        setNome("");
        setNivel("");
      }
    } catch (err) {
      console.error("deu ruim" + err);
    }
  };
  return (
    <div className="w-100 h-auto d-flex align-items-center flex-column my-5">
      <h1>Cadastrar funções</h1>
      <div className="card shadow-sm w-75 p-3 mt-5">
        <form className="row align-items-end g-2" onSubmit={cadastrar}>
          <div className="col-md-9">
            <label className="form-label">Nome</label>
            <input
              type="text"
              placeholder="Nome da função"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Nivel de Experiência</label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className="form-select shadow-sm"
            >
              <option value="">Nivel</option>
              <option value="cerimoniario">Cerimoniário</option>
              <option value="intermediario">Intermediário</option>
              <option value="novato">Novato</option>
            </select>
          </div>
          {/* botões */}
          <Link
            href={"/configuracao/funcao/"}
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
            type={notTipo}
            onClose={() => setNot(false)}
          ></Notificacao>
        </div>
      )}
    </div>
  );
}
