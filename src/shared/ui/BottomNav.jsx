import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart2, Dumbbell, Home, User } from "lucide-react";
import styles from "./BottomNav.module.css";

const ICONS = {
  dashboard: Home,
  exercises: Dumbbell,
  progress: BarChart2,
  profile: User,
};

const LABELS = {
  dashboard: "INÍCIO",
  exercises: "TREINO",
  progress: "PROGRESSO",
  profile: "PERFIL",
};

export function BottomNav({ items, activeId }) {
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {items.map((item) => {
        const Icon = ICONS[item.id];
        const isActive = activeId === item.id;
        return (
          <NavLink key={item.id} className={styles.item} to={item.to}>
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              color={isActive ? "var(--color-primary)" : "var(--color-muted)"}
            />
            <span
              className={styles.label}
              style={{ color: isActive ? "var(--color-primary)" : "var(--color-muted)" }}
            >
              {LABELS[item.id] ?? item.id}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}

