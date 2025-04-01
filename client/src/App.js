import React, { useState, useEffect } from "react";
import styles from "./App.module.css";

function App() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStats, setShowStats] = useState(false);

    // Статистика магазинів
    const shopsStats = {
        total: shops.length,
        averageRating:
            shops.reduce((sum, shop) => sum + (shop.rating || 0), 0) /
            (shops.length || 1),
        topRated:
            shops.length > 0
                ? [...shops].sort(
                      (a, b) => (b.rating || 0) - (a.rating || 0)
                  )[0]
                : null,
    };

    const fetchLocationAndShops = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        latitude,
                        longitude,
                        error: null,
                    });
                    setLoading(true);

                    try {
                        const response = await fetch(
                            "http://localhost:8000/location",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    latitude,
                                    longitude,
                                }),
                            }
                        );

                        const data = await response.json();

                        if (data.status === "success") {
                            setShops(data.nearby_shops || []);
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        setLocation((prev) => ({
                            ...prev,
                            error: "Помилка отримання даних",
                        }));
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        error: "Дозвольте доступ до геолокації для пошуку магазинів",
                    });
                    setLoading(false);
                }
            );
        } else {
            setLocation({
                latitude: null,
                longitude: null,
                error: "Геолокація не підтримується вашим браузером",
            });
        }
    };

    const handleRefresh = () => {
        fetchLocationAndShops();
    };

    const toggleStats = () => {
        setShowStats(!showStats);
    };

    return (
        <div className={styles.appContainer}>
            {/* Навігаційна панель зліва */}
            <nav className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>Меню</h3>
                </div>
                <ul className={styles.sidebarMenu}>
                    <li>
                        <button
                            onClick={toggleStats}
                            className={`${styles.menuButton} ${
                                showStats ? styles.active : ""
                            }`}
                        >
                            📊 Статистика
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleRefresh}
                            className={styles.menuButton}
                        >
                            🔄 Оновити дані
                        </button>
                    </li>
                </ul>

                {/* Блок статистики */}
                {showStats && (
                    <div className={styles.statsPanel}>
                        <h4>Статистика магазинів</h4>
                        <div className={styles.statItem}>
                            <span>Всього магазинів:</span>
                            <span className={styles.statValue}>
                                {shopsStats.total}
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span>Середній рейтинг:</span>
                            <span className={styles.statValue}>
                                {shopsStats.averageRating.toFixed(1)}
                            </span>
                        </div>
                        {shopsStats.topRated && (
                            <div className={styles.statItem}>
                                <span>Найкращий магазин:</span>
                                <span className={styles.statValue}>
                                    {shopsStats.topRated.name} (
                                    {shopsStats.topRated.rating.toFixed(1)})
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Основний вміст */}
            <div className={styles.mainContentWrapper}>
                <header className={styles.header}>
                    <h1 className={styles.title}>🔍 Магазини поблизу</h1>
                </header>

                <main className={styles.mainContent}>
                    {location.error ? (
                        <div className={styles.errorBox}>
                            <p>🚨 {location.error}</p>
                            {location.error.includes("Дозвольте доступ") && (
                                <button
                                    onClick={handleRefresh}
                                    className={styles.tryAgainButton}
                                >
                                    Спробувати знову
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={styles.locationCard}>
                            <h3>📍 Ваше місцезнаходження</h3>
                            <div className={styles.coordinates}>
                                <span>
                                    Широта: {location.latitude?.toFixed(4)}
                                </span>
                                <span>
                                    Довгота: {location.longitude?.toFixed(4)}
                                </span>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className={styles.loaderContainer}>
                            <div className={styles.loader}></div>
                            <p>Шукаємо магазини поблизу...</p>
                        </div>
                    )}

                    <section className={styles.shopsSection}>
                        <h2>🏪 Знайдені магазини</h2>
                        {shops.length > 0 ? (
                            <div className={styles.shopGrid}>
                                {shops.map((shop, index) => (
                                    <div
                                        key={index}
                                        className={styles.shopCard}
                                    >
                                        <h3>{shop.name}</h3>
                                        <p className={styles.address}>
                                            {shop.address}
                                        </p>

                                        {shop.rating && (
                                            <div className={styles.rating}>
                                                <span>Рейтинг: </span>
                                                <span
                                                    className={
                                                        styles.ratingStars
                                                    }
                                                >
                                                    {Array.from({
                                                        length: 5,
                                                    }).map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={
                                                                i <
                                                                Math.round(
                                                                    shop.rating
                                                                )
                                                                    ? styles.filledStar
                                                                    : styles.emptyStar
                                                            }
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </span>
                                                <span>
                                                    ({shop.rating.toFixed(1)})
                                                </span>
                                                {shop.total_reviews > 0 && (
                                                    <span
                                                        className={
                                                            styles.reviewsCount
                                                        }
                                                    >
                                                        • {shop.total_reviews}{" "}
                                                        відгуків
                                                    </span>
                                                )}
                                                <div
                                                    className={
                                                        styles.weightedRating
                                                    }
                                                >
                                                    <span>
                                                        Зважений рейтинг:{" "}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.ratingValue
                                                        }
                                                    >
                                                        {shop.weighted_rating?.toFixed(
                                                            2
                                                        ) || "н/д"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {shop.opening_hours && (
                                            <div
                                                className={styles.openingHours}
                                            >
                                                <h4>Години роботи:</h4>
                                                <ul>
                                                    {shop.opening_hours.map(
                                                        (hour, i) => (
                                                            <li key={i}>
                                                                {hour}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        <div className={styles.linksContainer}>
                                            {shop.location && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${shop.location.lat},${shop.location.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.mapLink}
                                                >
                                                    Відкрити на мапі
                                                </a>
                                            )}

                                            {shop.website && (
                                                <a
                                                    href={
                                                        shop.website.startsWith(
                                                            "http"
                                                        )
                                                            ? shop.website
                                                            : `https://${shop.website}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={
                                                        styles.websiteLink
                                                    }
                                                >
                                                    Перейти на сайт
                                                </a>
                                            )}

                                            {shop.phone && (
                                                <a
                                                    href={`tel:${shop.phone.replace(
                                                        /[^0-9+]/g,
                                                        ""
                                                    )}`}
                                                    className={styles.phoneLink}
                                                >
                                                    {shop.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !loading && (
                                <p className={styles.noShops}>
                                    На жаль, магазинів поблизу не знайдено 😞
                                </p>
                            )
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default App;
