import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_PATIENT_ID } from "../../shared/data/mockData";

const SessionContext = createContext(null);

function normalizeName(name) {
  if (!name) return "";
  return String(name).trim().toUpperCase();
}

export function SessionProvider({ children }) {
  const [userName, setUserNameRaw] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [activePatientId, setActivePatientId] = useState(DEFAULT_PATIENT_ID);

  const value = useMemo(() => {
    return {
      userName,
      userPhoto,
      activePatientId,
      setUserName: (name) => setUserNameRaw(normalizeName(name)),
      setUserPhoto,
      setActivePatientId,
      logout: () => {
        setUserNameRaw("");
        setUserPhoto(null);
        setActivePatientId(DEFAULT_PATIENT_ID);
      },
    };
  }, [activePatientId, userName, userPhoto]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used within SessionProvider");
  return value;
}

