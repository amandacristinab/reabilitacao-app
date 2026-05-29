import React from "react";
import styles from "./Button.module.css";

export function Button({ variant = "primary", className = "", disabled, ...props }) {
  const variantClass = variant === "outline" ? styles.outline : styles.primary;
  const disabledClass = disabled ? styles.disabled : "";
  return (
    <button
      className={[styles.base, variantClass, disabledClass, className].filter(Boolean).join(" ")}
      disabled={disabled}
      {...props}
    />
  );
}

