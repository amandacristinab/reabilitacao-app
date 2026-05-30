import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "neuroviva.activities.v1";
const ActivityContext = createContext(null);

function safeParseActivities(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

function loadInitialActivities() {
  try {
    return safeParseActivities(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function persistActivities(activities) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // ignore write errors (private mode / quota)
  }
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(loadInitialActivities);

  const addExerciseCompleted = useCallback(({ exerciseId, exerciseName, completedAt, repetitions, series, targetRepetitions, targetSeries }) => {
    const entry = {
      id: createId(),
      type: "exercise",
      exerciseId: String(exerciseId ?? ""),
      exerciseName: String(exerciseName ?? "Exercício"),
      completedAt: completedAt ?? new Date().toISOString(),
      repetitions: typeof repetitions === "number" ? repetitions : undefined,
      series: typeof series === "number" ? series : undefined,
      targetRepetitions: typeof targetRepetitions === "number" ? targetRepetitions : undefined,
      targetSeries: typeof targetSeries === "number" ? targetSeries : undefined,
    };

    setActivities((prev) => {
      const next = [entry, ...(Array.isArray(prev) ? prev : [])].slice(0, 200);
      persistActivities(next);
      return next;
    });
  }, []);

  const clearActivities = useCallback(() => {
    setActivities(() => {
      persistActivities([]);
      return [];
    });
  }, []);

  const value = useMemo(() => {
    const normalized = (Array.isArray(activities) ? activities : []).slice().sort((a, b) => {
      const ta = Date.parse(a?.completedAt ?? 0) || 0;
      const tb = Date.parse(b?.completedAt ?? 0) || 0;
      return tb - ta;
    });
    return { activities: normalized, addExerciseCompleted, clearActivities };
  }, [activities, addExerciseCompleted, clearActivities]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const value = useContext(ActivityContext);
  if (!value) throw new Error("useActivity must be used within ActivityProvider");
  return value;
}
