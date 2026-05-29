import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { ScreenHeader } from "../../shared/ui/ScreenHeader";
import triagemImage from "../../../assets/triagem 1.png";
import styles from "./TriageIntroScreen.module.css";

export function TriageIntroScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <ScreenHeader ariaLabel="Triagem" />

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
