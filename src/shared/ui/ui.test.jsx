import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Accordion } from "./Accordion";
import { BottomNav } from "./BottomNav";
import { Button } from "./Button";

test("BottomNav renders accessible labels without mojibake", () => {
  render(
    <MemoryRouter>
      <BottomNav
        activeId="dashboard"
        items={[
          { id: "dashboard", to: "/app/dashboard" },
          { id: "exercises", to: "/app/exercises" },
          { id: "progress", to: "/app/progress" },
          { id: "profile", to: "/app/profile" },
        ]}
      />
    </MemoryRouter>,
  );

  expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /INÍCIO/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /EXERCÍCIOS/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /PROGRESSO/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /PERFIL/i })).toBeInTheDocument();
});

test("Button keeps disabled actions inert", async () => {
  const handleClick = vi.fn();

  render(
    <Button disabled onClick={handleClick}>
      CONTINUAR
    </Button>,
  );

  await userEvent.click(screen.getByRole("button", { name: "CONTINUAR" }));

  expect(handleClick).not.toHaveBeenCalled();
});

test("Accordion toggles content visibility", async () => {
  render(
    <Accordion title="Resumo do caso" summary="Informações gerais">
      Conteúdo do resumo
    </Accordion>,
  );

  expect(screen.queryByText("Conteúdo do resumo")).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /Resumo do caso/i }));
  expect(screen.getByText("Conteúdo do resumo")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /Resumo do caso/i }));
  expect(screen.queryByText("Conteúdo do resumo")).not.toBeInTheDocument();
});
