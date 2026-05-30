import { getExerciseCatalog, getExerciseForPatient } from "../../../shared/data/mockData";

export const EXERCISES = getExerciseCatalog();

export function findExerciseById(exerciseId, patientId) {
  return getExerciseForPatient(exerciseId, patientId);
}
