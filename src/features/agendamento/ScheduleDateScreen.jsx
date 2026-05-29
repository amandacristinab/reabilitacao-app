import React from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../shared/ui/BackButton";
import styles from "./ScheduleDateScreen.module.css";

export function ScheduleDateScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate(-1)} />
      <div className={styles.body}>
        <h2 className={styles.title}>Escolher data</h2>
        <p className={styles.sub}>Em breve</p>
      </div>
    </div>
  );
}

