import React from "react";
import { Check } from "lucide-react";
import styles from "./AuthCheckbox.module.css";

export function AuthCheckbox({ label }) {
  return (
    <div className={styles.checkbox} role="checkbox" aria-checked="true" aria-label={label}>
      <span className={styles.mark} aria-hidden="true">
        <Check size={26} strokeWidth={3} />
      </span>
      <span>{label}</span>
    </div>
  );
}
