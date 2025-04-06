import React from "react";
import HeaderStyles from "./Header.module.css";

export default function Header({ handleRefresh }) {
    return (
        <header className={HeaderStyles.header}>
            <h1 className={HeaderStyles.title}>🔍 Магазини поблизу</h1>
            <button
                onClick={handleRefresh}
                className={HeaderStyles.refreshButton}
            >
                Оновити
            </button>
        </header>
    );
}
