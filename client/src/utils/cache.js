export const getCachedShops = () => {
    const cached = localStorage.getItem("cachedShops");
    if (!cached) return null;

    try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) return parsed;
    } catch {}
    return null;
};

export const saveShopsToCache = (shops, location) => {
    const data = { shops, location, timestamp: Date.now() };
    localStorage.setItem("cachedShops", JSON.stringify(data));
};
