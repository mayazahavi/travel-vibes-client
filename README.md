# Travel Vibes

## What the site is about

Travel Vibes is a website that helps users plan trips based on their travel preferences. Users can select their travel vibe, search for destinations, and create personalized trips.

## The 3 required pages

1. **Content Page** - VibesPage (src/pages/VibesPage.jsx)
2. **Form Page** - CreateTripPage (src/pages/CreateTripPage.jsx)
3. **API Page** - ExplorePage (src/pages/ExplorePage.jsx)

**Note:** I also created a HomePage (src/pages/HomePage.jsx) as a landing page to improve user experience and navigation, even though it wasn't required by the assignment guidelines.

## Global State (Context)

I created `FavoritesContext` to manage the application's global state using React Context API.

*   **What it stores:**
    *   `trips`: An array containing all the trips the user has created. Each trip object holds the trip details (name, dates, vibe) and its own list of favorite places.
    *   `currentTripId`: Tracks the ID of the trip currently being viewed or edited.
*   **How I use it:**
    *   **CreateTripPage:** Uses the context to create a new trip object and add it to the state.
    *   **ExplorePage:** Uses `addToFavorites` to save places specifically to the currently active trip.
    *   **MyTripsPage:** Consumes the `trips` array to display a dashboard of all planned journeys.
    *   **FavoritesPage:** Retrieves the current trip details to display the itinerary and saved places.
    *   **ItineraryPage:** Uses `assignPlaceToDay` to organize saved places into a daily schedule.

## Routing

I implemented `React Router` to handle navigation across the application:

*   `/` → **Home Page** (Landing page)
*   `/vibes` → **Vibes Page** (Content page - select travel style)
*   `/create-trip` → **Create Trip Page** (Form page - enter trip details)
*   `/explore` → **Explore Page** (API page - search destinations and save favorites)
*   `/my-trips` → **My Trips Page** (Dashboard - view all created trips)
*   `/favorites` → **Favorites Page** (Trip details - view specific trip's saved places)
*   `/itinerary` → **Itinerary Page** (Daily planner - schedule activities per day)
*   `*` → **404 Not Found** (Handles unknown routes)