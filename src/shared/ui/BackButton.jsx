import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css";

export function BackButton({ onClick, label = "Voltar" }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label={label}
      className={styles.button}
      onClick={onClick ?? (() => navigate(-1))}
    >
      <ChevronLeft size={24} strokeWidth={3} />
    </button>
  );
}

