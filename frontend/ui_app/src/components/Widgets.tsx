"use client";

import { BotaoContext } from "@/services/provider/BotaoAtivoProvider";
import styles from "@/styles/widgets.module.css";
import Link from "next/link";
import { useContext } from "react";

interface Props {
  link: string;
  nome: string;
}

const BotaoNav: React.FC<Props> = ({ link, nome }) => {
  const contexto = useContext(BotaoContext);

  if (!contexto) return null;

  const { ativo, setAtivo } = contexto;
  return (
    <Link
      href={link}
      className={`${styles.btn} ${ativo === nome ? styles.ativo : null}`}
      onClick={() => setAtivo(nome)}
    >
      {nome} {}
    </Link>
  );
};

export default BotaoNav;
