import React, { useState } from "react";
import styles from "./SupportModal.module.css";

export default function SupportModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8000/support-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.status === "success") {
                alert("Повідомлення відправлено!");
                onClose();
            } else {
                alert("Помилка відправки.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Помилка з'єднання.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <h2>Звʼязок з техпідтримкою</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Ваше імʼя"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        name="contact"
                        placeholder="Email або телефон"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className={styles.inputField}
                    />
                    <textarea
                        name="message"
                        placeholder="Опишіть вашу проблему"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className={styles.textArea}
                    />
                    <button type="submit" className={styles.submitButton}>
                        Надіслати
                    </button>
                </form>
            </div>
        </div>
    );
}
