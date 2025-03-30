import React, { useState } from "react";
import styles from "./App.module.css";

function App() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <div className={styles.appContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>🔍 Магазини поблизу</h1>
                <button
                    onClick={handleRefresh}
                    className={styles.refreshButton}
                >
                    Оновити дані
                </button>
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
                            <span>Широта: {location.latitude?.toFixed(4)}</span>
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
                                <div key={index} className={styles.shopCard}>
                                    <h3>{shop.name}</h3>
                                    <p className={styles.address}>
                                        {shop.address}
                                    </p>
                                    {shop.rating && (
                                        <div className={styles.rating}>
                                            <span>Рейтинг: </span>
                                            <span
                                                className={styles.ratingStars}
                                            >
                                                {Array.from({ length: 5 }).map(
                                                    (_, i) => (
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
                                                    )
                                                )}
                                            </span>
                                            <span>
                                                ({shop.rating.toFixed(1)})
                                            </span>
                                        </div>
                                    )}
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
    );
}

export default App;
