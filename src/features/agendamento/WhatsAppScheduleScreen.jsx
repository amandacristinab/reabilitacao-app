import React, { useMemo, useState } from "react";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import triagemImage from "../../../assets/triagem 1.png";
import { Button } from "../../shared/ui/Button";
import { ScreenHeader } from "../../shared/ui/ScreenHeader";
import { formatBrMobilePhone, toDigits } from "./phoneMask";
import { loadWhatsAppPhoneDigits, saveWhatsAppPhoneDigits } from "./whatsappPhoneStorage";
import styles from "./WhatsAppScheduleScreen.module.css";

export function WhatsAppScheduleScreen() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(() => loadWhatsAppPhoneDigits());

  const maskedValue = useMemo(() => formatBrMobilePhone(digits), [digits]);
  const isValid = digits.length === 11;

  return (
    <div className={styles.page}>
      <ScreenHeader ariaLabel="Agendamento" variant="authLike" />

      <main className={styles.main}>
        <div className={styles.illustrationWrap} aria-hidden="true">
          <img src={triagemImage} alt="" className={styles.illustration} />
        </div>

        <section className={styles.copy} aria-label="Agendamento de teleatendimento">
          <h2 className={styles.title}>Agendar teleatendimento</h2>
          <p className={styles.subtitle}>
            Agora vamos escolher um dia e horário para você conversar com nossa equipe de reabilitação
          </p>
        </section>

        <section className={styles.form} aria-label="WhatsApp">
          <div className={styles.sectionLabel}>WHATSAPP</div>

          <div className={styles.phoneRow}>
            <input
              className={styles.phoneInput}
              aria-label="Número de WhatsApp"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="(11) 99923-2324"
              value={maskedValue}
              onChange={(e) => {
                const nextDigits = toDigits(e.target.value, 11);
                setDigits(nextDigits);
                saveWhatsAppPhoneDigits(nextDigits);
              }}
            />

            <button
              type="button"
              className={styles.micButton}
              aria-label="Digitar por voz (em breve)"
              onClick={() => window.alert("Em breve")}
            >
              <Mic size={20} />
            </button>
          </div>

          <p className={styles.hint}>A chamada será realizada no WhatsApp</p>

          <div className={styles.ctaWrap}>
            <Button
              type="button"
              className={styles.cta}
              disabled={!isValid}
              onClick={() => navigate("/app/agendamento/data")}
            >
              ESCOLHER DATA
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
