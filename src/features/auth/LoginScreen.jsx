import React, { useMemo, useState } from "react";
import { Eye, EyeOff, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthCheckbox } from "./components/AuthCheckbox";
import { AuthField } from "./components/AuthField";
import { AuthHeader } from "./components/AuthHeader";
import { Button } from "../../shared/ui/Button";
import { useSession } from "../../app/state/session";
import { DEFAULT_PATIENT_ID, getPatients } from "../../shared/data/mockData";
import styles from "./LoginScreen.module.css";

export function LoginScreen() {
  const navigate = useNavigate();
  const { setActivePatientId, setUserName } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = useMemo(() => email.trim() !== "" && password.trim() !== "", [email, password]);

  const handleLogin = () => {
    if (!isFormValid) return;
    const patient = getPatients().find((item) => item.email?.toLowerCase() === email.trim().toLowerCase());
    const fallbackName = email.includes("@") ? email.split("@")[0] : email;
    setActivePatientId(patient?.id ?? DEFAULT_PATIENT_ID);
    setUserName(patient?.displayName ?? fallbackName ?? "UTILIZADOR");
    navigate("/app/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AuthHeader onBack={() => navigate(-1)} />

        <main className={styles.main} aria-label="Login">
          <div className={styles.form}>
            <AuthField
              label="EMAIL"
              htmlFor="email"
              action={
                <button type="button" className={styles.iconButton} aria-label="Entrada por voz" disabled>
                  <Mic size={30} strokeWidth={2.7} />
                </button>
              }
            >
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Insira o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </AuthField>

            <AuthField
              label="SENHA"
              htmlFor="password"
              action={
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={30} strokeWidth={2.7} /> : <Eye size={30} strokeWidth={2.7} />}
                </button>
              }
            >
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </AuthField>

            <AuthCheckbox label="Manter conectado" />

            <Button disabled={!isFormValid} onClick={handleLogin} className={styles.submit}>
              ENTRAR
            </Button>
          </div>

          <footer className={styles.footer}>
            <div className={styles.footerText}>Não tem uma conta?</div>
            <button type="button" className={styles.footerLink} onClick={() => navigate("/register")}>
              Clique aqui para criar
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
