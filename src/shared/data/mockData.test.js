import { describe, expect, test } from "vitest";
import {
  DEFAULT_PATIENT_ID,
  getDefaultPatient,
  getExerciseForPatient,
  getExercisesForPatient,
  getPatientById,
  getScheduleSlots,
} from "./mockData";

describe("mockData", () => {
  test("uses Dona Cida as the default active patient", () => {
    const patient = getDefaultPatient();

    expect(patient?.id).toBe(DEFAULT_PATIENT_ID);
    expect(patient?.hasCarePlan).toBe(true);
    expect(patient?.carePlan?.prescribedForPatientId).toBe(DEFAULT_PATIENT_ID);
  });

  test("returns the towel-slide exercise with patient prescription values", () => {
    const exercise = getExerciseForPatient("towel-slide", DEFAULT_PATIENT_ID);

    expect(exercise?.name).toBe("Deslizamento de toalha");
    expect(exercise?.isPrescribed).toBe(true);
    expect(exercise?.durationSeconds).toBe(180);
    expect(exercise?.suggestedRepetitions).toBe(5);
    expect(exercise?.targetSeries).toBe(3);
    expect(exercise?.prescriptions).toHaveLength(3);
  });

  test("keeps the new patient without a care plan but with demonstrative exercise access", () => {
    const patient = getPatientById("novo-paciente");
    const exercises = getExercisesForPatient(patient.id);

    expect(patient?.hasCarePlan).toBe(false);
    expect(exercises.map((exercise) => exercise.id)).toEqual(["towel-slide"]);
    expect(exercises[0].isPrescribed).toBe(false);
  });

  test("exposes schedule slots as local fixtures", () => {
    expect(getScheduleSlots().length).toBeGreaterThan(0);
    expect(getScheduleSlots()[0]).toHaveProperty("slots");
  });
});
