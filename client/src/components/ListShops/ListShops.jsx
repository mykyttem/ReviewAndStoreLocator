import React, { useState, useEffect } from "react";
import ShopCard from "../ShopCard/ShopCard";
import ListShopsStyles from "./ListShops.module.css";
import ShopSearch from "./ShopSearch";

export default function ListShops({ shops, loading }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const isShopsArray = Array.isArray(shops);

    useEffect(() => {
        if (isShopsArray && shops.length > 0) {
            const allCategories = shops
                .map((shop) => shop.category)
                .filter(Boolean)
                .filter(
                    (category, index, self) => self.indexOf(category) === index
                );
            setCategories(allCategories);
        } else {
            setCategories([]);
        }
    }, [shops, isShopsArray]);

    const filteredShops = shops.filter((shop) => {
        // Filter by category if selected
        const categoryMatch = selectedCategory
            ? shop.category === selectedCategory
            : true;

        // Filter by search query (case insensitive)
        const searchMatch = searchQuery
            ? shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (shop.description &&
                  shop.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())) ||
              (shop.address &&
                  shop.address
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()))
            : true;

        return categoryMatch && searchMatch;
    });

    return (
        <section className={ListShopsStyles.shopsSection}>
            <h2>🏪 Знайдені магазини</h2>

            <ShopSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {categories.length > 0 && (
                <div className={ListShopsStyles.categoryFilters}>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={
                            !selectedCategory
                                ? ListShopsStyles.activeFilter
                                : ""
                        }
                    >
                        Всі категорії
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={
                                selectedCategory === category
                                    ? ListShopsStyles.activeFilter
                                    : ""
                            }
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            <div className={ListShopsStyles.shopGrid}>
                {isShopsArray && filteredShops.length > 0
                    ? filteredShops.map((shop, index) => (
                          <div
                              key={shop.id || index}
                              className={ListShopsStyles.shopCard}
                          >
                              <ShopCard shop={shop} />
                          </div>
                      ))
                    : !loading && (
                          <p className={ListShopsStyles.noShops}>
                              На жаль, магазинів{" "}
                              {selectedCategory
                                  ? `з категорією "${selectedCategory}"`
                                  : ""}{" "}
                              {searchQuery ? `за запитом "${searchQuery}"` : ""}{" "}
                              поблизу не знайдено 😞
                          </p>
                      )}
            </div>
        </section>
    );
}
