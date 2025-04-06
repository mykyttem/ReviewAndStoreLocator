import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import Sidebar from "./components/SideBar/Sidebar";
import LocationCard from "./components/LocationCard/LocationCard";
import ShopCard from "./components/ShopCard/ShopCard";

function App() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineMessage, setOfflineMessage] = useState("");

    // Перевірка стану мережі
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        const cachedData = localStorage.getItem("cachedShops");
        if (cachedData) {
            try {
                const {
                    shops: cachedShops,
                    timestamp,
                    location: cachedLocation,
                } = JSON.parse(cachedData);

                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    setShops(cachedShops);
                    if (cachedLocation) {
                        setLocation((prev) => ({
                            ...prev,
                            latitude: cachedLocation.latitude,
                            longitude: cachedLocation.longitude,
                        }));
                    }
                    setOfflineMessage(
                        "Використовуються кешовані дані (останнє оновлення: " +
                            new Date(timestamp).toLocaleString() +
                            ")"
                    );
                }
            } catch (e) {
                console.error("Помилка читання кешованих даних:", e);
            }
        }
    }, []);

    const cacheShops = (shopsData, loc) => {
        const cacheData = {
            shops: shopsData,
            location: loc,
            timestamp: Date.now(),
        };
        localStorage.setItem("cachedShops", JSON.stringify(cacheData));
    };

    // statistics shops
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
        if (!isOnline) {
            setLocation((prev) => ({
                ...prev,
                error: "Ви не в мережі. Використовуються кешовані дані.",
            }));
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const currentLocation = {
                        latitude,
                        longitude,
                        error: null,
                    };
                    setLocation(currentLocation);
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

                        if (!response.ok)
                            throw new Error("Network response was not ok");

                        const data = await response.json();

                        if (data.status === "success") {
                            const shopsData = data.nearby_shops || [];
                            setShops(shopsData);
                            cacheShops(shopsData, { latitude, longitude });
                            setOfflineMessage("");
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        const cachedData = localStorage.getItem("cachedShops");
                        if (cachedData) {
                            const { shops: cachedShops } =
                                JSON.parse(cachedData);
                            if (cachedShops && cachedShops.length > 0) {
                                setShops(cachedShops);
                            }
                        }
                        setLocation((prev) => ({
                            ...prev,
                            error: "Помилка отримання даних. Використовуються кешовані дані.",
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

    useEffect(() => {
        fetchLocationAndShops();
    }, []);

    return (
        <div className={styles.appContainer}>
            {!isOnline && (
                <div className={styles.offlineBanner}>
                    ⚠️ Ви не в мережі. Використовуються кешовані дані.
                </div>
            )}

            <Sidebar
                showStats={showStats}
                toggleStats={toggleStats}
                handleRefresh={handleRefresh}
                shopsStats={shopsStats}
            />

            <div className={styles.mainContentWrapper}>
                <header className={styles.header}>
                    <h1 className={styles.title}>🔍 Магазини поблизу</h1>
                    <button
                        onClick={handleRefresh}
                        className={styles.refreshButton}
                    >
                        Оновити
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
                        <LocationCard
                            location={location}
                            offlineMessage={offlineMessage}
                        />
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
                                    <ShopCard shop={shop} index={index} />
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
