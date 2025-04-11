import { getCsrfToken } from "./fetchCsrfToken";

export default async function fetchTrackVisit() {
    try {
        const csrfToken = await getCsrfToken();

        const response = await fetch("/api/track-visit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Visit tracked:", data);
        return data;
    } catch (error) {
        console.error("Error tracking visit:", error);
        throw error;
    }
}
