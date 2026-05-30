import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_PATIENT_ID } from "../../shared/data/mockData";
import { clearSession, loadSession, saveSession } from "../../features/auth/authStorage";

const SessionContext = createContext(null);

function normalizeName(name) {
  if (!name) return "";
  return String(name)
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function SessionProvider({ children, initialActivePatientId }) {
  const [session, setSessionState] = useState(() => {
    const savedSession = loadSession();
    return {
      userName: normalizeName(savedSession?.userName ?? ""),
      userPhoto: null,
      activePatientId: savedSession?.activePatientId ?? initialActivePatientId ?? DEFAULT_PATIENT_ID,
      email: savedSession?.email ?? "",
    };
  });

  function commitSession(nextSession) {
    setSessionState(nextSession);
    saveSession(nextSession);
  }

  const value = useMemo(() => {
    return {
      userName: session.userName,
      userPhoto: session.userPhoto,
      activePatientId: session.activePatientId,
      email: session.email,
      setSession: (next) => {
        commitSession({
          userName: normalizeName(next?.userName ?? ""),
          userPhoto: next?.userPhoto ?? null,
          activePatientId: next?.activePatientId ?? DEFAULT_PATIENT_ID,
          email: String(next?.email ?? "").trim().toLowerCase(),
        });
      },
      setUserName: (name) => {
        commitSession({ ...session, userName: normalizeName(name) });
      },
      setUserPhoto: (photo) => {
        commitSession({ ...session, userPhoto: photo });
      },
      setActivePatientId: (patientId) => {
        commitSession({ ...session, activePatientId: patientId ?? DEFAULT_PATIENT_ID });
      },
      logout: () => {
        clearSession();
        setSessionState({
          userName: "",
          userPhoto: null,
          activePatientId: DEFAULT_PATIENT_ID,
          email: "",
        });
      },
    };
  }, [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used within SessionProvider");
  return value;
}

