import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Pause, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../../app/state/session";
import { useUserMedia } from "../../shared/hooks/useUserMedia";
import { findExerciseById } from "./data/exercises";
import { useActivity } from "../../app/state/activity";
import { getPoseLandmarker } from "./pose/poseLandmarker";
import { evaluateTowelSlidePose } from "./pose/towelSlideRules";
import { evaluateArmInFramePose } from "./pose/armInFrameRules";
import { loadExerciseSettings } from "./settings/exerciseSettings";
import { BackButton } from "../../shared/ui/BackButton";
import styles from "./ExercisePlayerScreen.module.css";

const COUNTDOWN = ["3", "2", "1", "VAI!"];

function formatSeconds(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function ExercisePlayerScreen() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const { activePatientId } = useSession();
  const exercise = useMemo(() => findExerciseById(exerciseId, activePatientId), [activePatientId, exerciseId]);
  const { addExerciseCompleted } = useActivity();

  const durationSeconds = exercise?.durationSeconds ?? 30;

  // phase: idle | requesting-camera | countdown | running | paused
  const [phase, setPhase] = useState("idle");
  const [countdownStep, setCountdownStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [seriesDone, setSeriesDone] = useState(0);
  const [repetitions, setRepetitions] = useState(exercise?.suggestedRepetitions ?? 5);
  const [targetSeries, setTargetSeries] = useState(exercise?.targetSeries ?? 1);

  const videoRef = useRef(null);
  const { status, error, start, stop, streamRef } = useUserMedia();
  const recordedRef = useRef(false);
  const poseStateRef = useRef(null);
  const poseRafRef = useRef(null);
  const poseLastDetectRef = useRef(0);

  const camOn = status === "running";
  const poseMode = exercise?.id === "towel-slide" ? "towel-slide" : "arm-in-frame";
  const isFinished = seriesDone >= targetSeries;

  // Load persisted settings (read-only)
  useEffect(() => {
    if (!exercise?.id) return;
    const stored = loadExerciseSettings(exercise.id);
    if (stored?.repetitions != null) setRepetitions(stored.repetitions);
    if (stored?.targetSeries != null) setTargetSeries(stored.targetSeries);
  }, [exercise?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset on exercise change
  useEffect(() => {
    recordedRef.current = false;
    setTimeLeft(durationSeconds);
    setPhase("idle");
    setSeriesDone(0);
  }, [durationSeconds, exerciseId]);

  // Countdown: 3 → 2 → 1 → VAI! → running
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdownStep(0);
    let step = 0;
    const intervalId = setInterval(() => {
      step += 1;
      if (step < COUNTDOWN.length) setCountdownStep(step);
      if (step >= COUNTDOWN.length - 1) {
        clearInterval(intervalId);
        setTimeout(() => setPhase("running"), 1000);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [phase]);

  // Exercise timer
  useEffect(() => {
    if (phase !== "running" || timeLeft <= 0 || isFinished) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft, isFinished]);

  // Series progression when timer hits 0
  useEffect(() => {
    if (!exercise || timeLeft !== 0 || phase !== "running") return;
    setPhase("paused");
    setSeriesDone((prev) => {
      const next = Math.min(prev + 1, targetSeries);
      if (next < targetSeries) setTimeLeft(durationSeconds);
      return next;
    });
  }, [timeLeft, exercise, durationSeconds, targetSeries, phase]);

  // Completion
  useEffect(() => {
    if (!exercise || seriesDone < targetSeries || recordedRef.current) return;
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

  // Attach stream to video element
  useEffect(() => {
    if (status !== "running" || !videoRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.onloadedmetadata = () => {
      videoRef.current?.play?.().catch(() => {});
    };
  }, [status, streamRef]);

  // Stop camera on unmount
  useEffect(() => () => stop(), [stop]);

  // Reset pose state on exercise change
  useEffect(() => {
    poseStateRef.current = null;
    poseLastDetectRef.current = 0;
  }, [exerciseId]);

  // Pose detection (background, no visual overlay)
  useEffect(() => {
    if (!camOn) {
      poseStateRef.current = null;
      poseLastDetectRef.current = 0;
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
          if (now - poseLastDetectRef.current < 100) return;
          poseLastDetectRef.current = now;

          const video = videoRef.current;
          if (!video || video.readyState < 2) return;

          const result = landmarker.detectForVideo(video, now);
          const landmarks = result?.landmarks?.[0] ?? null;

          const evaluated =
            poseMode === "towel-slide"
              ? evaluateTowelSlidePose({ landmarks, prev: poseStateRef.current, timestampMs: now })
              : { ...evaluateArmInFramePose({ landmarks }), next: poseStateRef.current };

          poseStateRef.current = evaluated.next;
        };

        loop();
      } catch {
        // pose unavailable, silently continue
      }
    }

    run();

    return () => {
      cancelled = true;
      if (poseRafRef.current) window.cancelAnimationFrame(poseRafRef.current);
    };
  }, [camOn, poseMode]);

  async function handleMainButton() {
    if (phase === "idle") {
      setPhase("requesting-camera");
      const stream = await start();
      if (!stream) {
        setPhase("idle");
        return;
      }
      setPhase("countdown");
    } else if (phase === "running") {
      setPhase("paused");
    } else if (phase === "paused") {
      setPhase("running");
    }
  }

  const mainButtonLabel = phase === "running" ? "PAUSAR" : "INICIAR";
  const mainButtonDisabled = phase === "requesting-camera" || phase === "countdown" || isFinished;

  if (!exercise) {
    return (
      <div className={styles.page}>
        <div className={styles.stage}>
          <BackButton variant="authLike" />
          <div className={styles.empty}>
            <AlertTriangle size={44} color="var(--color-danger)" />
            <p>Exercício não encontrado.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.stage}>
        {camOn ? (
          <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        ) : (
          <div className={styles.placeholder}>
            {error ? (
              <>
                <AlertTriangle size={48} color="var(--color-danger)" style={{ marginBottom: 16 }} />
                <p className={styles.errorText}>{error}</p>
              </>
            ) : null}
          </div>
        )}

        <BackButton variant="authLike" />

        {phase === "countdown" && (
          <div className={styles.countdownOverlay} aria-live="assertive" aria-atomic="true">
            <span className={styles.countdownText}>{COUNTDOWN[countdownStep]}</span>
          </div>
        )}
      </div>

      <section className={styles.metrics} aria-label="Repetições, tempo e séries">
        <p className={styles.instruction}>Posicione o celular e fale Iniciar</p>
        <div className={styles.metricsRow}>
          <div className={styles.metric}>
            <div className={[styles.metricCircle, styles.metricCircleSuccess].join(" ")}>
              <span className={styles.metricValue}>{repetitions}</span>
            </div>
            <span className={styles.metricLabel}>Repetições sugeridas</span>
          </div>

          <div className={styles.metricCenter}>
            <button
              type="button"
              className={styles.metricCircleCenter}
              onClick={handleMainButton}
              aria-label={mainButtonLabel}
              disabled={mainButtonDisabled}
            >
              {phase === "running" ? <Pause size={22} /> : <Play size={22} />}
              <span className={styles.metricCenterText}>{mainButtonLabel}</span>
            </button>
            <span className={styles.metricTime}>{formatSeconds(timeLeft)}</span>
            <span className={styles.metricSub}>Tempo</span>
          </div>

          <div className={styles.metric}>
            <div className={[styles.metricCircle, styles.metricCircleDanger].join(" ")}>
              <span className={styles.metricValue}>{Math.min(seriesDone, targetSeries)}/{targetSeries}</span>
            </div>
            <span className={styles.metricLabel}>Séries feitas</span>
          </div>
        </div>
      </section>
    </div>
  );
}
