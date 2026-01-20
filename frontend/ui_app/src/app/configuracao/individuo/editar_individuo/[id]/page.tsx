'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Notificacao from "@/components/Notificacao";
import { Individuo } from "@/model/individuo.model";
import { Localidade } from "@/model/localidade.model";
import { editarIndividuo, buscarIndividuoPorId } from "@/services/api/individuo.rep";
import { listarLocalidade } from "@/services/api/localidade.rep";
import { isNull } from "util";

export default function EditarIndividuo() {
  const { id } = useParams();

  const [individuo, setIndividuo] = useState<Individuo | null>(null);
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("ativo");
  const [idLocal, setIdLocal] = useState<number | null>(null);

  const [local, setLocal] = useState<Localidade[]>([]);
  const [not, setNot] = useState(false);
  const [notMenssagem, setNotMenssagem] = useState("");
  const [notTipo, setNotTipo] = useState("");

 useEffect(() => {
  if (!id) return;

  buscarIndividuoPorId(Number(id)).then((res) => {
    setNome(res.nome);

    setStatus(res.status);
    setIdLocal(res.id_loc_fk);

    console.log(nome);
  });

}, [id]);


  /* Lista localidades */
  useEffect(() => {
    listarLocalidade().then(setLocal);
  }, []);

  const editar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !status || idLocal === null || id === null) {
      setNotMenssagem("Preencha todos os campos!");
      setNotTipo("erro");
      setNot(true);
      return;
    }

    const mensagem = await editarIndividuo(Number(id), nome, status, idLocal);

    if (mensagem.msg === "Sucesso") {
      setNotMenssagem("Operação realizada com sucesso!");
      setNotTipo("sucesso");
      setNot(true);
    }
  };



  return (
    <div className="w-100 d-flex align-items-center flex-column my-5">
      <h1>Editar Indivíduo</h1>

      <div className="card shadow-sm w-75 p-3 mt-5">
        <form className="row g-2 align-items-end" onSubmit={editar}>
          <div className="col-md-6">
            <label className="form-label">Nome</label>
            <input
              className="form-control"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Local</label>
            <select
              className="form-select"
              value={idLocal ?? ""}
              onChange={(e) =>
                setIdLocal(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Selecione</option>
              {local.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nome}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/configuracao/individuo"
            className="btn btn-outline-danger col-md-1 mx-2"
          >
            Cancelar
          </Link>

          <button className="btn btn-primary col-md-1 mx-2">
            Salvar
          </button>
        </form>
      </div>

      {not && (
        <div className="position-fixed end-0 bottom-0 p-3">
          <Notificacao
            mensagem={notMenssagem}
            onClose={() => setNot(false)}
            type={notTipo === "sucesso" ? "sucesso" : "erro"}
          />
        </div>
      )}
    </div>
  );
}
