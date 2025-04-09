import React from "react";
import HeaderStyles from "./Header.module.css";
import SearchByPlace from "../SearchByPlace/SearchByPlace";

export default function Header({ handleRefresh, onSearchPlace }) {
    return (
        <header className={HeaderStyles.header}>
            <h1 className={HeaderStyles.title}>🔍 Магазини поблизу</h1>
            <SearchByPlace onSearchPlace={onSearchPlace} />

            <button
                onClick={handleRefresh}
                className={HeaderStyles.refreshButton}
            >
                Оновити
            </button>
        </header>
    );
}
