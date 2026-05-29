const STORAGE_KEY = "neuroviva.triage.v1";

export function loadTriageAnswers() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function saveTriageAnswers(answers) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers ?? {}));
  } catch {
    // ignore write errors (private mode / quota)
  }
}

