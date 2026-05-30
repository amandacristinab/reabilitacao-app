import React from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "../../shared/ui/ScreenHeader";
import styles from "./ScheduleDateScreen.module.css";

export function ScheduleDateScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <ScreenHeader ariaLabel="Agendamento" onBack={() => navigate(-1)} variant="authLike" />
      <div className={styles.body}>
        <h2 className={styles.title}>Escolher data</h2>
        <p className={styles.sub}>Em breve</p>
      </div>
    </div>
  );
}

