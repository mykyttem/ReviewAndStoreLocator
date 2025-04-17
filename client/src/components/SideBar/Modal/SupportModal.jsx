import React, { useState } from "react";
import styles from "./SupportModal.module.css";
import {
    FiSend,
    FiX,
    FiUser,
    FiMail,
    FiPhone,
    FiMessageSquare,
} from "react-icons/fi";

export default function SupportModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

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
                setSubmitStatus("success");
                setFormData({ name: "", contact: "", message: "" });
                setTimeout(() => {
                    onClose();
                    setSubmitStatus(null);
                }, 1500);
            } else {
                setSubmitStatus("error");
            }
        } catch (error) {
            console.error("Error:", error);
            setSubmitStatus("connection_error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FiX size={24} />
                </button>

                <div className={styles.modalHeader}>
                    <FiMessageSquare size={28} className={styles.headerIcon} />
                    <h2>Звʼязок з техпідтримкою</h2>
                </div>

                {submitStatus === "success" ? (
                    <div className={styles.successMessage}>
                        <FiSend size={48} className={styles.successIcon} />
                        <h3>Повідомлення відправлено!</h3>
                        <p>Ми зв'яжемося з вами найближчим часом</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <FiUser className={styles.inputIcon} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Ваше імʼя"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <FiMail className={styles.inputIcon} />
                            <input
                                type="text"
                                name="contact"
                                placeholder="Email або телефон"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <FiMessageSquare className={styles.inputIcon} />
                            <textarea
                                name="message"
                                placeholder="Опишіть вашу проблему..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className={styles.textArea}
                                rows="5"
                            />
                        </div>

                        {submitStatus === "error" && (
                            <div className={styles.errorMessage}>
                                Помилка відправки. Спробуйте ще раз.
                            </div>
                        )}

                        {submitStatus === "connection_error" && (
                            <div className={styles.errorMessage}>
                                Помилка з'єднання. Перевірте інтернет.
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                <>
                                    <FiSend className={styles.buttonIcon} />
                                    Надіслати запит
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
