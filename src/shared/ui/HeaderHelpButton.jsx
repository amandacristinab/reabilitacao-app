import React from "react";
import { HelpCircle } from "lucide-react";
import styles from "./HeaderHelpButton.module.css";

export function HeaderHelpButton({ className = "", onClick, label = "Ajuda" }) {
  const buttonClassName = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={label}
      onClick={onClick ?? (() => window.alert("Ajuda em breve"))}
    >
      <HelpCircle size={50} strokeWidth={2.7} />
    </button>
  );
}
