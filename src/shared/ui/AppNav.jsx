import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart2, Dumbbell, Home, User } from "lucide-react";
import styles from "./AppNav.module.css";

const ICONS = {
  dashboard: Home,
  exercises: Dumbbell,
  progress: BarChart2,
  profile: User,
};

const LABELS = {
  dashboard: "Início",
  exercises: "Treino",
  progress: "Progresso",
  profile: "Perfil",
};

export function AppNav({ items, activeId }) {
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <div className={styles.brand} aria-label="Neuroviva">
        <img src="/logo192.png" alt="" className={styles.brandIcon} />
        <div className={styles.brandText}>
          <div className={styles.brandName}>neuroviva</div>
          <div className={styles.brandSub}>Reabilitação</div>
        </div>
      </div>

      <div className={styles.items}>
        {items.map((item) => {
          const Icon = ICONS[item.id];
          const isActive = activeId === item.id;
          return (
            <NavLink
              key={item.id}
              className={[styles.item, isActive ? styles.itemActive : ""].filter(Boolean).join(" ")}
              to={item.to}
            >
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.6 : 2.2}
                  color={isActive ? "var(--color-primary)" : "var(--color-muted)"}
                />
              </span>
              <span className={styles.label}>{LABELS[item.id] ?? item.id}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

