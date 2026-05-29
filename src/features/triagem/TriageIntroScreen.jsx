import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { Button } from "../../shared/ui/Button";
import logo from "../../../assets/logo.png";
import triagemImage from "../../../assets/triagem 1.png";
import styles from "./TriageIntroScreen.module.css";

export function TriageIntroScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header} aria-label="Triagem">
        <button type="button" className={styles.iconButton} aria-label="Voltar" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} strokeWidth={3} />
        </button>

        <img src={logo} alt="neuroviva" className={styles.logo} />

        <button
          type="button"
          className={styles.iconButton}
          aria-label="Ajuda"
          onClick={() => window.alert("Ajuda em breve")}
        >
          <HelpCircle size={20} />
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.illustrationWrap} aria-hidden="true">
          <div className={styles.illustrationBg} />
          <img src={triagemImage} alt="" className={styles.illustration} />
        </div>

        <section className={styles.copy} aria-label="Apresentação">
          <h2 className={styles.title}>Olá! Eu sou a Fernanda</h2>
          <p className={styles.subtitle}>
            Vou fazer algumas perguntas para a sua avaliação. Posso começar?
          </p>
        </section>

        <div className={styles.actions}>
          <Button onClick={() => navigate("/app/triagem/perguntas")}>VAMOS COMEÇAR</Button>

          <button type="button" className={styles.link} onClick={() => navigate("/app/agendamento/whatsapp")}>
            Pular triagem e agendar
          </button>
        </div>
      </main>
    </div>
  );
}
