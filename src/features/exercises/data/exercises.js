export const EXERCISES = [
  {
    id: "towel-slide",
    name: "Deslizamento de toalha",
    durLabel: "2–3 min",
    durationSeconds: 180,
    repsLabel: "1 série",
    suggestedRepetitions: 5,
    targetSeries: 3,
    levelLabel: "Leve",
    icon: "🧻",
  },
];

export function findExerciseById(exerciseId) {
  return EXERCISES.find((e) => e.id === String(exerciseId)) ?? null;
}
