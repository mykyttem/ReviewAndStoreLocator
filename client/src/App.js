import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        latitude,
                        longitude,
                        error: null,
                    });

                    try {
                        // Send data to the FastAPI server
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
                    } catch (error) {
                        console.error("Error sending location to server:", error);
                    }
                },
                (error) => {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        error: error.message,
                    });
                }
            );
        } else {
            setLocation({
                latitude: null,
                longitude: null,
                error: "Геолокація не підтримується вашим браузером",
            });
        }
    }, []);

    return (
        <div className="App">
            <h2>Геолокація</h2>
            {location.error ? (
                <p className="error">Помилка: {location.error}</p>
            ) : (
                <div className="location-info">
                    <p>Широта: {location.latitude}</p>
                    <p>Довгота: {location.longitude}</p>
                    {location.latitude && location.longitude && (
                        <p>Дані успішно відправлено на сервер</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;