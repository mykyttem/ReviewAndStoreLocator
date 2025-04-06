import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import Sidebar from "./components/SideBar/Sidebar";
import LocationCard from "./components/LocationCard/LocationCard";
import fetchLocationAndShops from "./api/fetchLocationAndShops";
import OfflineMessage from "./components/OfflineMessage/OfflineMessage";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import LoadingMessage from "./components/LoadingMessage/LoadingMessage";
import Header from "./components/Header/Header";
import ListShops from "./components/ListShops/ListShops";

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

    useEffect(() => {
        fetchLocationAndShops({
            setLocation,
            setLoading,
            setShops,
            cacheShops,
            setOfflineMessage,
            isOnline,
        });
    }, [isOnline]);

    useEffect(() => {
        const handleOnlineStatus = () => setIsOnline(true);
        const handleOfflineStatus = () => setIsOnline(false);

        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOfflineStatus);

        return () => {
            window.removeEventListener("online", handleOnlineStatus);
            window.removeEventListener("offline", handleOfflineStatus);
        };
    }, []);

    const handleRefresh = () => {
        fetchLocationAndShops({
            setLocation,
            setLoading,
            setShops,
            cacheShops,
            setOfflineMessage,
            isOnline,
        });
    };

    const toggleStats = () => {
        setShowStats(!showStats);
    };

    return (
        <div className={styles.appContainer}>
            {!isOnline && <OfflineMessage />}

            <Sidebar
                showStats={showStats}
                toggleStats={toggleStats}
                handleRefresh={handleRefresh}
                shopsStats={shopsStats}
            />

            <div className={styles.mainContentWrapper}>
                <Header handleRefresh={handleRefresh} />

                <main className={styles.mainContent}>
                    {location.error ? (
                        <ErrorMessage
                            error={location.error}
                            onRetry={handleRefresh}
                        />
                    ) : (
                        <LocationCard
                            location={location}
                            offlineMessage={offlineMessage}
                        />
                    )}

                    {loading && <LoadingMessage />}

                    <ListShops shops={shops} loading={loading} />
                </main>
            </div>
        </div>
    );
}

export default App;
