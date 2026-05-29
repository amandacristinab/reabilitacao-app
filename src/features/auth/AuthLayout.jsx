import React from "react";
import styles from "./AuthLayout.module.css";

export function AuthLayout({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header} aria-label="Neuroviva">
          <div className={styles.brand}>
            <img src="/logo192.png" alt="" className={styles.brandIcon} />
            <div className={styles.brandText}>
              <div className={styles.brandName}>neuroviva</div>
              <div className={styles.brandSub}>Reabilitação com tecnologia e cuidado</div>
            </div>
          </div>
        </header>

        <div className={styles.card}>{children}</div>
      </div>
    </div>
  );
}
