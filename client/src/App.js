import React, { useState, useEffect } from "react";
import "./App.css";

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
                        const response = await fetch("http://localhost:8000/location", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                latitude,
                                longitude,
                            }),
                        });

                        const data = await response.json();
                        console.log("Server response:", data);
                        
                        if (data.status === "success") {
                            setShops(data.nearby_shops || []);
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        error: error.message,
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

    useEffect(() => {
        fetchLocationAndShops();
    }, []);

    return (
        <div className="App">
            <h2>Пошук магазинів поблизу</h2>
            
            {location.error ? (
                <p className="error">Помилка: {location.error}</p>
            ) : (
                <div className="location-info">
                    <p>Ваше місцезнаходження:</p>
                    <p>Широта: {location.latitude}</p>
                    <p>Довгота: {location.longitude}</p>
                </div>
            )}
            
            {loading && <p>Завантаження даних...</p>}
            
            <div className="shops-list">
                <h3>Магазини поблизу:</h3>
                {shops.length > 0 ? (
                    <ul>
                        {shops.map((shop, index) => (
                            <li key={index}>
                                <strong>{shop.name}</strong>
                                <p>{shop.address}</p>
                                {shop.rating && <p>Рейтинг: {shop.rating}/5</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>Магазинів поблизу не знайдено</p>
                )}
            </div>
        </div>
    );
}


export default App;