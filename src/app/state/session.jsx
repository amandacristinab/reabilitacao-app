import React, { createContext, useContext, useMemo, useState } from "react";

const SessionContext = createContext(null);

function normalizeName(name) {
  if (!name) return "";
  return String(name).trim().toUpperCase();
}

export function SessionProvider({ children }) {
  const [userName, setUserNameRaw] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);

  const value = useMemo(() => {
    return {
      userName,
      userPhoto,
      setUserName: (name) => setUserNameRaw(normalizeName(name)),
      setUserPhoto,
      logout: () => {
        setUserNameRaw("");
        setUserPhoto(null);
      },
    };
  }, [userName, userPhoto]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used within SessionProvider");
  return value;
}

