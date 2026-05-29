import React, { useMemo } from "react";
import { Dumbbell, HelpCircle, LogOut, Sparkles, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../app/state/session";
import { useActivity } from "../../app/state/activity";
import logo from "../../../assets/logo.png";
import character from "../../../assets/donacida2 1.png";
import styles from "./DashboardScreen.module.css";

const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const DONE_COLORS = ["#f43f5e", "#f59e0b", "#3b82f6", "#22c55e", "#14b8a6", "#a855f7", "#0ea5e9"];

function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DashboardScreen() {
  const navigate = useNavigate();
  const { userName, logout } = useSession();
  const { activities } = useActivity();

  const { weekDays, practicedCount, recentActivities, lastActivityWhen } = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const activityKeys = new Set(
      (activities ?? [])
        .filter((a) => a?.type === "exercise")
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
      const dayLabel = DAY_LABELS[d.getDay()] ?? "•";
      return { key, dayLabel, isDone, doneColor: DONE_COLORS[idx] ?? "#22c55e" };
    });

    const practicedCount = weekDays.reduce((acc, d) => acc + (d.isDone ? 1 : 0), 0);

    const recentActivities = (activities ?? [])
      .filter((a) => a?.type === "exercise")
      .slice()
      .sort((a, b) => (Date.parse(b?.completedAt ?? 0) || 0) - (Date.parse(a?.completedAt ?? 0) || 0))
      .slice(0, 10);

    const last = recentActivities[0];
    const dt = last ? new Date(last.completedAt) : null;
    const lastActivityWhen =
      dt && !Number.isNaN(dt.getTime())
        ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(dt)
        : "";

    return { weekDays, practicedCount, recentActivities, lastActivityWhen };
  }, [activities]);

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
          <h2 className={styles.greeting}>Oi, {userName || "UTILIZADOR"}!</h2>
          <p className={styles.prompt}>Vamos praticar?</p>
        </div>
        <img src={character} alt="" className={styles.character} />
      </section>

      <div className={styles.content}>
        <section className={styles.assessmentCard} aria-label="Avaliação física">
          <div className={styles.assessmentHeader}>
            <h3 className={styles.assessmentTitle}>FAÇA SUA AVALIAÇÃO GRATUITA</h3>
            <div className={styles.assessmentChevron} aria-hidden="true" />
          </div>

          <ul className={styles.assessmentList} aria-label="Benefícios da avaliação">
            <li className={styles.assessmentItem}>
              <span className={styles.assessmentIcon} aria-hidden="true">
                <Stethoscope size={18} />
              </span>
              <span>Encontre um profissional da saúde</span>
            </li>
            <li className={styles.assessmentItem}>
              <span className={styles.assessmentIcon} aria-hidden="true">
                <Sparkles size={18} />
              </span>
              <span>Faça uma órtese personalizada</span>
            </li>
          </ul>

          <button
            type="button"
            className={styles.assessmentCta}
            onClick={() => navigate("/app/triagem")}
            aria-label="Agendar avaliação"
          >
            AGENDAR AVALIAÇÃO
          </button>

          <p className={styles.assessmentFooter}>Libere treinos personalizados e acompanhamento profissional</p>
        </section>
        <button
          type="button"
          className={styles.primaryCta}
          onClick={() => navigate("/app/exercises")}
          aria-label="Fazer um exercício"
        >
          <div className={styles.ctaIcon}>
            <Dumbbell size={28} />
          </div>
          <span className={styles.ctaText}>FAZER UM EXERCÍCIO</span>
        </button>

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
            Último exercício: <strong className={styles.lastValue}>{lastActivityWhen || "—"}</strong>
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
      </div>
    </div>
  );
}
