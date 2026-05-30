import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.css";

export function Accordion({ title, summary, children, defaultOpen = false, className = "" }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={[styles.accordion, className].filter(Boolean).join(" ")} data-open={isOpen ? "true" : "false"}>
      <button type="button" className={styles.header} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
        <span className={styles.copy}>
          <span className={styles.title}>{title}</span>
          {summary ? <span className={styles.summary}>{summary}</span> : null}
        </span>
        <ChevronDown className={styles.icon} size={20} aria-hidden="true" />
      </button>

      {isOpen ? <div className={styles.body}>{children}</div> : null}
    </section>
  );
}
