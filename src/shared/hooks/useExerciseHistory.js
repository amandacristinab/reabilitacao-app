import { useMemo } from "react";
import { useActivity } from "../../app/state/activity";

export function useExerciseHistory() {
  const { activities } = useActivity();
  // activities is already sorted by completedAt desc by ActivityProvider
  return useMemo(() => activities.filter((a) => a?.type === "exercise"), [activities]);
}
