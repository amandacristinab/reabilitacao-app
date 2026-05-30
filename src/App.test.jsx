import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ActivityProvider } from "./app/state/activity";
import { SessionProvider } from "./app/state/session";
import { AppRoutes } from "./app/routes";
import { NEW_PATIENT_ID } from "./shared/data/mockData";
import { loadSession, saveLocalUser, saveSession } from "./features/auth/authStorage";

function renderApp(initialEntries, options = {}) {
  return render(
    <SessionProvider initialActivePatientId={options.activePatientId}>
      <ActivityProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <AppRoutes />
        </MemoryRouter>
      </ActivityProvider>
    </SessionProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

async function loginWithEmail(email) {
  renderApp(["/login"]);

  await userEvent.type(screen.getByLabelText(/^e-?mail$/i), email);
  await userEvent.type(screen.getByLabelText(/^senha$/i), "123456");
  await userEvent.click(screen.getByRole("button", { name: "ENTRAR" }));
}

test("renders welcome screen", async () => {
  renderApp(["/"]);

  expect(screen.getByRole("img", { name: /neuroviva/i })).toBeInTheDocument();
  expect(screen.getByText(/Sua companheira/i)).toBeInTheDocument();
  const startButton = screen.getByRole("button", { name: /come/i });
  expect(screen.getAllByRole("button", { name: /come/i })).toHaveLength(1);

  await userEvent.click(startButton);
  expect(screen.getByRole("button", { name: "CRIAR MINHA CONTA" })).toBeInTheDocument();
});

test("renders auth choice screen with Limbse and buttons", () => {
  renderApp(["/auth"]);

  expect(screen.getByRole("button", { name: "CRIAR MINHA CONTA" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "ENTRAR" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /Limbse/i })).toBeInTheDocument();
});

test("auth choice buttons navigate to register and login", async () => {
  const firstView = renderApp(["/auth"]);

  await userEvent.click(screen.getByRole("button", { name: "CRIAR MINHA CONTA" }));
  expect(screen.getByRole("heading", { name: /Cadastro/i })).toBeInTheDocument();

  firstView.unmount();

  renderApp(["/auth"]);

  await userEvent.click(screen.getByRole("button", { name: "ENTRAR" }));
  const email = screen.getByLabelText(/^e-?mail$/i);
  const password = screen.getByLabelText(/^senha$/i);
  const loginButton = screen.getByRole("button", { name: "ENTRAR" });

  expect(email).toBeInTheDocument();
  expect(password).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ajuda" })).toBeInTheDocument();
  expect(screen.getByText("Manter conectado")).toBeInTheDocument();
  expect(loginButton).toBeDisabled();

  await userEvent.type(email, "donacida@limbse.com");
  await userEvent.type(password, "123456");
  expect(loginButton).toBeEnabled();
  expect(screen.getByRole("button", { name: /Clique aqui para criar/i })).toBeInTheDocument();
});

test("dashboard uses default patient data and opens the prescribed exercise list", async () => {
  renderApp(["/app/dashboard"]);

  expect(screen.getByText("Oi, Cida!")).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /FAZER UM EXERC/i })).toBeInTheDocument();
  expect(screen.getByText(/Progresso nessa semana/i)).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /Navega..o principal/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /FAZER UM EXERC/i }));
  expect(screen.getByRole("heading", { name: /Deslizamento de toalha/i })).toBeInTheDocument();
});

test("dashboard shows assessment accordion and towel exercise for a new patient without triage", async () => {
  renderApp(["/app/dashboard"], { activePatientId: NEW_PATIENT_ID });

  expect(screen.getByText("Oi, Novo paciente!")).toBeInTheDocument();
  expect(screen.getByText(/AVALIA..O GRATUITA/i)).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /AGENDAR AVALIA/i })).toHaveLength(1);
  expect(screen.getByRole("button", { name: /FAZER UM EXERC/i })).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
  expect(screen.queryByText("Rotina prescrita")).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /AGENDAR AVALIA/i }));
  expect(screen.getByRole("heading", { name: /Fernanda/i })).toBeInTheDocument();
});

test("dashboard sends assessment in progress users back to triage intro", async () => {
  window.localStorage.setItem("neuroviva.triage.v1", JSON.stringify({ stroke_count: "1" }));

  renderApp(["/app/dashboard"], { activePatientId: NEW_PATIENT_ID });

  await userEvent.click(screen.getByRole("button", { name: /AGENDAR AVALIA/i }));
  expect(screen.getByRole("heading", { name: /Fernanda/i })).toBeInTheDocument();
});

