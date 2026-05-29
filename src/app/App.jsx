import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { SessionProvider } from "./state/session";
import { ActivityProvider } from "./state/activity";

export function App() {
  return (
    <SessionProvider>
      <ActivityProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ActivityProvider>
    </SessionProvider>
  );
}
