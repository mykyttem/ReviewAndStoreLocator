import React from "react";
import ShopCard from "../ShopCard/ShopCard";
import ListShopsStyles from "./ListShops.module.css";

export default function ListShops({ shops, loading }) {
    const isShopsArray = Array.isArray(shops);

    return (
        <section className={ListShopsStyles.shopsSection}>
            <h2>🏪 Знайдені магазини</h2>
            {isShopsArray && shops.length > 0 ? (
                <div className={ListShopsStyles.shopGrid}>
                    {shops.map((shop, index) => (
                        <ShopCard key={index} shop={shop} />
                    ))}
                </div>
            ) : (
                !loading && (
                    <p className={ListShopsStyles.noShops}>
                        На жаль, магазинів поблизу не знайдено 😞
                    </p>
                )
            )}
        </section>
    );
}
