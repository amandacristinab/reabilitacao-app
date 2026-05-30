import { useEffect, useRef } from "react";
import { useActivity } from "../../app/state/activity";

export function useSeedMockActivities(patient) {
  const { activities, addExerciseCompleted } = useActivity();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    if (!patient?.carePlan?.activities?.length) return;
    if (activities.length > 0) return;

    seeded.current = true;
    for (const a of patient.carePlan.activities) {
      addExerciseCompleted({
        exerciseId: a.exerciseId,
        exerciseName: a.exerciseName,
        completedAt: a.completedAt,
        repetitions: a.repetitions,
        targetRepetitions: a.targetRepetitions,
      });
    }
  }, [patient?.id, activities.length, addExerciseCompleted]);
}
