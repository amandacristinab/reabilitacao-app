import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader } from "./components/AuthHeader";
import { Button } from "../../shared/ui/Button";
import character from "../../../assets/donacida2 1.png";
import limbse from "../../../assets/logo_limbse.png";
import styles from "./AuthChoiceScreen.module.css";

export function AuthChoiceScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AuthHeader />

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
            <Button className={styles.authButton} onClick={() => navigate("/register/dados")}>
              CRIAR MINHA CONTA
            </Button>
            <Button className={styles.authButton} variant="outline" onClick={() => navigate("/login")}>
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
