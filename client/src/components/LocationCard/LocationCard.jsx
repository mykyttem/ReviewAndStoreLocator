import React from "react";
import LocationCardStyles from "./LocationCard.module.css";

export default function LocationCard({ location, offlineMessage }) {
    return (
        <div className={LocationCardStyles.locationCard}>
            <h3>📍 Ваше місцезнаходження</h3>
            <div className={LocationCardStyles.coordinates}>
                <span>Широта: {location.latitude?.toFixed(4)}</span>
                <span>Довгота: {location.longitude?.toFixed(4)}</span>
            </div>
            {offlineMessage && (
                <p className={LocationCardStyles.offlineInfoSmall}>
                    ℹ️ {offlineMessage}
                </p>
            )}
        </div>
    );
}
