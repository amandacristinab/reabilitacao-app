import React, { useMemo, useState } from "react";
import { ChevronLeft, CircleHelp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { useSession } from "../../app/state/session";
import logo from "../../../assets/logo.png";
import statusBar from "../../../assets/StatusBar.png";
import styles from "./RegisterDetailsScreen.module.css";

export function RegisterDetailsScreen() {
  const navigate = useNavigate();
  const { setUserName } = useSession();
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
    setUserName(formData.nomeCompleto.trim() || "UTILIZADOR");
    navigate("/success");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <img src={statusBar} alt="Status bar" className={styles.statusBar} />

        <header className={styles.header} aria-label="Neuroviva">
          <button type="button" className={styles.backButton} aria-label="Voltar" onClick={() => navigate(-1)}>
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <img src={logo} alt="neuroviva" className={styles.logo} />
          <button type="button" className={styles.helpButton} aria-label="Ajuda" disabled>
            <CircleHelp size={22} />
          </button>
        </header>

        <main className={styles.main} aria-label="Cadastro">
          <header className={styles.screenHeader}>
            <h2 className={styles.title}>Cadastro</h2>
            <p className={styles.subtitle}>Conte-nos um pouco sobre si.</p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="nomeCompleto">
                NOME COMPLETO
              </label>
              <div className={styles.inputShell}>
                <input
                  id="nomeCompleto"
                  name="nomeCompleto"
                  className={styles.input}
                  placeholder="O seu nome"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                E-MAIL
              </label>
              <div className={styles.inputShell}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirmacaoEmail">
                CONFIRMAÇÃO DE E-MAIL
              </label>
              <div className={styles.inputShell}>
                <input
                  id="confirmacaoEmail"
                  name="confirmacaoEmail"
                  type="email"
                  className={styles.input}
                  placeholder="repita seu@email.com"
                  value={formData.confirmacaoEmail}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {!emailsMatch ? <div className={styles.error}>Os e-mails não coincidem.</div> : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="sexo">
                SEXO
              </label>
              <div className={styles.inputShell}>
                <select
                  id="sexo"
                  name="sexo"
                  className={styles.selectLikeInput}
                  value={formData.sexo}
                  onChange={handleChange}
                >
                  <option value="">Selecione...</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="peso">
                  PESO (kg)
                </label>
                <div className={styles.inputShell}>
                  <input
                    id="peso"
                    name="peso"
                    type="number"
                    className={styles.input}
                    placeholder="Ex: 70"
                    value={formData.peso}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="altura">
                  ALTURA (cm)
                </label>
                <div className={styles.inputShell}>
                  <input
                    id="altura"
                    name="altura"
                    type="number"
                    className={styles.input}
                    placeholder="Ex: 175"
                    value={formData.altura}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    autoComplete="off"
                  />
                </div>
              </div>
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

