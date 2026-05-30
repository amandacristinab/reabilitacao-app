import React from "react";
import styles from "./AuthField.module.css";

export function AuthField({ label, htmlFor, action, children }) {
  const input = React.isValidElement(children)
    ? React.cloneElement(children, {
        className: [styles.input, children.props.className].filter(Boolean).join(" "),
      })
    : children;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      <div className={styles.inputShell}>
        {input}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
    </div>
  );
}
