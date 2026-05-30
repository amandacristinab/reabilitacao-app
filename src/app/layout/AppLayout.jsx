import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "../../shared/ui/BottomNav";
import styles from "./AppLayout.module.css";

const NAV_ROUTES = [
  { id: "dashboard", to: "/app/dashboard" },
  { id: "exercises", to: "/app/exercises" },
  { id: "progress", to: "/app/progress" },
  { id: "profile", to: "/app/profile" },
];

function getActiveId(pathname) {
  if (pathname.startsWith("/app/exercises")) return "exercises";
  if (pathname.startsWith("/app/progress")) return "progress";
  if (pathname.startsWith("/app/profile")) return "profile";
  return "dashboard";
}

function isFocusedExerciseRoute(pathname) {
  return /^\/app\/exercises\/[^/]+(?:\/intro)?$/.test(pathname);
}

export function AppLayout() {
  const location = useLocation();
  const activeId = getActiveId(location.pathname);
  const hideBottomNav =
    location.pathname.startsWith("/app/triagem") ||
    location.pathname.startsWith("/app/avaliacao-fisica") ||
    location.pathname.startsWith("/app/agendamento") ||
    isFocusedExerciseRoute(location.pathname);

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.surface}>
          <main className={styles.main}>
            <div className={styles.mainInner}>
              <Outlet />
            </div>
          </main>
          {!hideBottomNav ? (
            <div className={styles.mobileNav}>
              <BottomNav activeId={activeId} items={NAV_ROUTES} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
