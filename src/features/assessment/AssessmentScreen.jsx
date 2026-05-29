import React from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../shared/ui/BackButton";
import styles from "./AssessmentScreen.module.css";

export function AssessmentScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate(-1)} />
      <div className={styles.header}>
        <h2 className={styles.title}>Avaliação Física</h2>
        <p className={styles.sub}>Em breve</p>
      </div>

      <div className={styles.body}>
        <div className={styles.card}>
          <p className={styles.cardText}>
            Estamos preparando a avaliação física dentro do app para liberar treinos personalizados e acompanhamento
            profissional.
          </p>
        </div>
      </div>
    </div>
  );
}

