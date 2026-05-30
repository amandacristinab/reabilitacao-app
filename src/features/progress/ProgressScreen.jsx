import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../app/state/session";
import { getDefaultPatient, getPatientById } from "../../shared/data/mockData";
import { useExerciseHistory } from "../../shared/hooks/useExerciseHistory";
import { BackButton } from "../../shared/ui/BackButton";
import styles from "./ProgressScreen.module.css";

export function ProgressScreen() {
  const navigate = useNavigate();
  const { activePatientId } = useSession();
  const patient = getPatientById(activePatientId) ?? getDefaultPatient();
  const entries = useExerciseHistory();
  const weeklyGoal = patient?.carePlan?.weeklyFrequency?.timesPerWeek ?? 1;

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate(-1)} />
      <header className={styles.header}>
        <h2 className={styles.title}>Progresso</h2>
        <p className={styles.sub}>Meta semanal: {weeklyGoal} treino(s)</p>
      </header>

      {entries.length === 0 ? (
        <div className={styles.card}>
          <p className={styles.text}>Você ainda não realizou exercícios.</p>
        </div>
      ) : (
        <div className={styles.card} aria-label="Histórico completo">
          <ul className={styles.list}>
            {entries.map((a) => {
              const dt = new Date(a.completedAt);
              const when = Number.isNaN(dt.getTime())
                ? ""
                : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(dt);
              const meta =
                typeof a?.repetitions === "number" && typeof a?.series === "number"
                  ? `${a.series} séries - ${a.repetitions} repetições`
                  : "";
              return (
                <li key={a.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <span className={styles.name}>{a.exerciseName}</span>
                    {meta ? <span className={styles.meta}>{meta}</span> : null}
                  </div>
                  <span className={styles.when}>{when}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
