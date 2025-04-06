import React from "react";
import styles from "./ErrorMessage.module.css";

const ErrorMessage = ({ error, onRetry }) => (
    <div className={styles.errorBox}>
        <p>🚨 {error}</p>
        {error.includes("Дозвольте доступ") && (
            <button onClick={onRetry} className={styles.tryAgainButton}>
                Спробувати знову
            </button>
        )}
    </div>
);

export default ErrorMessage;
