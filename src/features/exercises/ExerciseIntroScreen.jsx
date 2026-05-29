import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import towelSlideImage from "../../../assets/deslizamento_bia.gif";
import { ScreenHeader } from "../../shared/ui/ScreenHeader";
import { findExerciseById } from "./data/exercises";
import styles from "./ExerciseIntroScreen.module.css";

const INTRO_IMAGES_BY_ID = {
  "towel-slide": towelSlideImage,
};

const INTRO_CONTENT_BY_ID = {
  "towel-slide": {
    instruction: "Coloque a mão sobre uma toalha e se posicione",
    steps: ["Sente-se com os pés no chão", "Apoie as costas na cadeira", "Mão aberta sobre a toalha (sem forçar)"],
    footnote: "Se doer ou formigar, faça mais leve ou dê uma pausa",
  },
};

export function ExerciseIntroScreen() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const exercise = useMemo(() => findExerciseById(exerciseId), [exerciseId]);
  const introImage = INTRO_IMAGES_BY_ID[String(exerciseId)] ?? null;
  const content = INTRO_CONTENT_BY_ID[String(exerciseId)] ?? null;
  const [gifReplayKey, setGifReplayKey] = useState(0);

  if (!exercise) {
    return (
      <div className={styles.page}>
        <ScreenHeader ariaLabel="Cabeçalho do exercício" />
        <main className={styles.main}>
          <h1 className={styles.title}>Exercício</h1>
          <p className={styles.subtitle}>Exercício não encontrado.</p>

          <button type="button" className={styles.primary} onClick={() => navigate(-1)}>
            VOLTAR
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ScreenHeader ariaLabel="Cabeçalho do exercício" />
      <main className={styles.main}>
        <h1 className={styles.title}>{exercise.name}</h1>

        {content?.instruction ? <p className={styles.instruction}>{content.instruction}</p> : null}

        {introImage ? (
          <button
            type="button"
            className={styles.imageButton}
            onClick={() => setGifReplayKey((k) => k + 1)}
            aria-label="Reproduzir demonstração"
          >
            <img key={gifReplayKey} src={introImage} alt={exercise.name} className={styles.image} />
          </button>
        ) : (
          <div className={styles.imagePlaceholder} aria-label="Imagem do exercício indisponível" />
        )}

        {content?.steps?.length ? (
          <ol className={styles.steps} aria-label="Orientações">
            {content.steps.map((step) => (
              <li key={step} className={styles.stepItem}>
                {step}
              </li>
            ))}
          </ol>
        ) : null}

        <button type="button" className={styles.primary} onClick={() => navigate(`/app/exercises/${exercise.id}`)}>
          EXERCÍCIO
        </button>

        {content?.footnote ? (
          <p className={styles.footnote}>
            <strong>{content.footnote}</strong>
          </p>
        ) : null}
      </main>
    </div>
  );
}
