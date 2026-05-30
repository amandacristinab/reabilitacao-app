import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthField } from "./components/AuthField";
import { AuthHeader } from "./components/AuthHeader";
import { Button } from "../../shared/ui/Button";
import { useSession } from "../../app/state/session";
import { NEW_PATIENT_ID } from "../../shared/data/mockData";
import { saveLocalUser } from "./authStorage";
import styles from "./RegisterDetailsScreen.module.css";

export function RegisterDetailsScreen() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    confirmacaoEmail: "",
    sexo: "",
    peso: "",
    altura: "",
  });

  const emailsMatch = useMemo(() => {
    if (!formData.email || !formData.confirmacaoEmail) return true;
    return formData.email.trim().toLowerCase() === formData.confirmacaoEmail.trim().toLowerCase();
  }, [formData.email, formData.confirmacaoEmail]);

  const isFormValid = useMemo(() => {
    const requiredFilled =
      formData.nomeCompleto.trim() &&
      formData.email.trim() &&
      formData.confirmacaoEmail.trim() &&
      formData.sexo &&
      formData.peso !== "" &&
      formData.altura !== "";

    const numbersOk = Number(formData.peso) > 0 && Number(formData.altura) > 0;

    return Boolean(requiredFilled) && emailsMatch && numbersOk;
  }, [emailsMatch, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!isFormValid) return;
    const displayName = formData.nomeCompleto.trim() || "UTILIZADOR";
    const email = formData.email.trim();

    saveLocalUser({
      email,
      displayName,
      patientId: NEW_PATIENT_ID,
    });
    setSession({
      activePatientId: NEW_PATIENT_ID,
      userName: displayName,
      email,
    });
    navigate("/success");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AuthHeader onBack={() => navigate(-1)} />

        <main className={styles.main} aria-label="Cadastro">
          <header className={styles.screenHeader}>
            <h2 className={styles.title}>Cadastro</h2>
            <p className={styles.subtitle}>Conte-nos um pouco sobre si.</p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit}>
            <AuthField label="NOME COMPLETO" htmlFor="nomeCompleto">
              <input
                id="nomeCompleto"
                name="nomeCompleto"
                placeholder="O seu nome"
                value={formData.nomeCompleto}
                onChange={handleChange}
                autoComplete="name"
              />
            </AuthField>

            <AuthField label="E-MAIL" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </AuthField>

            <div className={styles.fieldGroup}>
              <AuthField label="CONFIRMAÇÃO DE E-MAIL" htmlFor="confirmacaoEmail">
                <input
                  id="confirmacaoEmail"
                  name="confirmacaoEmail"
                  type="email"
                  placeholder="repita seu@email.com"
                  value={formData.confirmacaoEmail}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </AuthField>
              {!emailsMatch ? <div className={styles.error}>Os e-mails não coincidem.</div> : null}
            </div>

            <AuthField label="SEXO" htmlFor="sexo">
              <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
              </select>
            </AuthField>

            <div className={styles.row}>
              <AuthField label="PESO (kg)" htmlFor="peso">
                <input
                  id="peso"
                  name="peso"
                  type="number"
                  placeholder="Ex: 70"
                  value={formData.peso}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  autoComplete="off"
                />
              </AuthField>

              <AuthField label="ALTURA (cm)" htmlFor="altura">
                <input
                  id="altura"
                  name="altura"
                  type="number"
                  placeholder="Ex: 175"
                  value={formData.altura}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  autoComplete="off"
                />
              </AuthField>
            </div>

            <Button type="submit" disabled={!isFormValid} className={styles.submit}>
              FINALIZAR CADASTRO
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}
