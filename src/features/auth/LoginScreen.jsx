import React, { useMemo, useState } from "react";
import { ChevronLeft, CircleHelp, Eye, EyeOff, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { useSession } from "../../app/state/session";
import logo from "../../../assets/logo.png";
import statusBar from "../../../assets/StatusBar.png";
import styles from "./LoginScreen.module.css";

export function LoginScreen() {
  const navigate = useNavigate();
  const { setUserName } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepConnected, setKeepConnected] = useState(false);

  const isFormValid = useMemo(() => email.trim() !== "" && password.trim() !== "", [email, password]);

  const handleLogin = () => {
    if (!isFormValid) return;
    const name = email.includes("@") ? email.split("@")[0] : email;
    setUserName(name || "UTILIZADOR");
    navigate("/app/dashboard");
  };

  const handleMicClick = () => {
    // Placeholder for voice input.
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

        <main className={styles.main} aria-label="Login">
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                EMAIL
              </label>
              <div className={styles.inputShell}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder="Insira o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <button type="button" className={styles.iconButton} aria-label="Microfone" onClick={handleMicClick}>
                  <Mic size={18} strokeWidth={2.4} />
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                SENHA
              </label>
              <div className={styles.inputShell}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2.4} /> : <Eye size={18} strokeWidth={2.4} />}
                </button>
              </div>
            </div>

            <label className={styles.keepConnected}>
              <input
                type="checkbox"
                checked={keepConnected}
                onChange={(e) => setKeepConnected(e.target.checked)}
              />
              <span>Manter conectado</span>
            </label>

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

