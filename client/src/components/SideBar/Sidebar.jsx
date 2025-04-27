import React, { useState } from "react";
import SideBarStyles from "./Sidebar.module.css";
import SupportModal from "./Modal/SupportModal";
import {
    FiBarChart2,
    FiRefreshCw,
    FiMessageSquare,
    FiChevronDown,
    FiChevronUp,
    FiCheck,
    FiAlertTriangle,
    FiPieChart,
} from "react-icons/fi";
import AnalyticsModal from "./Modal/AnalyticsModal";

export default function Sidebar({
    showStats,
    toggleStats,
    handleRefresh,
    shopsStats,
    shops,
}) {
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState({
        loading: false,
        success: false,
        error: false,
        message: "",
    });
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

    const handleRefreshWithStatus = async () => {
        setRefreshStatus({
            loading: true,
            success: false,
            error: false,
            message: "Оновлення даних...",
        });

        try {
            await new Promise((resolve) => {
                handleRefresh();
                setTimeout(resolve, 1500);
            });

            setRefreshStatus({
                loading: false,
                success: true,
                error: false,
                message: "Дані успішно оновлено!",
            });

            setTimeout(() => {
                setRefreshStatus((prev) => ({
                    ...prev,
                    success: false,
                    message: "",
                }));
            }, 3000);
        } catch (error) {
            setRefreshStatus({
                loading: false,
                success: false,
                error: true,
                message: "Помилка оновлення",
            });
        }
    };

    return (
        <nav className={SideBarStyles.sidebar}>
            <div className={SideBarStyles.sidebarHeader}>
                <h3>Analytics Dashboard</h3>
            </div>

            <ul className={SideBarStyles.sidebarMenu}>
                <li>
                    <button
                        onClick={toggleStats}
                        className={`${SideBarStyles.menuButton} ${
                            showStats ? SideBarStyles.active : ""
                        }`}
                    >
                        <FiBarChart2 className={SideBarStyles.icon} />
                        <span>Статистика</span>
                        {showStats ? (
                            <FiChevronUp className={SideBarStyles.chevron} />
                        ) : (
                            <FiChevronDown className={SideBarStyles.chevron} />
                        )}
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleRefreshWithStatus}
                        className={SideBarStyles.menuButton}
                        disabled={refreshStatus.loading}
                    >
                        <div className={SideBarStyles.refreshContainer}>
                            {refreshStatus.loading ? (
                                <div className={SideBarStyles.spinner}></div>
                            ) : (
                                <FiRefreshCw className={SideBarStyles.icon} />
                            )}
                            <span>Оновити дані</span>
                        </div>
                    </button>
                    {refreshStatus.message && (
                        <div
                            className={`${SideBarStyles.refreshStatus} ${
                                refreshStatus.error
                                    ? SideBarStyles.error
                                    : refreshStatus.success
                                    ? SideBarStyles.success
                                    : ""
                            }`}
                        >
                            {refreshStatus.success ? (
                                <FiCheck className={SideBarStyles.statusIcon} />
                            ) : refreshStatus.error ? (
                                <FiAlertTriangle
                                    className={SideBarStyles.statusIcon}
                                />
                            ) : null}
                            {refreshStatus.message}
                        </div>
                    )}
                </li>
                <li>
                    <button
                        onClick={() => setShowSupportModal(true)}
                        className={SideBarStyles.menuButton}
                    >
                        <FiMessageSquare className={SideBarStyles.icon} />
                        <span>Техпідтримка</span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setShowAnalyticsModal(true)}
                        className={SideBarStyles.menuButton}
                    >
                        <FiPieChart className={SideBarStyles.icon} />
                        <span>Детальна аналітика</span>
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
                        <span className={SideBarStyles.ratingStar}>★</span>
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
            <AnalyticsModal
                isOpen={showAnalyticsModal}
                onClose={() => setShowAnalyticsModal(false)}
                shops={shops}
            />

            <SupportModal
                isOpen={showSupportModal}
                onClose={() => setShowSupportModal(false)}
            />
        </nav>
    );
}
