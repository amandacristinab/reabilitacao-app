const STORAGE_PREFIX = "neuroviva.exerciseSettings.v1.";

function clampInt(value, { min, max }) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const i = Math.round(n);
  return Math.max(min, Math.min(max, i));
}

export function loadExerciseSettings(exerciseId) {
  try {
    const key = STORAGE_PREFIX + String(exerciseId ?? "");
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const repetitions = clampInt(parsed.repetitions, { min: 1, max: 99 });
    const targetSeries = clampInt(parsed.targetSeries, { min: 1, max: 99 });

    if (!repetitions && !targetSeries) return null;
    return {
      repetitions: repetitions ?? null,
      targetSeries: targetSeries ?? null,
    };
  } catch {
    return null;
  }
}

export function saveExerciseSettings(exerciseId, { repetitions, targetSeries }) {
  try {
    const key = STORAGE_PREFIX + String(exerciseId ?? "");
    const payload = {
      repetitions: clampInt(repetitions, { min: 1, max: 99 }) ?? 1,
      targetSeries: clampInt(targetSeries, { min: 1, max: 99 }) ?? 1,
    };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

