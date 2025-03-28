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
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                    });
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
            <h2>Hello</h2>
            {location.error ? (
                <p className="error">Помилка: {location.error}</p>
            ) : (
                <div className="location-info">
                    <p>Широта: {location.latitude}</p>
                    <p>Довгота: {location.longitude}</p>
                </div>
            )}
        </div>
    );
}

export default App;
