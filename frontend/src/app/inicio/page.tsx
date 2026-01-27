"use client";

import { Funcao } from "@/model/funcao.model";
import { Individuo } from "@/model/individuo.model";
import { Localidade } from "@/model/localidade.model";
import { listarFuncao } from "@/services/api/funcao.rep";
import { listarIndividuo } from "@/services/api/individuo.rep";
import { listarLocalidade } from "@/services/api/localidade.rep";
import { useEffect, useState } from "react";
import styles from "@/styles/padroes.module.css";
import Link from "next/link";

export default function Inicio() {
  const [funcao, setFuncao] = useState<Funcao[]>([]);
  const [localidade, setLocalidade] = useState<Localidade[]>([]);
  const [individuo, setIndividuo] = useState<Individuo[]>([]);

  useEffect(() => {
    listarFuncao()
      .then(setFuncao)
      .catch((err) => console.error("falha na requisção, função: " + err));
  }, []);
  useEffect(() => {
    listarLocalidade()
      .then(setLocalidade)
      .catch((err) => console.error("falha na requisção, localidade: " + err));
  }, []);

  useEffect(() => {
    listarIndividuo()
      .then(setIndividuo)
      .catch((err) => console.error("falha na requisção, localidade: " + err));
  }, []);

  return (
    <div className="d-flex w-100 h-100 flex-column texto-pri py-5">
      <h1 className={`text-center w-100 ${styles.textPri}`}>
        Painel de Controle
      </h1>

      <div className="container text-center h-50 d-flex align-items-center">
        <div className="row w-100 h-25 ">
          <div className="col-12 col-md-4">
            <Link href={"/configuracao/individuo/"}>
              <button
                className={`btn-light w-100 h-100 border-0 ${styles.bdRadius} ${styles.boxShadow} ${styles.hoverShadow}`}
              >
                <i className={`bi bi-people-fill fs-1 ${styles.iconColor}`}></i>
                <br />
                Individuos Cadastrados: {<strong>{individuo.length}</strong>}
              </button>
            </Link>
          </div>
          <div className="col-12 col-md-4">
            <Link href={"/configuracao/localidade/"}>
              <button
                className={`btn-light w-100 h-100 border-0 ${styles.bdRadius} ${styles.boxShadow} ${styles.hoverShadow}`}
              >
                <i
                  className={`bi bi-geo-alt-fill fs-1 ${styles.iconColor}`}
                ></i>
                <br />
                Localidades Cadastradas: <strong>{localidade.length}</strong>
              </button>
            </Link>
          </div>
          <div className="col-12 col-md-4">
            <Link href={"/configuracao/funcao/"}>
              <button
                className={`btn-light w-100 h-100 border-0 ${styles.bdRadius} ${styles.boxShadow} ${styles.hoverShadow}`}
              >
                <i
                  className={`bi bi-person-badge-fill fs-1 ${styles.iconColor}`}
                ></i>
                <br />
                Funções Cadastradas: <strong>{funcao.length}</strong>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
