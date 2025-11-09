import Link from "next/link";
import styles from "@/styles/menuLateral.module.css";
import Image from "next/image";

const MenuLateral: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src={"/images/logo.png"} alt="uma imagem" fill />
      </div>
      <hr className={styles.linha} />
      <nav className={styles.nav}>
        <Link href={"/inicio"}>ínicio</Link>
        <Link href={"/gerar"}>Gerar Escala</Link>
      </nav>
    </div>
  );
};

export default MenuLateral;
