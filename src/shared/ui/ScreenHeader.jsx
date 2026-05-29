import React from "react";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import styles from "./ScreenHeader.module.css";

export function ScreenHeader({ ariaLabel = "Neuroviva", onBack }) {
  const navigate = useNavigate();
  return (
    <header className={styles.header} aria-label={ariaLabel}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Voltar"
        onClick={onBack ?? (() => navigate(-1))}
      >
        <ChevronLeft size={22} strokeWidth={3} />
      </button>
      <img src={logo} alt="neuroviva" className={styles.logo} />
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Ajuda"
        onClick={() => window.alert("Ajuda em breve")}
      >
        <HelpCircle size={20} />
      </button>
    </header>
  );
}
