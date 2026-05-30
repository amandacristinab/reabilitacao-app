import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Camera, ChevronLeft, Hand, Pause, Play, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../../app/state/session";
import { useUserMedia } from "../../shared/hooks/useUserMedia";
import { findExerciseById } from "./data/exercises";
import { useActivity } from "../../app/state/activity";
import { getPoseLandmarker } from "./pose/poseLandmarker";
import { evaluateTowelSlidePose } from "./pose/towelSlideRules";
import { evaluateArmInFramePose } from "./pose/armInFrameRules";
import { loadExerciseSettings, saveExerciseSettings } from "./settings/exerciseSettings";
import styles from "./ExercisePlayerScreen.module.css";

function formatSeconds(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return `${mm}:${ss}`;
}

function clampInt(value, { min = 1, max = 99 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function ExercisePlayerScreen() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const { activePatientId } = useSession();
  const exercise = useMemo(() => findExerciseById(exerciseId, activePatientId), [activePatientId, exerciseId]);
  const { addExerciseCompleted } = useActivity();

  const durationSeconds = exercise?.durationSeconds ?? 30;
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [seriesDone, setSeriesDone] = useState(0);
  const videoRef = useRef(null);
  const { status, error, start, stop, streamRef } = useUserMedia();
  const recordedRef = useRef(false);
  const poseStateRef = useRef(null);
  const poseRafRef = useRef(0);
  const poseLastDetectRef = useRef(0);
  const [poseFeedback, setPoseFeedback] = useState({ state: "idle", reason: "" });

  const defaultRepetitions = Number.isFinite(exercise?.suggestedRepetitions) ? exercise.suggestedRepetitions : 5;
  const defaultTargetSeries = Number.isFinite(exercise?.targetSeries) ? exercise.targetSeries : 3;
  const [repetitions, setRepetitions] = useState(defaultRepetitions);
  const [targetSeries, setTargetSeries] = useState(defaultTargetSeries);
  const isFinished = seriesDone >= targetSeries;

  useEffect(() => {
    recordedRef.current = false;
    setTimeLeft(durationSeconds);
    setIsRunning(false);
    setSeriesDone(0);
  }, [durationSeconds, exerciseId]);

  useEffect(() => {
    if (!exercise?.id) return;
    const stored = loadExerciseSettings(exercise.id);
    const nextReps = stored?.repetitions ?? defaultRepetitions;
    const nextSeries = stored?.targetSeries ?? defaultTargetSeries;
    setRepetitions(nextReps);
    setTargetSeries(nextSeries);
  }, [exercise?.id, defaultRepetitions, defaultTargetSeries]);

  useEffect(() => {
    if (!exercise?.id) return;
    saveExerciseSettings(exercise.id, { repetitions, targetSeries });
  }, [exercise?.id, repetitions, targetSeries]);

  useEffect(() => {
    setSeriesDone((prev) => Math.min(prev, targetSeries));
  }, [targetSeries]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isFinished]);

  useEffect(() => {
    if (!exercise) return;
    if (timeLeft !== 0) return;

    setIsRunning(false);

    setSeriesDone((prev) => {
      const next = Math.min(prev + 1, targetSeries);
      if (next < targetSeries) {
        setTimeLeft(durationSeconds);
      }
      return next;
    });
  }, [timeLeft, exercise, durationSeconds, targetSeries]);

  useEffect(() => {
    if (!exercise) return;
    if (seriesDone < targetSeries) return;
    if (recordedRef.current) return;
    recordedRef.current = true;
    addExerciseCompleted({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      completedAt: new Date().toISOString(),
      repetitions,
      series: targetSeries,
    });
    navigate(`/app/exercises/${exercise.id}/completed`, {
      replace: true,
      state: { repetitions, series: targetSeries },
    });
  }, [seriesDone, targetSeries, exercise, addExerciseCompleted, navigate, repetitions]);

  useEffect(() => {
    if (status !== "running") return;
    if (!videoRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.onloadedmetadata = () => {
      videoRef.current?.play?.().catch(() => {});
    };
  }, [status, streamRef]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const camOn = status === "running";
  const poseEnabled = camOn;
  const poseMode = exercise?.id === "towel-slide" ? "towel-slide" : "arm-in-frame";
  const adjustmentsDisabled = isRunning || seriesDone > 0;

  function resetPoseState() {
    poseStateRef.current = null;
    poseLastDetectRef.current = 0;
    setPoseFeedback({ state: "idle", reason: "" });
  }

  useEffect(() => {
    resetPoseState();
  }, [exerciseId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!poseEnabled) {
      resetPoseState();
      return undefined;
    }

    let cancelled = false;

    async function run() {
      try {
        const landmarker = await getPoseLandmarker();
        if (cancelled) return;

        const loop = () => {
          if (cancelled) return;
          poseRafRef.current = window.requestAnimationFrame(loop);

          const now = performance.now();
          if (now - poseLastDetectRef.current < 100) return; // ~10fps
          poseLastDetectRef.current = now;

          const video = videoRef.current;
          if (!video || video.readyState < 2) return;

          const result = landmarker.detectForVideo(video, now);
          const landmarks = result?.landmarks?.[0] ?? null;

          const evaluated =
            poseMode === "towel-slide"
              ? evaluateTowelSlidePose({
                  landmarks,
                  prev: poseStateRef.current,
                  timestampMs: now,
                })
              : {
                  ...evaluateArmInFramePose({ landmarks }),
                  next: poseStateRef.current,
                };

          poseStateRef.current = evaluated.next;
          const nextFeedback = {
            state: evaluated.ok ? "ok" : "bad",
            reason: evaluated.reason ?? "",
          };

          setPoseFeedback((prev) => {
            if (prev.state === nextFeedback.state && prev.reason === nextFeedback.reason) return prev;
            return nextFeedback;
          });
        };

        loop();
      } catch {
        setPoseFeedback({ state: "bad", reason: "Pose indisponível" });
      }
    }

    run();

    return () => {
      cancelled = true;
      if (poseRafRef.current) window.cancelAnimationFrame(poseRafRef.current);
    };
  }, [poseEnabled, poseMode]);

  if (!exercise) {
    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <button type="button" className={styles.backInline} onClick={() => navigate(-1)} aria-label="Voltar">
            <ChevronLeft size={28} />
          </button>
          <span className={styles.title}>Exercício</span>
        </div>
        <div className={styles.empty}>
          <AlertTriangle size={44} color="var(--color-danger)" />
          <p>Exercício não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backInline} onClick={() => navigate(-1)} aria-label="Voltar">
          <ChevronLeft size={28} />
        </button>
        <span className={styles.title}>{exercise.name}</span>
      </div>

      <div className={styles.stage}>
        <div className={styles.cameraPane}>
          {camOn ? (
            <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
          ) : (
            <div className={styles.placeholder}>
              {error ? (
                <>
                  <AlertTriangle size={48} color="var(--color-danger)" style={{ marginBottom: 16 }} />
                  <p className={styles.errorText}>{error}</p>
                  <button type="button" className={styles.reload} onClick={() => window.location.reload()}>
                    RECARREGAR
                  </button>
                </>
              ) : (
                <>
                  <Hand size={60} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.6 }} />
                  <p className={styles.hint}>Ative a câmera para monitorizar o treino</p>
                </>
              )}
            </div>
          )}

          {poseEnabled ? (
            <div
              className={[
                styles.poseOverlay,
                poseFeedback.state === "ok" ? styles.poseOk : poseFeedback.state === "bad" ? styles.poseBad : "",
              ].join(" ")}
              aria-label="Avaliação do movimento"
            >
              <span className={styles.poseBadge}>
                {poseFeedback.state === "ok" ? "CORRETO" : poseFeedback.reason ? poseFeedback.reason : "AJUSTE"}
              </span>
            </div>
          ) : null}
        </div>

      </div>

      <section className={styles.metrics} aria-label="Repetições, tempo e séries">
        <div className={styles.metric}>
          <div className={[styles.metricCircle, styles.metricCircleSuccess].filter(Boolean).join(" ")}>
            <button
              type="button"
              className={styles.adjustButton}
              onClick={() => setRepetitions((v) => clampInt(v - 1))}
              aria-label="Diminuir repetições"
              disabled={adjustmentsDisabled}
            >
              -
            </button>
            <span className={styles.metricValue}>{repetitions}</span>
            <button
              type="button"
              className={styles.adjustButton}
              onClick={() => setRepetitions((v) => clampInt(v + 1))}
              aria-label="Aumentar repetições"
              disabled={adjustmentsDisabled}
            >
              +
            </button>
          </div>
          <span className={styles.metricLabel}>Repetições sugeridas</span>
        </div>

        <div className={styles.metricCenter}>
          <button
            type="button"
            className={styles.metricCircleCenter}
            onClick={() => {
              if (isFinished) return;
              if (timeLeft === 0) setTimeLeft(durationSeconds);
              setIsRunning((v) => !v);
            }}
            aria-label={isRunning ? "PAUSAR" : "INICIAR"}
          >
            {isRunning ? <Pause size={22} /> : <Play size={22} />}
            <span className={styles.metricCenterText}>{isRunning ? "PAUSAR" : "INICIAR"}</span>
          </button>
          <span className={styles.metricTime}>{formatSeconds(timeLeft)}</span>
          <span className={styles.metricSub}>Tempo</span>
        </div>

        <div className={styles.metric}>
          <div className={[styles.metricCircle, styles.metricCircleDanger].filter(Boolean).join(" ")}>
            <button
              type="button"
              className={styles.adjustButton}
              onClick={() => setTargetSeries((v) => clampInt(v - 1))}
              aria-label="Diminuir séries"
              disabled={adjustmentsDisabled}
            >
              -
            </button>
            <span className={styles.metricValue}>
              {Math.min(seriesDone, targetSeries)}/{targetSeries}
            </span>
            <button
              type="button"
              className={styles.adjustButton}
              onClick={() => setTargetSeries((v) => clampInt(v + 1))}
              aria-label="Aumentar séries"
              disabled={adjustmentsDisabled}
            >
              +
            </button>
          </div>
          <span className={styles.metricLabel}>Séries feitas</span>
        </div>
      </section>

      <div className={styles.controls} aria-label="Controles">
        <button
          type="button"
          className={styles.circle}
          onClick={async () => {
            if (camOn) stop();
            else await start();
          }}
          style={{ backgroundColor: camOn ? "var(--color-danger)" : "#f1f5f9" }}
          aria-label={camOn ? "Desligar câmera" : "Ligar câmera"}
        >
          <Camera size={24} color={camOn ? "#fff" : "var(--color-text)"} />
        </button>

        <button
          type="button"
          className={styles.circle}
          onClick={() => {
            recordedRef.current = false;
            setTimeLeft(durationSeconds);
            setIsRunning(false);
            setSeriesDone(0);
          }}
          aria-label="Reiniciar"
        >
          <RefreshCw size={24} color="var(--color-text)" />
        </button>
      </div>
    </div>
  );
}
