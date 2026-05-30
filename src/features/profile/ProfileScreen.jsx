import React from "react";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../app/state/session";
import { getDefaultPatient, getPatientById } from "../../shared/data/mockData";
import { BackButton } from "../../shared/ui/BackButton";
import styles from "./ProfileScreen.module.css";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { activePatientId, userName, logout } = useSession();
  const patient = getPatientById(activePatientId) ?? getDefaultPatient();
  const carePlan = patient?.carePlan ?? null;

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate(-1)} />
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={50} />
        </div>
        <h2 className={styles.name}>{userName || patient?.displayName?.toUpperCase() || "UTILIZADOR"}</h2>
        <p className={styles.sub}>{carePlan?.objective ?? "Utilizador Neuroviva"}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.action}>
          <ShieldCheck size={20} color="var(--color-primary)" />
          <span>{patient?.hasCarePlan ? "Plano de cuidados ativo" : "Configurações de saúde"}</span>
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
          <span>Sair da conta</span>
        </button>
      </div>
    </div>
  );
}
