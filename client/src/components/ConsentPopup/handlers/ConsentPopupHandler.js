const handleConsent = ({ setConsentGiven, setShowConsentPopup }) => {
    localStorage.setItem("consentGiven", "true");
    setConsentGiven(true);
    setShowConsentPopup(false);
};

const handleDecline = ({ setShowConsentPopup }) => {
    localStorage.setItem("consentGiven", "false");
    setShowConsentPopup(false);
};

export { handleConsent, handleDecline };
