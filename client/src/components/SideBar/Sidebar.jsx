import React from "react";
import SideBarStyles from "./Sidebar.module.css";

export default function Sidebar({
    showStats,
    toggleStats,
    handleRefresh,
    shopsStats,
}) {
    return (
        <nav className={SideBarStyles.sidebar}>
            <div className={SideBarStyles.sidebarHeader}>
                <h3>Меню</h3>
            </div>
            <ul className={SideBarStyles.sidebarMenu}>
                <li>
                    <button
                        onClick={toggleStats}
                        className={`${SideBarStyles.menuButton} ${
                            showStats ? SideBarStyles.active : ""
                        }`}
                    >
                        📊 Статистика
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleRefresh}
                        className={SideBarStyles.menuButton}
                    >
                        🔄 Оновити дані
                    </button>
                </li>
            </ul>

            <div
                className={`${SideBarStyles.statsPanel} ${
                    showStats ? SideBarStyles.visible : ""
                }`}
            >
                <h4>Статистика магазинів</h4>
                <div className={SideBarStyles.statItem}>
                    <span>Всього магазинів:</span>
                    <span className={SideBarStyles.statValue}>
                        {shopsStats.total}
                    </span>
                </div>
                <div className={SideBarStyles.statItem}>
                    <span>Середній рейтинг:</span>
                    <span className={SideBarStyles.statValue}>
                        {shopsStats.averageRating.toFixed(1)}
                    </span>
                </div>
                {shopsStats.topRated && (
                    <div className={SideBarStyles.statItem}>
                        <span>Найкращий магазин:</span>
                        <span className={SideBarStyles.statValue}>
                            {shopsStats.topRated.name} (
                            {shopsStats.topRated.rating.toFixed(1)})
                        </span>
                    </div>
                )}
            </div>
        </nav>
    );
}
