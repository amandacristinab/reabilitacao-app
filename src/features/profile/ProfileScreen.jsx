import React from "react";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../shared/ui/BackButton";
import { useSession } from "../../app/state/session";
import styles from "./ProfileScreen.module.css";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { userName, logout } = useSession();

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate(-1)} />
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={50} />
        </div>
        <h2 className={styles.name}>{userName || "UTILIZADOR"}</h2>
        <p className={styles.sub}>Utilizador Neuroviva</p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.action}>
          <ShieldCheck size={20} color="var(--color-primary)" />
          <span>Configurações de Saúde</span>
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
        >
          <LogOut size={20} color="var(--color-danger)" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </div>
  );
}

