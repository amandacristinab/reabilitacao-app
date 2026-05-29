import React from "react";
import { CircleHelp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import logo from "../../../assets/logo.png";
import character from "../../../assets/donacida2 1.png";
import limbse from "../../../assets/BottonLimbse.png";
import styles from "./AuthChoiceScreen.module.css";

export function AuthChoiceScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <header className={styles.header} aria-label="Neuroviva">
          <div className={styles.headerSide} aria-hidden="true" />
          <img src={logo} alt="neuroviva" className={styles.logo} />
          <button type="button" className={styles.helpButton} aria-label="Ajuda" disabled>
            <CircleHelp size={22} />
          </button>
        </header>

        <main className={styles.main} aria-label="Entrar ou criar conta">
          <img src={character} alt="" className={styles.character} />

          <section className={styles.copy} aria-label="Acesso">
            <p className={styles.line}>
              <strong>Novo por aqui?</strong> Crie sua conta
            </p>
            <p className={styles.line}>
              <strong>Já tem conta?</strong> Entre.
            </p>
          </section>

          <div className={styles.actions}>
            <Button onClick={() => navigate("/register/dados")}>CRIAR MINHA CONTA</Button>
            <Button variant="outline" onClick={() => navigate("/login")}>
              ENTRAR
            </Button>
          </div>
        </main>

        <footer className={styles.footer} aria-label="Limbse">
          <img src={limbse} alt="Limbse" className={styles.limbse} />
        </footer>
      </div>
    </div>
  );
}
