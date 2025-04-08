export default async function fetchTrackVisit() {
    try {
        const response = await fetch("http://localhost:8000/track-visit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
