import React, { useState } from "react";
import ShopCardStyles from "./ShopCard.module.css";
import ShopCardModal from "./Modal/ShopCardModal";

export default function ShopCard({ shop, index }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div key={index} className={ShopCardStyles.shopCard}>
            <h3>{shop.name}</h3>
            <p className={ShopCardStyles.address}>{shop.address}</p>

            {shop.rating && (
                <div className={ShopCardStyles.rating}>
                    <span>Рейтинг: </span>
                    <span className={ShopCardStyles.ratingStars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span
                                key={i}
                                className={
                                    i < Math.round(shop.rating)
                                        ? ShopCardStyles.filledStar
                                        : ShopCardStyles.emptyStar
                                }
                            >
                                ★
                            </span>
                        ))}
                    </span>
                    <span>({shop.rating.toFixed(1)})</span>
                    {shop.total_reviews > 0 && (
                        <span className={ShopCardStyles.reviewsCount}>
                            • {shop.total_reviews} відгуків
                        </span>
                    )}
                    <div className={ShopCardStyles.weightedRating}>
                        <span>Зважений рейтинг: </span>
                        <span className={ShopCardStyles.ratingValue}>
                            {shop.weighted_rating?.toFixed(2) || "н/д"}
                        </span>
                    </div>
                </div>
            )}

            {shop.opening_hours && (
                <div className={ShopCardStyles.openingHours}>
                    <h4>Години роботи:</h4>
                    <button
                        onClick={openModal}
                        className={ShopCardStyles.openModalBtn}
                    >
                        Переглянути розклад
                    </button>
                </div>
            )}

            <div className={ShopCardStyles.linksContainer}>
                {shop.location ? (
                    <a
                        href={`${shop.map_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={ShopCardStyles.mapLink}
                    >
                        Відкрити на мапі
                    </a>
                ) : (
                    <p>Локація не надана.</p>
                )}

                {shop.website && (
                    <a
                        href={
                            shop.website.startsWith("http")
                                ? shop.website
                                : `https://${shop.map_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={ShopCardStyles.websiteLink}
                    >
                        Перейти на сайт
                    </a>
                )}

                {shop.phone && (
                    <a
                        href={`tel:${shop.phone.replace(/[^0-9+]/g, "")}`}
                        className={ShopCardStyles.phoneLink}
                    >
                        {shop.phone}
                    </a>
                )}
            </div>

            <ShopCardModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                shop={shop}
            />
        </div>
    );
}
