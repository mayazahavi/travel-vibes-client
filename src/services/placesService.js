import { calculateDistance } from "../utils/distance";
import { API_URL } from "../config/api";
import { getPlaceImage } from "./imageService";

export const processPlacesData = async (features, userLocation, vibeValue) => {
    if (!features || !userLocation) return [];

    const { lat, lon, city } = userLocation;
    const formattedPlaces = [];
    const seenLocations = new Set();

    for (const feature of features) {
        const props = feature.properties;
        const placeName = props.name || props.street;
        if (
            !placeName ||
            placeName.trim() === "" ||
            placeName === "Unknown Place"
        ) {
            continue;
        }

        const locationKey = `${props.lat.toFixed(3)}_${props.lon.toFixed(3)}`;
        if (seenLocations.has(locationKey)) continue;
        seenLocations.add(locationKey);

        const distance = calculateDistance(lat, lon, props.lat, props.lon);

        const cuisine = props.cuisine
            ? Object.keys(props.cuisine).join(";")
            : "";

        const brand = props.brand || props.datasource?.raw?.brand || "";
        const street = props.street || "";
        const category = props.categories ? props.categories[0] : "place";

        const imageUrl = await getPlaceImage(
            placeName,
            category,
            city,
            vibeValue,
            props.place_id,
            cuisine,
            brand,
            street
        );

        formattedPlaces.push({
            id: props.place_id,
            name: placeName,
            address: props.address_line2 || props.formatted || props.address_line1,
            category: category,
            image: imageUrl,
            phone: props.contact?.phone || props.datasource?.raw?.phone,
            website: props.contact?.website || props.datasource?.raw?.website,
            openingHours: props.opening_hours,
            rating: props.datasource?.raw?.rating,
            description: props.datasource?.raw?.description,
            distance: distance,
            lat: props.lat,
            lon: props.lon,
        });
    }

    return formattedPlaces;
};

export const getPlacesUrl = (vibe, location) => {
    if (!vibe || !location) return null;
    const { lat, lon } = location.value;
    const categories = vibe.categories;
    return `${API_URL}/places/search?categories=${encodeURIComponent(categories)}&lat=${lat}&lon=${lon}&limit=20`;
};

export const extractGeocodeFeatures = (data) => {
    if (!data) return [];
    return data.data?.features || data.features || [];
};

export const getCityOptionsFromFeatures = (features, limit = 8) => {
    if (!Array.isArray(features)) return [];

    const uniqueCities = new Map();

    features.forEach((feature) => {
        const props = feature.properties || {};
        const cityName = props.city || props.name;
        const countryName = props.country;

        if (!cityName || !countryName) return;

        const label = `${cityName}, ${countryName}`;
        const key = label.toLowerCase();

        if (!uniqueCities.has(key)) {
            uniqueCities.set(key, {
                value: {
                    lat: props.lat,
                    lon: props.lon,
                    city: cityName,
                    country: countryName,
                },
                label,
            });
        }
    });

    return Array.from(uniqueCities.values()).slice(0, limit);
};
