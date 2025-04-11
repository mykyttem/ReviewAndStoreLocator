export default async function fetchLocationAndShops({
    setLocation,
    setLoading,
    setShops,
    cacheShops,
    setOfflineMessage,
    isOnline,
}) {
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
                        "/api/location",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
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
                        const { shops: cachedShops } = JSON.parse(cachedData);
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
}
