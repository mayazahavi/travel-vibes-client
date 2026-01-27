export const getFavoriteLocations = (favorites = []) => {
  if (!Array.isArray(favorites) || favorites.length === 0) return [];

  const locations = [
    ...new Set(
      favorites.map((place) => {
        if (place.city && place.country) {
          return `${place.city}, ${place.country}`;
        }

        if (!place.location) return "";

        const parts = place.location.split(",");
        let relevantParts = parts;

        if (parts.length >= 2) {
          relevantParts = parts.slice(-2);
        }

        const cleanLocation = relevantParts
          .map((part) => part.replace(/[0-9]/g, "").trim())
          .filter((part) => part.length > 1)
          .join(", ");

        return cleanLocation;
      }),
    ),
  ].filter(Boolean);

  return locations;
};
