import styles from "@/styles/menuLateral.module.css";
import Image from "next/image";
import BotaoNav from "./Widgets";

export default function MenuLateral() {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src={"/images/logo.png"} alt="uma imagem" fill />
      </div>
      <hr className={styles.linha} />
      <nav className={styles.nav}>
        <BotaoNav link="/inicio" nome="Inicio" />
        <BotaoNav link="/gerar" nome="Gerar Escala" />

        <div className={styles.config}>
          <BotaoNav link="/config" nome="settings" />
        </div>
      </nav>
    </div>
  );
}
