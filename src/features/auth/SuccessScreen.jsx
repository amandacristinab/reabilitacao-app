import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader } from "./components/AuthHeader";
import { Button } from "../../shared/ui/Button";
import fimCadastro from "../../../assets/fimcadastro.png";
import styles from "./SuccessScreen.module.css";

export function SuccessScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AuthHeader onBack={() => navigate(-1)} />

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
