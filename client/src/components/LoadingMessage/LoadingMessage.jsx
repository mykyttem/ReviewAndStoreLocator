import React from "react";
import styles from "./LoadingMessage.module.css";

const LoadingMessage = () => (
    <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Шукаємо магазини поблизу...</p>
    </div>
);

export default LoadingMessage;