test("dashboard accordion toggles and towel exercise opens for a new patient", async () => {
  renderApp(["/app/dashboard"], { activePatientId: NEW_PATIENT_ID });

  await userEvent.click(screen.getByRole("button", { name: /Recolher avalia/i }));
  expect(screen.queryByText(/Libere treinos personalizados/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Expandir avalia/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /FAZER UM EXERC/i }));
  expect(screen.getByRole("heading", { name: /Deslizamento de toalha/i })).toBeInTheDocument();
});

test("dashboard shows assessment in progress for a new patient after triage starts", () => {
  window.localStorage.setItem("neuroviva.triage.v1", JSON.stringify({ stroke_count: "1" }));

  renderApp(["/app/dashboard"], { activePatientId: NEW_PATIENT_ID });

  expect(screen.getByText(/AVALIA..O GRATUITA/i)).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /AGENDAR AVALIA/i })).toHaveLength(1);
  expect(screen.getByRole("button", { name: /FAZER UM EXERC/i })).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
  expect(screen.queryByText("Rotina prescrita")).not.toBeInTheDocument();
});

test("saved local session keeps the new patient after remount", () => {
  saveSession({
    activePatientId: NEW_PATIENT_ID,
    userName: "Maria Nova",
    email: "maria@example.com",
  });

  renderApp(["/app/dashboard"]);

  expect(screen.getByText("Oi, Maria Nova!")).toBeInTheDocument();
  expect(screen.getByText(/AVALIA..O GRATUITA/i)).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
});

test("login with a locally registered user opens the new patient dashboard", async () => {
  saveLocalUser({
    email: "joao@example.com",
    displayName: "Joao Local",
    patientId: NEW_PATIENT_ID,
  });

  await loginWithEmail("joao@example.com");

  expect(screen.getByText("Oi, Joao Local!")).toBeInTheDocument();
  expect(screen.getByText(/AVALIA..O GRATUITA/i)).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
});

test("login with Dona Cida mock still opens the active care plan", async () => {
  await loginWithEmail("donacida@limbse.com");

  expect(screen.getByText("Oi, Cida!")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /FAZER UM EXERC/i })).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
});

test("unknown login falls back to the new patient instead of Dona Cida", async () => {
  await loginWithEmail("desconhecido@example.com");

  expect(screen.getByText("Oi, Desconhecido!")).toBeInTheDocument();
  expect(screen.getByText(/AVALIA..O GRATUITA/i)).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
});

test("logout clears saved session and local user can log in again as new patient", async () => {
  saveSession({
    activePatientId: NEW_PATIENT_ID,
    userName: "Ana Local",
    email: "ana@example.com",
  });
  saveLocalUser({
    email: "ana@example.com",
    displayName: "Ana Local",
    patientId: NEW_PATIENT_ID,
  });

  const view = renderApp(["/app/dashboard"]);
  await userEvent.click(screen.getByRole("button", { name: "Sair" }));

  expect(loadSession()).toBeNull();

  view.unmount();
  await loginWithEmail("ana@example.com");

  expect(screen.getByText("Oi, Ana Local!")).toBeInTheDocument();
  expect(screen.queryByText("PLANO DE CUIDADOS ATIVO")).not.toBeInTheDocument();
});

test("exercise list navigates to intro and then to player", async () => {
  renderApp(["/app/exercises"]);

  expect(screen.getByRole("navigation", { name: /Navega..o principal/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /come/i }));
  expect(screen.getByRole("heading", { name: /Deslizamento de toalha/i })).toBeInTheDocument();
  expect(screen.getByText(/Coloque a m.o sobre uma toalha e se posicione/i)).toBeInTheDocument();
  expect(screen.getByText(/Sente-se com os p.s no ch.o/i)).toBeInTheDocument();
  expect(screen.getByText(/Se doer ou formigar/i)).toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: /Navega..o principal/i })).not.toBeInTheDocument();

  const demonstration = screen.getByRole("img", { name: /Deslizamento de toalha/i });
  expect(demonstration).toHaveAttribute("src", expect.stringContaining("Deslizamento"));

  await userEvent.click(screen.getByRole("button", { name: /Reproduzir demonstra..o/i }));
  expect(screen.getByRole("img", { name: /Deslizamento de toalha/i })).toHaveAttribute(
    "src",
    expect.stringContaining("deslizamento_bia"),
  );

  await userEvent.click(screen.getByRole("button", { name: /Pausar demonstra..o/i }));
  expect(screen.getByRole("img", { name: /Deslizamento de toalha/i })).toHaveAttribute(
    "src",
    expect.stringContaining("Deslizamento"),
  );

  await userEvent.click(screen.getByRole("button", { name: /Reproduzir demonstra..o/i }));
  expect(screen.getByRole("img", { name: /Deslizamento de toalha/i })).toHaveAttribute(
    "src",
    expect.stringContaining("deslizamento_bia"),
  );

  await userEvent.click(screen.getByRole("button", { name: /exerc/i }));
  expect(screen.getByRole("button", { name: "INICIAR" })).toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: /Navega..o principal/i })).not.toBeInTheDocument();
});

