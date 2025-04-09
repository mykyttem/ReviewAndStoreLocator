import { useState } from "react";
import styles from "./SearchByPlace.module.css";

export default function SearchByPlace({ onSearchPlace }) {
    const [place, setPlace] = useState("");

    const handlePlaceSearch = () => {
        if (place.trim()) {
            onSearchPlace(place);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handlePlaceSearch();
        }
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                className={styles.searchInput}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Пошук по назві місця (напр. Львів)"
            />
            <button
                onClick={handlePlaceSearch}
                className={styles.searchButton}
            >
                Пошук
            </button>
        </div>
    );
}
