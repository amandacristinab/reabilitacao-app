import React from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import character from "../../../assets/donacida2 1.png";
import { useSession } from "../../app/state/session";
import { getDefaultPatient, getExercisesForPatient, getPatientById } from "../../shared/data/mockData";
import { ScreenHeader } from "../../shared/ui/ScreenHeader";
import styles from "./ExerciseListScreen.module.css";

export function ExerciseListScreen() {
  const navigate = useNavigate();
  const { activePatientId } = useSession();
  const patient = getPatientById(activePatientId) ?? getDefaultPatient();
  const carePlan = patient?.carePlan ?? null;
  const hasCarePlan = Boolean(patient?.hasCarePlan && carePlan);
  const exercises = getExercisesForPatient(patient?.id);
  const exercise = exercises[0] ?? null;
  const frequency = carePlan?.weeklyFrequency;
  const firstPrescription = exercise?.prescriptions?.[0] ?? null;

  return (
    <div className={styles.page}>
      <ScreenHeader ariaLabel="Cabeçalho de exercícios" variant="authLike" />

      <section className={styles.hero} aria-label="Resumo de exercícios">
        <div className={styles.heroText}>
          <h2 className={styles.title}>Exercícios</h2>
          <p className={styles.subtitle}>{hasCarePlan ? "Rotina prescrita" : "Exercício demonstrativo"}</p>
          <p className={styles.subsubtitle}>
            {hasCarePlan && frequency
              ? `${frequency.timesPerWeek}x/semana - ${frequency.momentsPerDay} momentos/dia`
              : "Disponível sem avaliação"}
          </p>
        </div>
        <img src={character} alt="" className={styles.character} />
      </section>

      <details className={styles.disclosure} open>
        <summary className={styles.summary}>
          <div className={styles.summaryLeft}>
            <span className={styles.summaryTitle}>Objetivo</span>
            <span className={styles.summaryText}>
              {carePlan?.objective ?? exercise?.objective ?? "Apoiar mobilidade e controle do membro superior"}
            </span>
          </div>
          <ChevronDown size={18} className={styles.chev} />
        </summary>
        <div className={styles.disclosureBody}>
          <p className={styles.disclosureP}>
            Pratique no seu ritmo, mantendo o movimento controlado e sem dor. Se sentir desconforto, pause e retome
            com menor amplitude.
          </p>
        </div>
      </details>

      <details className={styles.disclosure}>
        <summary className={styles.summary}>
          <div className={styles.summaryLeft}>
            <span className={styles.summaryTitle}>Resumo do caso</span>
            <span className={styles.summaryText}>
              {hasCarePlan ? carePlan?.assessment?.affectedSegment ?? "Informações gerais do acompanhamento" : "Sem plano ativo"}
            </span>
          </div>
          <ChevronDown size={18} className={styles.chev} />
        </summary>
        <div className={styles.disclosureBody}>
          <p className={styles.disclosureP}>
            {hasCarePlan
              ? `Plano prescrito por ${carePlan?.professional?.name ?? "profissional de saúde"}.`
              : "Este exercício aparece como demonstração inicial e não substitui avaliação profissional."}
          </p>
        </div>
      </details>

      <section className={styles.section} aria-label={hasCarePlan ? "Rotina da manhã" : "Exercício disponível"}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleRow}>
            <span className={styles.sectionIcon} aria-hidden="true">
              {hasCarePlan ? "M" : "D"}
            </span>
            <h3 className={styles.sectionTitle}>{firstPrescription?.periodLabel ?? "Demonstração"}</h3>
          </div>
          <ChevronDown size={18} className={styles.sectionChev} />
        </div>

        {exercise ? (
          <div className={styles.exerciseCard}>
            <h4 className={styles.exerciseName}>{exercise.name}</h4>
            <p className={styles.exerciseMeta}>
              {(exercise.levelLabel ?? "Leve") + " - " + exercise.durLabel + " - " + exercise.repsLabel}
            </p>

            <button
              type="button"
              className={styles.startButton}
              onClick={() => navigate(`/app/exercises/${exercise.id}/intro`)}
            >
              COMEÇAR
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
