import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useActivity } from "../../app/state/activity";
import { useSession } from "../../app/state/session";
import { BackButton } from "../../shared/ui/BackButton";
import { Button } from "../../shared/ui/Button";
import { findExerciseById } from "./data/exercises";
import styles from "./ExerciseCompletedScreen.module.css";

export function ExerciseCompletedScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exerciseId } = useParams();
  const { activities } = useActivity();
  const { activePatientId } = useSession();

  const exercise = useMemo(() => findExerciseById(exerciseId, activePatientId), [activePatientId, exerciseId]);

  const details = useMemo(() => {
    const fromState = location?.state && typeof location.state === "object" ? location.state : null;
    if (fromState?.repetitions || fromState?.series) {
      return {
        repetitions: fromState.repetitions ?? null,
        series: fromState.series ?? null,
      };
    }

    const last = (activities ?? []).find((a) => a?.type === "exercise" && String(a.exerciseId) === String(exerciseId));
    return {
      repetitions: typeof last?.repetitions === "number" ? last.repetitions : null,
      series: typeof last?.series === "number" ? last.series : null,
    };
  }, [activities, exerciseId, location?.state]);

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate("/app/exercises", { replace: true })} />
      <header className={styles.header} aria-label="Conclusão do exercício">
        <h2 className={styles.title}>Concluído</h2>
        <p className={styles.sub}>{exercise?.name ?? "Exercício"}</p>
      </header>

      <div className={styles.card} aria-label="Resumo">
        <div className={styles.row}>
          <span className={styles.label}>Séries</span>
          <span className={styles.value}>{details.series ? `${details.series}/${details.series}` : "-"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Repetições</span>
          <span className={styles.value}>{details.repetitions ?? "-"}</span>
        </div>
      </div>

      <div className={styles.actions} aria-label="Ações">
        <Button onClick={() => navigate(`/app/exercises/${exerciseId}`, { replace: true })}>REFAZER</Button>
        <Button variant="outline" onClick={() => navigate("/app/exercises", { replace: true })}>
          VOLTAR PARA EXERCÍCIOS
        </Button>
      </div>
    </div>
  );
}
