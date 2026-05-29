import React from "react";
import { ChevronDown, ChevronLeft, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import character from "../../../assets/donacida2 1.png";
import { findExerciseById } from "./data/exercises";
import styles from "./ExerciseListScreen.module.css";

export function ExerciseListScreen() {
  const navigate = useNavigate();
  const exercise = findExerciseById("towel-slide");

  return (
    <div className={styles.page}>
      <header className={styles.topBar} aria-label="Cabeçalho de exercícios">
        <button
          type="button"
          className={styles.topActionLeft}
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <ChevronLeft size={20} />
        </button>

        <img src={logo} alt="neuroviva" className={styles.logo} />

        <button
          type="button"
          className={styles.topAction}
          onClick={() => window.alert("Ajuda em breve")}
          aria-label="Ajuda"
        >
          <HelpCircle size={20} />
        </button>
      </header>

      <section className={styles.hero} aria-label="Resumo de exercícios">
        <div className={styles.heroText}>
          <h2 className={styles.title}>Exercícios</h2>
          <p className={styles.subtitle}>Rotina prescrita</p>
          <p className={styles.subsubtitle}>5x/semana • 3 momentos/dia</p>
        </div>
        <img src={character} alt="" className={styles.character} />
      </section>

      <details className={styles.disclosure} open>
        <summary className={styles.summary}>
          <div className={styles.summaryLeft}>
            <span className={styles.summaryTitle}>Objetivo</span>
            <span className={styles.summaryText}>Melhorar o movimento e a força</span>
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
            <span className={styles.summaryText}>Informações gerais do acompanhamento</span>
          </div>
          <ChevronDown size={18} className={styles.chev} />
        </summary>
        <div className={styles.disclosureBody}>
          <p className={styles.disclosureP}>
            Esta rotina foi selecionada para apoiar mobilidade e força do membro superior. Siga a frequência
            recomendada e registre suas práticas.
          </p>
        </div>
      </details>

      <section className={styles.section} aria-label="Rotina da manhã">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleRow}>
            <span className={styles.sectionIcon} aria-hidden="true">
              ☀
            </span>
            <h3 className={styles.sectionTitle}>Manhã</h3>
          </div>
          <ChevronDown size={18} className={styles.sectionChev} />
        </div>

        <div className={styles.exerciseCard}>
          <h4 className={styles.exerciseName}>{exercise?.name ?? "Deslizamento de toalha"}</h4>
          <p className={styles.exerciseMeta}>
            {(exercise?.levelLabel ?? "Leve") + " • " + (exercise?.durLabel ?? "2–3 min") + " • " + (exercise?.repsLabel ?? "1 série")}
          </p>

          <button
            type="button"
            className={styles.startButton}
            onClick={() => navigate("/app/exercises/towel-slide/intro")}
          >
            COMEÇAR
          </button>
        </div>
      </section>
    </div>
  );
}
