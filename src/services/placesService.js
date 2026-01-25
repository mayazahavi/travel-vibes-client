import { calculateDistance } from "../utils/distance";
import { getPlaceImage } from "./imageService";

/**
 * Service to handle place-related operations.
 * Currently processes raw Geoapify data on the client.
 * In the future, this logic can be moved to the server.
 */

export const processPlacesData = async (features, userLocation, vibeValue) => {
    if (!features || !userLocation) return [];

    const { lat, lon, city } = userLocation;
    const formattedPlaces = [];
    const seenLocations = new Set();

    for (const feature of features) {
        const props = feature.properties;
        const placeName = props.name || props.street;

        // Basic cleaning
        if (
            !placeName ||
            placeName.trim() === "" ||
            placeName === "Unknown Place"
        ) {
            continue;
        }

        // Deduplication by coordinates
        const locationKey = `${props.lat.toFixed(3)}_${props.lon.toFixed(3)}`;
        if (seenLocations.has(locationKey)) continue;
        seenLocations.add(locationKey);

        // Calculate details
        const distance = calculateDistance(lat, lon, props.lat, props.lon);

        const cuisine = props.cuisine
            ? Object.keys(props.cuisine).join(";")
            : "";

        const brand = props.brand || props.datasource?.raw?.brand || "";
        const street = props.street || "";
        const category = props.categories ? props.categories[0] : "place";

        // Fetch image
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

export const getPlacesUrl = (vibe, location, apiKey) => {
    if (!vibe || !location) return null;
    const { lat, lon } = location.value;
    const categories = vibe.categories;
    return `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;
};
