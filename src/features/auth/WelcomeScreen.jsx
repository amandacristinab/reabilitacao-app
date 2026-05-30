import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import character from "../../../assets/donacida2 1.png";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header} aria-label="Neuroviva">
          <img src={logo} alt="neuroviva" className={styles.logo} />
        </header>

        <main className={styles.main}>
          <img src={character} alt="" className={styles.character} />

          <section className={styles.copy} aria-label="Apresentação">
            <h1 className={styles.title}>
              Sua companheira
              <br />
              na reabilitação
            </h1>
            <p className={styles.subtitle}>Treine e acompanhe sua evolução, de onde estiver!</p>
          </section>
        </main>

        <footer className={styles.footer}>
          <button type="button" className={styles.startAction} onClick={() => navigate("/auth")} aria-label="Começar">
            <span className={styles.startText}>COMEÇAR</span>
            <span className={styles.startButton} aria-hidden="true">
              <ChevronRight size={22} />
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
}
