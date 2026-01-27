import { API_URL } from "../config/api";
import { fetchJson } from "./http";

const usedImages = new Set();
let placeCounter = 0;

export const clearUsedImages = () => {
  usedImages.clear();
  placeCounter = 0;
};

export const fetchWikipediaImage = async (placeName, city) => {
  try {
    const searchQuery = `${placeName} ${city}`;
    const data = await fetchJson(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(searchQuery)}&prop=pageimages&pithumbsize=800`,
      {},
      8000,
    );
    const pages = data.query?.pages;
    if (pages) {
      const page = Object.values(pages)[0];
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const fetchUnsplashImage = async (query, page = 1) => {
  try {
    const data = await fetchJson(
      `${API_URL}/places/image?query=${encodeURIComponent(query)}&page=${page}`,
    );
    if (data.success && data.data.imageUrl) {
      return data.data.imageUrl;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getPlaceImage = async (
  placeName,
  category,
  city,
  vibe,
  placeId,
  cuisine,
  brand,
  street,
) => {
  placeCounter++;

  const wikiImage = await fetchWikipediaImage(placeName, city);
  if (wikiImage) {
    return wikiImage;
  }

  let categoryKeywords = "";
  if (category && category.includes(".")) {
    const parts = category.split(".");
    const relevantParts = parts.slice(1).filter((p) => p && p.length > 0);

    if (relevantParts.length > 0) {
      categoryKeywords = relevantParts.reverse().join(" ").replace(/_/g, " ");
    } else {
      categoryKeywords = parts[0];
    }
  } else {
    categoryKeywords = category || "place";
  }

  const varietyWords = [
    "beautiful",
    "amazing",
    "great",
    "best",
    "stunning",
    "popular",
    "top",
    "favorite",
    "lovely",
    "perfect",
  ];
  const varietyWord = varietyWords[placeCounter % varietyWords.length];

  const placeHash = Math.abs(
    placeId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
  );
  const pageNum = ((placeHash + placeCounter) % 15) + 1;

  let query = `${varietyWord} ${categoryKeywords} ${vibe} ${city}`;
  let image = await fetchUnsplashImage(query, pageNum);
  if (image) {
    return image;
  }

  const vibeFallbacks = {
    foodie: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80`,
    culture: `https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80`,
    nature: `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80`,
    romantic: `https://images.unsplash.com/photo-1515516969-d465f0f4d1c5?auto=format&fit=crop&w=800&q=80`,
    urban: `https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80`,
    nightlife: `https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80`,
  };

  return (
    vibeFallbacks[vibe] ||
    `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80`
  );
};
