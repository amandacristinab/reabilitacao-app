import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { WelcomeScreen } from "../features/auth/WelcomeScreen";
import { AuthChoiceScreen } from "../features/auth/AuthChoiceScreen";
import { RegisterDetailsScreen } from "../features/auth/RegisterDetailsScreen";
import { SuccessScreen } from "../features/auth/SuccessScreen";
import { LoginScreen } from "../features/auth/LoginScreen";
import { DashboardScreen } from "../features/dashboard/DashboardScreen";
import { ExerciseListScreen } from "../features/exercises/ExerciseListScreen";
import { ExerciseIntroScreen } from "../features/exercises/ExerciseIntroScreen";
import { ExercisePlayerScreen } from "../features/exercises/ExercisePlayerScreen";
import { ExerciseCompletedScreen } from "../features/exercises/ExerciseCompletedScreen";
import { ProgressScreen } from "../features/progress/ProgressScreen";
import { ProfileScreen } from "../features/profile/ProfileScreen";
import { AssessmentScreen } from "../features/assessment/AssessmentScreen";
import { TriageIntroScreen } from "../features/triagem/TriageIntroScreen";
import { TriageQuestionsScreen } from "../features/triagem/TriageQuestionsScreen";
import { WhatsAppScheduleScreen } from "../features/agendamento/WhatsAppScheduleScreen";
import { ScheduleDateScreen } from "../features/agendamento/ScheduleDateScreen";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/auth" element={<AuthChoiceScreen />} />
      <Route path="/register" element={<Navigate to="/register/dados" replace />} />
      <Route path="/register/dados" element={<RegisterDetailsScreen />} />
      <Route path="/success" element={<SuccessScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      <Route element={<AppLayout />}>
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/app/dashboard" element={<DashboardScreen />} />
        <Route path="/app/triagem" element={<TriageIntroScreen />} />
        <Route path="/app/triagem/perguntas" element={<TriageQuestionsScreen />} />
        <Route path="/app/avaliacao-fisica" element={<AssessmentScreen />} />
        <Route path="/app/agendamento/whatsapp" element={<WhatsAppScheduleScreen />} />
        <Route path="/app/agendamento/data" element={<ScheduleDateScreen />} />
        <Route path="/app/exercises" element={<ExerciseListScreen />} />
        <Route path="/app/exercises/:exerciseId/intro" element={<ExerciseIntroScreen />} />
        <Route path="/app/exercises/:exerciseId" element={<ExercisePlayerScreen />} />
        <Route path="/app/exercises/:exerciseId/completed" element={<ExerciseCompletedScreen />} />
        <Route path="/app/progress" element={<ProgressScreen />} />
        <Route path="/app/profile" element={<ProfileScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
