import patients from "../../mocks/patients.json";
import exerciseCatalog from "../../mocks/exercises.json";
import scheduleSlots from "../../mocks/scheduleSlots.json";

export const DEFAULT_PATIENT_ID = "dona-cida";
export const NEW_PATIENT_ID = "novo-paciente";

function normalizeId(id) {
  return String(id ?? "").trim();
}

function findPrescriptionsForExercise(patient, exerciseId) {
  const routine = patient?.carePlan?.prescribedRoutine;
  if (!routine) return [];

  return Object.values(routine)
    .flat()
    .filter((item) => normalizeId(item?.exerciseId) === normalizeId(exerciseId));
}

export function getPatients() {
  return patients;
}

export function getPatientById(patientId) {
  return patients.find((patient) => patient.id === normalizeId(patientId)) ?? null;
}

export function getDefaultPatient() {
  return getPatientById(DEFAULT_PATIENT_ID) ?? patients[0] ?? null;
}

export function getExerciseCatalog() {
  return exerciseCatalog;
}

export function getExerciseById(exerciseId) {
  return exerciseCatalog.find((exercise) => exercise.id === normalizeId(exerciseId)) ?? null;
}

export function getScheduleSlots() {
  return scheduleSlots;
}

export function getExerciseForPatient(exerciseId, patientId = DEFAULT_PATIENT_ID) {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return null;

  const patient = getPatientById(patientId) ?? getDefaultPatient();
  const prescriptions = findPrescriptionsForExercise(patient, exercise.id);
  const prescription = prescriptions[0] ?? null;

  return {
    ...exercise,
    patientId: patient?.id ?? null,
    isPrescribed: Boolean(prescription),
    prescriptions,
    durationSeconds: prescription?.durationSeconds ?? 180,
    durLabel: prescription?.durationLabel ?? "2-3 min",
    repsLabel: prescription ? `${prescription.series} serie` : "1 serie",
    suggestedRepetitions: prescription?.repetitions ?? 5,
    targetSeries: prescription?.series ?? 3,
    icon: "toalha",
  };
}

export function getExercisesForPatient(patientId = DEFAULT_PATIENT_ID) {
  const patient = getPatientById(patientId) ?? getDefaultPatient();

  return exerciseCatalog
    .filter((exercise) => {
      if (patient?.hasCarePlan) {
        return findPrescriptionsForExercise(patient, exercise.id).length > 0;
      }
      return exercise.availableWithoutAssessment;
    })
    .map((exercise) => getExerciseForPatient(exercise.id, patient?.id));
}
