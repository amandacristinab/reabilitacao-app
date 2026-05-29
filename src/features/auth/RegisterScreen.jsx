import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../shared/ui/BackButton";
import { Button } from "../../shared/ui/Button";
import { TextField } from "../../shared/ui/TextField";
import { AuthLayout } from "./AuthLayout";
import { useSession } from "../../app/state/session";
import styles from "./RegisterScreen.module.css";

export function RegisterScreen() {
  const navigate = useNavigate();
  const { setUserName } = useSession();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    altura: "",
    peso: "",
    dataNasc: "",
    sexo: "",
    lesao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setUserName(formData.nome || "UTILIZADOR");
    navigate("/success");
  };

  return (
    <AuthLayout>
      <div className={styles.wrapper}>
        <BackButton onClick={() => navigate(-1)} />

        <header className={styles.header}>
          <h2 className={styles.title}>Cadastro</h2>
          <p className={styles.subtitle}>Conte-nos um pouco sobre si.</p>
        </header>

        <div className={styles.form}>
          <TextField
            label="NOME COMPLETO"
            name="nome"
            placeholder="O seu nome"
            value={formData.nome}
            onChange={handleChange}
          />
          <TextField
            label="E-MAIL"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
          />

          <div className={styles.row}>
            <TextField
              label="ALTURA (cm)"
              name="altura"
              type="number"
              placeholder="Ex: 175"
              value={formData.altura}
              onChange={handleChange}
            />
            <TextField
              label="PESO (kg)"
              name="peso"
              type="number"
              placeholder="Ex: 70"
              value={formData.peso}
              onChange={handleChange}
            />
          </div>

          <TextField
            label="DATA DE NASCIMENTO"
            name="dataNasc"
            type="date"
            value={formData.dataNasc}
            onChange={handleChange}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="sexo">
              SEXO
            </label>
            <select
              id="sexo"
              name="sexo"
              className={styles.select}
              value={formData.sexo}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <TextField
            label="NOME DA LESÃO / CONDIÇÃO"
            name="lesao"
            placeholder="Ex: Lesão Medular T12"
            value={formData.lesao}
            onChange={handleChange}
          />

          <div className={styles.submit}>
            <Button onClick={handleSubmit}>FINALIZAR CADASTRO</Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

