const SESSION_KEY = "neuroviva.auth.session.v1";
const LOCAL_USERS_KEY = "neuroviva.auth.localUsers.v1";

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors (private mode / quota)
  }
}

export function loadSession() {
  const session = readJson(SESSION_KEY, null);
  if (!session || typeof session !== "object" || Array.isArray(session)) return null;
  if (!session.activePatientId) return null;

  return {
    activePatientId: String(session.activePatientId),
    userName: String(session.userName ?? ""),
    email: normalizeEmail(session.email),
  };
}

export function saveSession(session) {
  if (!session?.activePatientId) return;

  writeJson(SESSION_KEY, {
    activePatientId: String(session.activePatientId),
    userName: String(session.userName ?? ""),
    email: normalizeEmail(session.email),
  });
}

export function clearSession() {
  try {
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith("neuroviva."));
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore storage errors
  }
}

export function loadLocalUsers() {
  const users = readJson(LOCAL_USERS_KEY, []);
  if (!Array.isArray(users)) return [];

  return users
    .filter((user) => user && typeof user === "object" && user.email && user.patientId)
    .map((user) => ({
      email: normalizeEmail(user.email),
      displayName: String(user.displayName ?? ""),
      patientId: String(user.patientId),
    }));
}

export function saveLocalUser(user) {
  const email = normalizeEmail(user?.email);
  const patientId = String(user?.patientId ?? "");
  if (!email || !patientId) return;

  const nextUser = {
    email,
    displayName: String(user?.displayName ?? ""),
    patientId,
  };

  const users = loadLocalUsers();
  const withoutExisting = users.filter((item) => item.email !== email);
  writeJson(LOCAL_USERS_KEY, [...withoutExisting, nextUser]);
}

export function findLocalUserByEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  return loadLocalUsers().find((user) => user.email === normalized) ?? null;
}
