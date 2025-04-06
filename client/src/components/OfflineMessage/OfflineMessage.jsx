import React from "react";
import styles from "./OfflineMessage.module.css";

const OfflineMessage = () => (
    <div className={styles.offlineBanner}>
        ⚠️ Ви не в мережі. Використовуються кешовані дані.
    </div>
);

export default OfflineMessage;
