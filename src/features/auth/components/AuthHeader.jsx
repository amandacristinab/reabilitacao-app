import React from "react";
import logo from "../../../../assets/logo.png";
import { HeaderHelpButton } from "../../../shared/ui/HeaderHelpButton";
import styles from "./AuthHeader.module.css";

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g clipPath="url(#auth-back-icon)">
        <path
          d="M7.16005 10.972C8.08707 9.87825 9.32759 9.09554 10.7139 8.7297C12.1002 8.36385 13.5654 8.43252 14.9114 8.92642C16.2574 9.42031 17.4193 10.3156 18.2399 11.4913C19.0606 12.6669 19.5005 14.0662 19.5 15.5C19.5 15.8978 19.6581 16.2794 19.9394 16.5607C20.2207 16.842 20.6022 17 21 17C21.3979 17 21.7794 16.842 22.0607 16.5607C22.342 16.2794 22.5 15.8978 22.5 15.5C22.5 9.97701 18.023 5.50001 12.5 5.50001C11.1017 5.49829 9.71854 5.79077 8.44055 6.35844C7.16256 6.92611 6.01828 7.75627 5.08205 8.79501L4.73505 6.83001C4.70434 6.63292 4.63463 6.44393 4.53 6.27411C4.42537 6.10429 4.28792 5.95704 4.12569 5.84099C3.96346 5.72493 3.77972 5.64239 3.58521 5.59821C3.3907 5.55402 3.18933 5.54907 2.99288 5.58366C2.79643 5.61824 2.60886 5.69165 2.44113 5.7996C2.2734 5.90755 2.12888 6.04787 2.01604 6.21235C1.9032 6.37683 1.82429 6.56217 1.78394 6.75751C1.74359 6.95285 1.74261 7.15428 1.78105 7.35001L2.82305 13.26C2.89205 13.651 3.11305 14 3.44005 14.228C3.84305 14.51 4.37405 14.573 4.82505 14.43L10.469 13.434C10.6661 13.4033 10.8551 13.3336 11.0249 13.229C11.1948 13.1243 11.342 12.9869 11.4581 12.8247C11.5741 12.6624 11.6567 12.4787 11.7008 12.2842C11.745 12.0897 11.75 11.8883 11.7154 11.6918C11.6808 11.4954 11.6074 11.3078 11.4995 11.1401C11.3915 10.9724 11.2512 10.8278 11.0867 10.715C10.9222 10.6022 10.7369 10.5233 10.5415 10.4829C10.3462 10.4426 10.1448 10.4416 9.94905 10.48L7.16105 10.971L7.16005 10.972Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="auth-back-icon">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AuthHeader({ onBack }) {
  return (
    <header className={styles.header} aria-label="Neuroviva">
      {onBack ? (
        <button type="button" className={styles.backButton} aria-label="Voltar" onClick={onBack}>
          <BackIcon />
        </button>
      ) : (
        <div className={styles.headerSide} aria-hidden="true" />
      )}
      <img src={logo} alt="neuroviva" className={styles.logo} />
      <HeaderHelpButton />
    </header>
  );
}
