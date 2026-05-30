import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css";

export function BackButton({ onClick, label = "Voltar", variant = "default" }) {
  const navigate = useNavigate();
  const cls = variant === "authLike" ? styles.buttonAuthLike : styles.button;
  return (
    <button
      type="button"
      aria-label={label}
      className={cls}
      onClick={onClick ?? (() => navigate(-1))}
    >
      <ChevronLeft size={24} strokeWidth={3} />
    </button>
  );
}

