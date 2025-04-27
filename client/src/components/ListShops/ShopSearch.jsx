import React from "react";
import ListShopsStyles from "./ShopSearch.module.css";

export default function ShopSearch({ searchQuery, setSearchQuery }) {
    return (
        <div className={ListShopsStyles.searchContainer}>
            <input
                type="text"
                placeholder="Пошук за назвою, описом або вулицею..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={ListShopsStyles.searchInput}
            />
        </div>
    );
}
