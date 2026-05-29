import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import character from "../../../assets/fernandaMolde 2.png";
import { Button } from "../../shared/ui/Button";
import { loadTriageAnswers, saveTriageAnswers } from "./triageStorage";
import styles from "./TriageQuestionsScreen.module.css";

const QUESTIONS = [
  { id: "stroke_count", text: "Quantos AVCs você teve?", options: ["1", "2", "3 ou mais", "Não responder"] },
  { id: "last_stroke_when", text: "Quando foi o último AVC?", options: ["Até 3 meses", "3 a 6 meses", "Mais de 6 meses", "Não responder"] },
  { id: "stroke_type", text: "Qual tipo de AVC você teve?", options: ["Isquêmico", "Hemorrágico", "Mais de um tipo", "Não responder"] },
  {
    id: "brain_side",
    text: "O AVC foi em qual lado do cérebro?",
    options: ["Direito", "Esquerdo", "Os dois lados", "Não responder"],
  },
  {
    id: "body_side_most_affected",
    text: "Qual lado do corpo foi mais afetado?",
    options: ["Direito", "Esquerdo", "Os dois lados", "Não responder"],
  },
  {
    id: "caregiver",
    text: "Você tem um cuidador?",
    options: ["Não", "Sim, familiar ou amigo", "Sim, profissional", "Não responder"],
  },
  {
    id: "rehab_with_professional",
    text: "Você faz reabilitação com profissional?",
    options: ["Sim", "Não", "Já fiz, mas parei", "Não responder"],
  },
  {
    id: "rehab_professionals",
    text: "Faz reabilitação com quais profissionais?",
    type: "multi",
    options: ["Fisioterapeuta", "Terapeuta Ocupacional", "Fonoaudiólogo", "Outro", "Não responder"],
  },
];

function isAnswered(value) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

export function TriageQuestionsScreen() {
  const navigate = useNavigate();
  const totalSteps = QUESTIONS.length;
  const [answers, setAnswers] = useState(() => loadTriageAnswers());
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const loaded = loadTriageAnswers();
    setAnswers(loaded);

    const firstMissing = QUESTIONS.findIndex((q) => !loaded?.[q.id]);
    if (firstMissing === -1) setStepIndex(Math.max(0, totalSteps - 1));
    else setStepIndex(Math.max(0, firstMissing));
  }, [totalSteps]);

  const question = QUESTIONS[stepIndex] ?? null;
  const selected = question ? answers?.[question.id] : "";
  const canContinue = Boolean(question && isAnswered(selected));

  const progressLabel = useMemo(() => {
    const current = Math.min(totalSteps, Math.max(1, stepIndex + 1));
    return `Etapa ${current} de ${totalSteps}`;
  }, [stepIndex, totalSteps]);

  function setAnswer(questionId, value) {
    setAnswers((prev) => {
      const next = { ...(prev ?? {}) };
      next[questionId] = value;
      saveTriageAnswers(next);
      return next;
    });
  }

  function toggleMultiAnswer(questionId, value) {
    setAnswers((prev) => {
      const next = { ...(prev ?? {}) };
      const current = Array.isArray(next[questionId]) ? next[questionId] : [];

      if (value === "Não responder") {
        next[questionId] = ["Não responder"];
      } else {
        const withoutNoAnswer = current.filter((v) => v !== "Não responder");
        const exists = withoutNoAnswer.includes(value);
        next[questionId] = exists ? withoutNoAnswer.filter((v) => v !== value) : [...withoutNoAnswer, value];
      }

      saveTriageAnswers(next);
      return next;
    });
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((s) => s - 1);
    else navigate(-1);
  }

  function goNext() {
    if (!question) return;
    if (!canContinue) return;

    if (stepIndex < totalSteps - 1) {
      setStepIndex((s) => Math.min(totalSteps - 1, s + 1));
      return;
    }

    saveTriageAnswers(answers);
    navigate("/app/agendamento/whatsapp");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header} aria-label="Triagem">
        <button type="button" className={styles.iconButton} aria-label="Voltar" onClick={goBack}>
          <ChevronLeft size={22} strokeWidth={3} />
        </button>

        <img src={logo} alt="neuroviva" className={styles.logo} />

        <button
          type="button"
          className={styles.iconButton}
          aria-label="Ajuda"
          onClick={() => window.alert("Ajuda em breve")}
        >
          <HelpCircle size={20} />
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.card} aria-label="Pergunta">
          <div className={styles.questionRow}>
            <img src={character} alt="" className={styles.character} aria-hidden="true" />
            <h2 className={styles.question}>{question?.text ?? "Triagem"}</h2>
          </div>

          <p className={styles.progress} aria-label="Progresso">
            {progressLabel}
          </p>

          <div className={styles.options} role="group" aria-label="Respostas">
            {(question?.options ?? []).map((opt) => {
              const isMulti = question?.type === "multi";
              const selectedValues = Array.isArray(selected) ? selected : [];
              const isSelected = isMulti ? selectedValues.includes(opt) : selected === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={[styles.option, isSelected ? styles.optionSelected : ""].filter(Boolean).join(" ")}
                  onClick={() => (isMulti ? toggleMultiAnswer(question.id, opt) : setAnswer(question.id, opt))}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <Button type="button" className={styles.continue} disabled={!canContinue} onClick={goNext}>
              CONTINUAR
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
