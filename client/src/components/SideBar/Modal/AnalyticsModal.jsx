import React from "react";
import styles from "./AnalyticsModal.module.css";
import { FiX } from "react-icons/fi";

export default function AnalyticsModal({ isOpen, onClose, shops }) {
    if (!isOpen) return null;

    const categories = [...new Set(shops.map((shop) => shop.category))];
    const categoryStats = categories.map((category) => ({
        name: category,
        count: shops.filter((shop) => shop.category === category).length,
        avgRating:
            shops
                .filter((shop) => shop.category === category)
                .reduce((sum, shop) => sum + (shop.rating || 0), 0) /
            shops.filter((shop) => shop.category === category).length,
    }));

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FiX className={styles.closeIcon} />
                </button>

                <h2>📊 Детальна аналітика магазинів</h2>

                <div className={styles.analyticsGrid}>
                    <div className={styles.analyticsCard}>
                        <h3>Розподіл по категоріям</h3>
                        <div className={styles.chartContainer}>
                            {categoryStats.map((cat) => (
                                <div
                                    key={cat.name}
                                    className={styles.chartItem}
                                >
                                    <div
                                        className={styles.chartBar}
                                        style={{
                                            width: `${
                                                (cat.count / shops.length) * 100
                                            }%`,
                                        }}
                                    ></div>
                                    <span>
                                        {cat.name} ({cat.count})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.analyticsCard}>
                        <h3>Рейтинги по категоріям</h3>
                        {categoryStats.map((cat) => (
                            <div key={cat.name} className={styles.ratingItem}>
                                <span>{cat.name}</span>
                                <div className={styles.ratingBar}>
                                    <div
                                        className={styles.ratingFill}
                                        style={{
                                            width: `${
                                                (cat.avgRating / 5) * 100
                                            }%`,
                                        }}
                                    ></div>
                                    <span>{cat.avgRating.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.analyticsTable}>
                    <h3>Топ магазинів</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Категорія</th>
                                <th>Рейтинг</th>
                                <th>Відстань</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...shops]
                                .sort(
                                    (a, b) => (b.rating || 0) - (a.rating || 0)
                                )
                                .slice(0, 5)
                                .map((shop) => (
                                    <tr key={shop.id}>
                                        <td>{shop.name}</td>
                                        <td>{shop.category}</td>
                                        <td>
                                            {shop.rating?.toFixed(1) || "-"}
                                        </td>
                                        <td>
                                            {shop.distance
                                                ? `${shop.distance.toFixed(
                                                      1
                                                  )} км`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
