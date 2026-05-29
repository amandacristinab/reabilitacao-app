import React from "react";
import { ChevronLeft, CircleHelp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import fimCadastro from "../../../assets/fimcadastro.png";
import logo from "../../../assets/logo.png";
import styles from "./SuccessScreen.module.css";

export function SuccessScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header} aria-label="Neuroviva">
          <button type="button" className={styles.backButton} aria-label="Voltar" onClick={() => navigate(-1)}>
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <img src={logo} alt="neuroviva" className={styles.logo} />
          <button type="button" className={styles.helpButton} aria-label="Ajuda" disabled>
            <CircleHelp size={22} />
          </button>
        </header>

        <main className={styles.main} aria-label="Sucesso no cadastro">
          <img src={fimCadastro} alt="Tudo pronto" className={styles.check} />

          <section className={styles.copy} aria-label="Cadastro concluído">
            <h2 className={styles.title}>Tudo pronto!</h2>
            <p className={styles.subtitle}>Sua conta foi criada com sucesso e você já pode começar a treinar!</p>
          </section>

          <div className={styles.actions}>
            <Button onClick={() => navigate("/app/dashboard")}>COMEÇAR</Button>
          </div>
        </main>
      </div>
    </div>
  );
}

