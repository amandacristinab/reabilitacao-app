import React from "react";
import styles from "./TextField.module.css";

export function TextField({ label, id, className = "", ...props }) {
  const inputId = id ?? props.name;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input className={styles.input} id={inputId} {...props} />
    </div>
  );
}

