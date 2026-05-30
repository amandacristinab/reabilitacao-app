import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { HeaderHelpButton } from "./HeaderHelpButton";
import styles from "./ScreenHeader.module.css";

export function ScreenHeader({ ariaLabel = "Neuroviva", onBack, variant = "default" }) {
  const navigate = useNavigate();
  const isAuthLike = variant === "authLike";
  const headerClassName = [styles.header, isAuthLike ? styles.authLike : ""].filter(Boolean).join(" ");
  const backClassName = [styles.iconButton, isAuthLike ? styles.authLikeBackButton : ""].filter(Boolean).join(" ");
  const logoClassName = [styles.logo, isAuthLike ? styles.authLikeLogo : ""].filter(Boolean).join(" ");

  return (
    <header className={headerClassName} aria-label={ariaLabel}>
      <button
        type="button"
        className={backClassName}
        aria-label="Voltar"
        onClick={onBack ?? (() => navigate(-1))}
      >
        <ChevronLeft size={22} strokeWidth={3} />
      </button>
      <img src={logo} alt="neuroviva" className={logoClassName} />
      <HeaderHelpButton />
    </header>
  );
}
