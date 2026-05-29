import React, { useMemo, useState } from "react";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../assets/logo.png";
import towelSlideImage from "../../../assets/deslizamento_bia.gif";
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
        <header className={styles.topBar} aria-label="Cabeçalho do exercício">
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
            aria-label="Ajuda"
            onClick={() => window.alert("Ajuda em breve")}
          >
            <HelpCircle size={20} />
          </button>
        </header>

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
      <header className={styles.topBar} aria-label="Cabeçalho do exercício">
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
          aria-label="Ajuda"
          onClick={() => window.alert("Ajuda em breve")}
        >
          <HelpCircle size={20} />
        </button>
      </header>

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