test("exercise completion restores the bottom navigation", () => {
  renderApp(["/app/exercises/towel-slide/completed"]);

  expect(screen.getByRole("heading", { name: /Conclu.do/i })).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /Navega..o principal/i })).toBeInTheDocument();
});

test("completing an exercise saves activity and shows on dashboard", async () => {
  vi.useFakeTimers();
  try {
    const view = renderApp(["/app/exercises/towel-slide"]);

    await userEvent.click(screen.getByRole("button", { name: "INICIAR" }));
    await act(async () => {
      vi.advanceTimersByTime(180_000);
    });

    expect(window.localStorage.getItem("neuroviva.activities.v1")).toBeTruthy();

    view.unmount();
    renderApp(["/app/dashboard"]);
    expect(screen.getByText(/.ltimo exerc.cio:/i)).toBeInTheDocument();
    expect(screen.getByText(/.ltimo exerc.cio:/i)).not.toHaveTextContent("-");
  } finally {
    vi.useRealTimers();
  }
});

test("changing target series updates completion flow", async () => {
  vi.useFakeTimers();
  try {
    renderApp(["/app/exercises/towel-slide"]);

    await userEvent.click(screen.getByRole("button", { name: /Aumentar s.ries/i }));

    for (let i = 0; i < 2; i += 1) {
      await userEvent.click(screen.getByRole("button", { name: "INICIAR" }));
      await act(async () => {
        vi.advanceTimersByTime(180_000);
      });
    }

    expect(screen.getByRole("heading", { name: /Conclu.do/i })).toBeInTheDocument();
    expect(window.localStorage.getItem("neuroviva.activities.v1")).toBeTruthy();
  } finally {
    vi.useRealTimers();
  }
});

test("triage flow shows questions and requires selection to continue", async () => {
  window.localStorage.setItem(
    "neuroviva.triage.v1",
    JSON.stringify({
      stroke_count: "1",
      last_stroke_when: "Até 3 meses",
      stroke_type: "Isquêmico",
      brain_side: "Direito",
      body_side_most_affected: "Esquerdo",
      caregiver: "Não",
      rehab_with_professional: "Sim",
      rehab_professionals: ["Fisioterapeuta"],
    }),
  );

  renderApp(["/app/triagem"]);

  expect(screen.queryByRole("navigation", { name: /Navega..o principal/i })).not.toBeInTheDocument();
  expect(screen.getByRole("banner", { name: "Triagem" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ajuda" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /neuroviva/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /VAMOS COME/i }));

  expect(window.localStorage.getItem("neuroviva.triage.v1")).toBeNull();
  expect(screen.getByRole("heading", { name: /Quantos AVCs/i })).toBeInTheDocument();
  expect(screen.getByText(/Etapa 1 de 8/i)).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: /Progresso da triagem/i })).toHaveAttribute("aria-valuenow", "12.5");

  const continuar = screen.getByRole("button", { name: /CONTINUAR/i });
  expect(continuar).toBeDisabled();

  await userEvent.click(screen.getByRole("button", { name: "1" }));
  expect(continuar).toBeEnabled();

  await userEvent.click(continuar);
  expect(screen.getByRole("heading", { name: /Quando foi o .ltimo AVC/i })).toBeInTheDocument();
  expect(screen.getByText(/Etapa 2 de 8/i)).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: /Progresso da triagem/i })).toHaveAttribute("aria-valuenow", "25");
});

test("triage intro skip link goes directly to scheduling", async () => {
  renderApp(["/app/triagem"]);

  await userEvent.click(screen.getByRole("button", { name: /Pular triagem e agendar/i }));

  expect(screen.getByRole("banner", { name: "Agendamento" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Agendar teleatendimento/i })).toBeInTheDocument();
});

test("whatsapp schedule uses the shared header and navigates to date selection", async () => {
  renderApp(["/app/agendamento/whatsapp"]);

  expect(screen.getByRole("banner", { name: "Agendamento" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ajuda" })).toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: /Navega..o principal/i })).not.toBeInTheDocument();

  const chooseDate = screen.getByRole("button", { name: /ESCOLHER DATA/i });
  expect(chooseDate).toBeDisabled();

  await userEvent.type(screen.getByLabelText(/N.mero de WhatsApp/i), "11999232324");
  expect(chooseDate).toBeEnabled();

  await userEvent.click(chooseDate);
  expect(screen.getByRole("banner", { name: "Agendamento" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Escolher data/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ajuda" })).toBeInTheDocument();
});
