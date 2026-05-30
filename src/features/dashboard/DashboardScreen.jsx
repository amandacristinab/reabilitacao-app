import React, { useMemo } from "react";
import { ClipboardList, Clock3, Dumbbell, HelpCircle, LogOut, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../app/state/session";
import { getDefaultPatient, getPatientById } from "../../shared/data/mockData";
import { useExerciseHistory } from "../../shared/hooks/useExerciseHistory";
import { useSeedMockActivities } from "../../shared/hooks/useSeedMockActivities";
import { loadWhatsAppPhoneDigits } from "../agendamento/whatsappPhoneStorage";
import { loadTriageAnswers } from "../triagem/triageStorage";
import logo from "../../../assets/logo.png";
import character from "../../../assets/fernanda.png";
import styles from "./DashboardScreen.module.css";

const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const COLOR_MISSED = "#f43f5e";
const COLOR_PARTIAL = "#f59e0b";
const COLOR_DONE = "#3b82f6";

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

function formatDate(dateLike) {
  const dt = new Date(`${dateLike}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR").format(dt);
}

export function DashboardScreen() {
  const navigate = useNavigate();
  const { activePatientId, userName, logout } = useSession();
  const exerciseHistory = useExerciseHistory();
  const patient = getPatientById(activePatientId) ?? getDefaultPatient();
  const carePlan = patient?.carePlan ?? null;
  useSeedMockActivities(patient);
  const journey = getDashboardJourney(patient);
  const hasCarePlan = journey === JOURNEY.CARE_PLAN_ACTIVE;
  const isAssessmentInProgress = journey === JOURNEY.ASSESSMENT_IN_PROGRESS;
  const displayName = patient?.shortName || userName || patient?.displayName || "Utilizador";
  const showProgress = hasCarePlan || exerciseHistory.length > 0;

  const dashboardCopy = useMemo(() => {
    if (hasCarePlan) {
      const firstExerciseId =
        carePlan?.prescribedRoutine?.morning?.[0]?.exerciseId ??
        carePlan?.prescribedRoutine?.afternoon?.[0]?.exerciseId ??
        "towel-slide";
      return {
        prompt: "Vamos praticar?",
        primaryButton: "FAZER UM EXERCÍCIO",
        primaryAria: "Fazer um exercício",
        primaryTarget: `/app/exercises/${firstExerciseId}/intro`,
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
  }, [hasCarePlan, isAssessmentInProgress]);

  const { weekDays, practicedCount, recentActivities, lastActivityWhen } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      return d;
    });

    const scheduledDays = carePlan?.weeklyFrequency?.scheduledDays ?? [];

    const activitiesByDate = {};
    for (const a of exerciseHistory) {
      const dt = new Date(a.completedAt);
      if (Number.isNaN(dt.getTime())) continue;
      const key = localDateKey(dt);
      if (!activitiesByDate[key]) activitiesByDate[key] = [];
      activitiesByDate[key].push(a);
    }

    const weekDays = days.map((d) => {
      const key = localDateKey(d);
      const dayLabel = DAY_LABELS[d.getDay()] ?? ".";
      const isPast = d < now;
      const isScheduled = scheduledDays.includes(d.getDay());
      const dayActivities = activitiesByDate[key] ?? [];
      const hasDone = dayActivities.length > 0;
      const metTarget = hasDone && dayActivities.some(
        (a) => typeof a.targetRepetitions === "number" ? a.repetitions >= a.targetRepetitions : true
      );

      let doneColor = null;
      if (hasDone && metTarget) doneColor = COLOR_DONE;
      else if (hasDone && !metTarget) doneColor = COLOR_PARTIAL;
      else if (isPast && isScheduled && !hasDone) doneColor = COLOR_MISSED;

      return { key, dayLabel, isDone: doneColor !== null, doneColor };
    });

    const practicedCount = weekDays.reduce((acc, d) => acc + (d.isDone ? 1 : 0), 0);
    const recentActivities = exerciseHistory.slice(0, 10);

    const last = recentActivities[0];
    const dt = last ? new Date(last.completedAt) : null;
    let lastActivityWhen = "";
    if (dt && !Number.isNaN(dt.getTime())) {
      const today = new Date();
      const isToday =
        dt.getFullYear() === today.getFullYear() &&
        dt.getMonth() === today.getMonth() &&
        dt.getDate() === today.getDate();
      const time = dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      lastActivityWhen = isToday
        ? `Hoje às ${time} h`
        : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(dt);
    }

    return { weekDays, practicedCount, recentActivities, lastActivityWhen };
  }, [exerciseHistory]);

  const orthosisDelivery = carePlan?.lastOrthosis?.deliveryDate ? formatDate(carePlan.lastOrthosis.deliveryDate) : "";

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
          <LogOut size={24} strokeWidth={2.7} />
        </button>

        <img src={logo} alt="neuroviva" className={styles.logo} />

        <button
          type="button"
          className={styles.topHelp}
          onClick={() => window.alert("Ajuda em breve")}
          aria-label="Ajuda"
        >
          <HelpCircle size={50} strokeWidth={2.7} />
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
        {!hasCarePlan ? (
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
        ) : null}

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

              {hasCarePlan ? (
                <>
                  <div className={styles.planFacts} aria-label="Resumo do plano ativo">
                    {patient?.hasOrthosis && orthosisDelivery ? (
                      <p className={styles.planFact}>
                        <ShieldCheck size={20} aria-hidden="true" />
                        <span>Órtese entregue em: <strong>{orthosisDelivery}</strong></span>
                      </p>
                    ) : null}
                    <p className={styles.planFact}>
                      <Clock3 size={20} aria-hidden="true" />
                      <span>Último exercício: <strong>{lastActivityWhen || "-"}</strong></span>
                    </p>
                  </div>
                </>
              ) : (
                <p className={styles.lastLine}>
                  Último exercício: <strong className={styles.lastValue}>{lastActivityWhen || "-"}</strong>
                </p>
              )}
            </section>

            
          </>
        ) : null}
      </div>
    </div>
  );
}
