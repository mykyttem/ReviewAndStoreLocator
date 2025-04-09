export async function getCsrfToken() {
    try {
        const response = await fetch("http://localhost:8000/csrf-token");

        if (!response.ok) {
            throw new Error("Failed to fetch CSRF token");
        }

        const data = await response.json();
        return data.csrf_token;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        throw error;
    }
}
