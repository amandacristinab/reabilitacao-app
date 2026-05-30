import React, { useMemo } from "react";
import { ClipboardList, Dumbbell, HelpCircle, LogOut, Sparkles, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../app/state/session";
import { getDefaultPatient, getPatientById } from "../../shared/data/mockData";
import { useExerciseHistory } from "../../shared/hooks/useExerciseHistory";
import { loadWhatsAppPhoneDigits } from "../agendamento/whatsappPhoneStorage";
import { loadTriageAnswers } from "../triagem/triageStorage";
import logo from "../../../assets/logo.png";
import character from "../../../assets/donacida2 1.png";
import styles from "./DashboardScreen.module.css";

const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const DONE_COLORS = ["#f43f5e", "#f59e0b", "#3b82f6", "#22c55e", "#14b8a6", "#a855f7", "#0ea5e9"];

const JOURNEY = {
  NO_TRIAGE: "no_triage",
  ASSESSMENT_IN_PROGRESS: "assessment_in_progress",
  CARE_PLAN_ACTIVE: "care_plan_active",
};

function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hasStoredTriageAnswers() {
  return Object.keys(loadTriageAnswers()).length > 0;
}

function getDashboardJourney(patient) {
  if (patient?.hasCarePlan && patient?.carePlan) return JOURNEY.CARE_PLAN_ACTIVE;

  const hasTriage = Boolean(patient?.triageCompleted || hasStoredTriageAnswers());
  const hasScheduleStarted = Boolean(loadWhatsAppPhoneDigits());

  if (hasTriage || hasScheduleStarted) return JOURNEY.ASSESSMENT_IN_PROGRESS;
  return JOURNEY.NO_TRIAGE;
}

export function DashboardScreen() {
  const navigate = useNavigate();
  const { activePatientId, userName, logout } = useSession();
  const exerciseHistory = useExerciseHistory();
  const patient = getPatientById(activePatientId) ?? getDefaultPatient();
  const carePlan = patient?.carePlan ?? null;
  const journey = getDashboardJourney(patient);
  const hasCarePlan = journey === JOURNEY.CARE_PLAN_ACTIVE;
  const isAssessmentInProgress = journey === JOURNEY.ASSESSMENT_IN_PROGRESS;
  const displayName = userName || patient?.displayName?.toUpperCase() || "UTILIZADOR";
  const showProgress = hasCarePlan || exerciseHistory.length > 0;

  const dashboardCopy = useMemo(() => {
    if (hasCarePlan) {
      return {
        prompt: "Vamos praticar?",
        cardTitle: "PLANO DE CUIDADOS ATIVO",
        firstItem: carePlan?.professional?.name ?? "Profissional responsável pelo plano",
        secondItem: patient?.hasOrthosis ? "Órtese personalizada entregue" : "Plano individual liberado",
        footer: carePlan?.objective ?? "Rotina personalizada liberada",
        cardButton: "VER EXERCÍCIOS",
        cardAria: "Ver exercícios",
        primaryButton: "FAZER UM EXERCÍCIO",
        primaryAria: "Fazer um exercício",
        cardTarget: "/app/exercises",
        primaryTarget: "/app/exercises",
        primaryIcon: <Dumbbell size={28} />,
      };
    }

    if (isAssessmentInProgress) {
      return {
        prompt: "Sua avaliação está quase pronta.",
        cardTitle: "AVALIAÇÃO EM ANDAMENTO",
        firstItem: "Triagem inicial registrada",
        secondItem: "Agora falta escolher um horário para o teleatendimento",
        footer: "O plano personalizado aparece aqui depois da avaliação profissional.",
        cardButton: "AGENDAR AVALIAÇÃO",
        cardAria: "Agendar avaliação",
        primaryButton: "AGENDAR AVALIAÇÃO",
        primaryAria: "Agendar avaliação",
        cardTarget: "/app/agendamento/whatsapp",
        primaryTarget: "/app/agendamento/whatsapp",
        primaryIcon: <Stethoscope size={28} />,
      };
    }

    return {
      prompt: "Vamos começar sua jornada?",
      cardTitle: "AVALIAÇÃO GRATUITA",
      firstItem: "Responda uma triagem rápida e simples",
      secondItem: "Depois, agende um teleatendimento para orientar seus próximos passos",
      footer: "A triagem não substitui avaliação profissional.",
      cardButton: "INICIAR TRIAGEM",
      cardAria: "Iniciar triagem",
      primaryButton: "INICIAR TRIAGEM",
      primaryAria: "Iniciar triagem",
      cardTarget: "/app/triagem",
      primaryTarget: "/app/triagem",
      primaryIcon: <ClipboardList size={28} />,
    };
  }, [carePlan, hasCarePlan, isAssessmentInProgress, patient?.hasOrthosis]);

  const { weekDays, practicedCount, recentActivities, lastActivityWhen } = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const activityKeys = new Set(
      exerciseHistory
        .map((a) => {
          const dt = new Date(a.completedAt);
          if (Number.isNaN(dt.getTime())) return null;
          return localDateKey(dt);
        })
        .filter(Boolean),
    );

    const weekDays = days.map((d, idx) => {
      const key = localDateKey(d);
      const isDone = activityKeys.has(key);
      const dayLabel = DAY_LABELS[d.getDay()] ?? ".";
      return { key, dayLabel, isDone, doneColor: DONE_COLORS[idx] ?? "#22c55e" };
    });

    const practicedCount = weekDays.reduce((acc, d) => acc + (d.isDone ? 1 : 0), 0);
    const recentActivities = exerciseHistory.slice(0, 10);

    const last = recentActivities[0];
    const dt = last ? new Date(last.completedAt) : null;
    const lastActivityWhen =
      dt && !Number.isNaN(dt.getTime())
        ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(dt)
        : "";

    return { weekDays, practicedCount, recentActivities, lastActivityWhen };
  }, [exerciseHistory]);

  return (
    <div className={styles.page}>
      <header className={styles.topBar} aria-label="Cabeçalho do dashboard">
        <button
          type="button"
          className={[styles.topAction, styles.topActionPrimary].filter(Boolean).join(" ")}
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
          aria-label="Sair"
        >
          <LogOut size={20} />
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

      <section className={styles.hero} aria-label="Boas-vindas">
        <div className={styles.heroText}>
          <h2 className={styles.greeting}>Oi, {displayName}!</h2>
          <p className={styles.prompt}>{dashboardCopy.prompt}</p>
        </div>
        <img src={character} alt="" className={styles.character} />
      </section>

      <div className={styles.content}>
        <section className={styles.assessmentCard} aria-label="Avaliação física">
          <div className={styles.assessmentHeader}>
            <h3 className={styles.assessmentTitle}>{dashboardCopy.cardTitle}</h3>
            <div className={styles.assessmentChevron} aria-hidden="true" />
          </div>

          <ul className={styles.assessmentList} aria-label="Resumo da jornada">
            <li className={styles.assessmentItem}>
              <span className={styles.assessmentIcon} aria-hidden="true">
                <Stethoscope size={18} />
              </span>
              <span>{dashboardCopy.firstItem}</span>
            </li>
            <li className={styles.assessmentItem}>
              <span className={styles.assessmentIcon} aria-hidden="true">
                <Sparkles size={18} />
              </span>
              <span>{dashboardCopy.secondItem}</span>
            </li>
          </ul>

          <button
            type="button"
            className={styles.assessmentCta}
            onClick={() => navigate(dashboardCopy.cardTarget)}
            aria-label={dashboardCopy.cardAria}
          >
            {dashboardCopy.cardButton}
          </button>

          <p className={styles.assessmentFooter}>{dashboardCopy.footer}</p>
        </section>

        <button
          type="button"
          className={styles.primaryCta}
          onClick={() => navigate(dashboardCopy.primaryTarget)}
          aria-label={dashboardCopy.primaryAria}
        >
          <div className={styles.ctaIcon}>{dashboardCopy.primaryIcon}</div>
          <span className={styles.ctaText}>{dashboardCopy.primaryButton}</span>
        </button>

        {showProgress ? (
          <>
            <section className={styles.cardDark} aria-label="Progresso nessa semana">
              <h3 className={styles.cardTitle}>Progresso nessa semana</h3>
              <div className={styles.week}>
                {weekDays.map((d) => (
                  <div
                    key={d.key}
                    className={styles.day}
                    data-done={d.isDone ? "true" : "false"}
                    aria-label={d.isDone ? `Dia ${d.dayLabel} praticado` : `Dia ${d.dayLabel} não praticado`}
                    style={d.isDone ? { backgroundColor: d.doneColor } : undefined}
                  >
                    {d.dayLabel}
                  </div>
                ))}
              </div>
              <p className={styles.weekSub}>Você praticou {practicedCount} de 7 dias</p>
              <p className={styles.lastLine}>
                Último exercício: <strong className={styles.lastValue}>{lastActivityWhen || "-"}</strong>
              </p>
            </section>

            <section className={styles.card} aria-label="Histórico de atividades">
              <h3 className={styles.cardTitle}>Histórico</h3>

              {recentActivities.length === 0 ? (
                <p className={styles.empty}>Você ainda não realizou exercícios.</p>
              ) : (
                <ul className={styles.history}>
                  {recentActivities.map((a) => {
                    const dt = new Date(a.completedAt);
                    const when = Number.isNaN(dt.getTime())
                      ? ""
                      : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(dt);
                    return (
                      <li key={a.id} className={styles.historyItem}>
                        <span className={styles.historyName}>{a.exerciseName}</span>
                        <span className={styles.historyWhen}>{when}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
