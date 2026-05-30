import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import towelSlideImage from "../../../assets/deslizamento_bia.gif";
import towelSlidePreview from "../../../assets/Deslizamento de toalha.png";
import { useSession } from "../../app/state/session";
import { ScreenHeader } from "../../shared/ui/ScreenHeader";
import { findExerciseById } from "./data/exercises";
import styles from "./ExerciseIntroScreen.module.css";

const INTRO_IMAGES_BY_ID = {
  "towel-slide": towelSlideImage,
};

const INTRO_PREVIEWS_BY_ID = {
  "towel-slide": towelSlidePreview,
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
  const { activePatientId } = useSession();
  const exercise = useMemo(() => findExerciseById(exerciseId, activePatientId), [activePatientId, exerciseId]);
  const introImage = INTRO_IMAGES_BY_ID[String(exerciseId)] ?? null;
  const introPreview = INTRO_PREVIEWS_BY_ID[String(exerciseId)] ?? introImage;
  const content = INTRO_CONTENT_BY_ID[String(exerciseId)] ?? null;
  const [gifReplayKey, setGifReplayKey] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);

  function toggleDemo() {
    setIsDemoPlaying((isPlaying) => {
      if (!isPlaying) setGifReplayKey((k) => k + 1);
      return !isPlaying;
    });
  }

  if (!exercise) {
    return (
      <div className={styles.page}>
        <ScreenHeader ariaLabel="Cabeçalho do exercício" variant="authLike" />
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
      <ScreenHeader ariaLabel="Cabeçalho do exercício" variant="authLike" />
      <main className={styles.main}>
        <h1 className={styles.title}>{exercise.name}</h1>

        {content?.instruction ? <p className={styles.instruction}>{content.instruction}</p> : null}

        {introPreview ? (
          <button
            type="button"
            className={styles.imageButton}
            onClick={toggleDemo}
            aria-label={isDemoPlaying ? "Pausar demonstração" : "Reproduzir demonstração"}
          >
            <img
              key={isDemoPlaying ? gifReplayKey : "preview"}
              src={isDemoPlaying ? introImage : introPreview}
              alt={exercise.name}
              className={styles.image}
            />
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
