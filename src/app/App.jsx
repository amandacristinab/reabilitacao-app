import React from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { SessionProvider } from "./state/session";
import { ActivityProvider } from "./state/activity";

export function App() {
  return (
    <SessionProvider>
      <ActivityProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ActivityProvider>
    </SessionProvider>
  );
}
