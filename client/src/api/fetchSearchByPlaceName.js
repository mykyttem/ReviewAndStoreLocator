export async function searchByPlaceName(
    placeName,
    {
        setLocation,
        setLoading,
        setShops,
        cacheShops,
        setOfflineMessage,
        isOnline,
    }
) {
    if (!isOnline) {
        setLocation((prev) => ({
            ...prev,
            error: "Ви не в мережі. Використовуються кешовані дані.",
        }));
        return;
    }

    if (!placeName || placeName.trim() === "") {
        setLocation((prev) => ({
            ...prev,
            error: "Введіть назву місця для пошуку.",
        }));
        return;
    }

    setLoading(true);

    try {
        const response = await fetch("http://localhost:8000/search_by_place", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ place: placeName }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        if (data.status === "success") {
            const shopsData = data.nearby_shops || [];
            const userLocation = data.user_location;

            setLocation({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                error: null,
            });

            setShops(shopsData);
            cacheShops(shopsData, userLocation);
            setOfflineMessage("");
        }
    } catch (error) {
        console.error("Error:", error);
        setLocation((prev) => ({
            ...prev,
            error: "Помилка під час пошуку по назві місця.",
        }));
    } finally {
        setLoading(false);
    }
}
