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
        {/* Início */}
        <p className={`text-muted text-start px-4 mt-3 mb-1 small fw-semibold w-100 ${styles.sessaoCor}`}>
          Início
        </p>
        <BotaoNav link="/inicio" nome="Inicio" />

        {/* Configurações */}
        <p className={`text-muted text-start px-4 mt-3 mb-1 small fw-semibold w-100 ${styles.sessaoCor}`}>
          Configurações
        </p>
        <BotaoNav link="/configuracao/funcao" nome="Função" />
        <BotaoNav link="/configuracao/localidade" nome="Localidade" />
        <BotaoNav link="/configuracao/individuo" nome="Individuo" />        

    
        {/* Escala */}
        <p className={`text-muted text-start px-4 mt-3 mb-1 small fw-semibold w-100 ${styles.sessaoCor}`}>
          Escala
        </p>
        <BotaoNav link="/escala/gerar" nome="Gerar Escala" />

        <div className={styles.config}>
        <BotaoNav link="/config" nome="Configurações"/>
        </div>

      </nav>
    </div>
  );
}
