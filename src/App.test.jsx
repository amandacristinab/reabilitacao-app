import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ActivityProvider } from "./app/state/activity";
import { SessionProvider } from "./app/state/session";
import { AppRoutes } from "./app/routes";

function renderApp(initialEntries) {
  return render(
    <SessionProvider>
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

test("renders welcome screen", () => {
  renderApp(["/"]);

  expect(screen.getByRole("img", { name: /neuroviva/i })).toBeInTheDocument();
  expect(screen.getByText(/Sua companheira/i)).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /come/i })).toHaveLength(2);
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

  expect(screen.getByText("Oi, DONA CIDA!")).toBeInTheDocument();
  expect(screen.getByText("PLANO DE CUIDADOS ATIVO")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /VER EXERC/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /FAZER UM EXERC/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /VER EXERC/i }));
  expect(screen.getByRole("heading", { name: "Exercícios" })).toBeInTheDocument();
  expect(screen.getByText("Rotina prescrita")).toBeInTheDocument();
  expect(screen.getByText(/5x\/semana/i)).toBeInTheDocument();
});

test("exercise list navigates to intro and then to player", async () => {
  renderApp(["/app/exercises"]);

  await userEvent.click(screen.getByRole("button", { name: /come/i }));
  expect(screen.getByRole("heading", { name: /Deslizamento de toalha/i })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /Deslizamento de toalha/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /exerc/i }));
  expect(screen.getByRole("button", { name: "INICIAR" })).toBeInTheDocument();
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
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText(/Deslizamento de toalha/i)).toBeInTheDocument();
    expect(screen.getByText(/Último exercício:/i)).toBeInTheDocument();
    expect(screen.getByText(/Último exercício:/i)).not.toHaveTextContent("-");
  } finally {
    vi.useRealTimers();
  }
});

test("changing target series updates completion flow", async () => {
  vi.useFakeTimers();
  try {
    renderApp(["/app/exercises/towel-slide"]);

    await userEvent.click(screen.getByRole("button", { name: "Aumentar séries" }));

    for (let i = 0; i < 2; i += 1) {
      await userEvent.click(screen.getByRole("button", { name: "INICIAR" }));
      await act(async () => {
        vi.advanceTimersByTime(180_000);
      });
    }

    expect(screen.getByRole("heading", { name: /Concluído/i })).toBeInTheDocument();
    expect(window.localStorage.getItem("neuroviva.activities.v1")).toBeTruthy();
  } finally {
    vi.useRealTimers();
  }
});

test("triage flow shows questions and requires selection to continue", async () => {
  renderApp(["/app/triagem"]);

  await userEvent.click(screen.getByRole("button", { name: /VAMOS COME/i }));

  expect(screen.getByRole("heading", { name: /Quantos AVCs/i })).toBeInTheDocument();
  expect(screen.getByText(/Etapa 1 de 8/i)).toBeInTheDocument();

  const continuar = screen.getByRole("button", { name: /CONTINUAR/i });
  expect(continuar).toBeDisabled();

  await userEvent.click(screen.getByRole("button", { name: "1" }));
  expect(continuar).toBeEnabled();

  await userEvent.click(continuar);
  expect(screen.getByRole("heading", { name: /Quando foi o último AVC/i })).toBeInTheDocument();
  expect(screen.getByText(/Etapa 2 de 8/i)).toBeInTheDocument();
});
