"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/widgets.module.css";

interface Props {
  link: string;
  nome: string;
}

const BotaoNav: React.FC<Props> = ({ link, nome }) => {
  const pathname = usePathname();

  const ativo = pathname === link;

  return (
    <Link
      href={link}
      className={`${styles.btn} ${ativo ? styles.ativo : ""}`}
    >
      {nome}
    </Link>
  );
};

export default BotaoNav;
