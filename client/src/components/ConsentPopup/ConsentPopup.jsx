import { handleConsent, handleDecline } from "./handlers/ConsentPopupHandler";
import styles from "./ConsentPopup.module.css";

export default function ConsentPopup({
    showConsentPopup,
    setConsentGiven,
    setShowConsentPopup,
}) {
    return (
        <>
            {showConsentPopup && (
                <div className={styles.consentPopup}>
                    <div className={styles.consentContent}>
                        <p>
                            Ми збираємо інформацію про тип пристрою, браузер,
                            операційну систему та країну для перевірки
                            унікальності відвідування. Це допомагає нам
                            покращувати сервіс та використовувати дані для
                            майбутнього аналізу популярності сайту та аналітики.
                            Продовжуючи, ви погоджуєтесь на збір цих даних.
                        </p>
                        <button
                            onClick={() =>
                                handleConsent({
                                    setConsentGiven,
                                    setShowConsentPopup,
                                })
                            }
                        >
                            Погоджуюсь
                        </button>
                        <button
                            onClick={() =>
                                handleDecline({ setShowConsentPopup })
                            }
                        >
                            Не погоджуюсь
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}