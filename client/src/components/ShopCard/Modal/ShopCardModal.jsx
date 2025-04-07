import React from "react";
import Modal from "react-modal";
import ShopCardStyles from "./ShopCardModal.module.css";

const ShopCardModal = ({ isOpen, onRequestClose, shop }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                content: {
                    maxWidth: "50%",
                    maxHeight: "50%",
                    margin: "auto",
                    overflowY: "auto",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                },
            }}
        >
            <h2>Години роботи для {shop.name}</h2>
            {shop.opening_hours &&
            Array.isArray(shop.opening_hours) &&
            shop.opening_hours.length > 0 ? (
                <div className={ShopCardStyles.openingHours}>
                    <h4>Години роботи:</h4>
                    <ul>
                        {shop.opening_hours.map((hour, i) => (
                            <li key={i}>{hour}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Розклад не надано.</p>
            )}
            <button onClick={onRequestClose}>Закрити</button>
        </Modal>
    );
};

export default ShopCardModal;
