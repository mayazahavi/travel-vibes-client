# 🌍 Travel Vibes

Travel Vibes is a modern, responsive web application that helps users plan personalized trips based on their travel preferences ("vibe"). Users can create itineraries, search for destinations, and manage their trips in a beautiful dashboard.

## ✨ Features

- **Personalized Trip Planning:** Create trips based on vibes (Relaxing, Adventure, Cultural, etc.).
- **Smart Destination Search:** Powered by **Geoapify API** to find places and activities.
- **Trip Management (CRUD):** Create, Read, Update, and Delete trips.
- **User Authentication:** Secure Login and Registration (Mock implemented, ready for server).
- **Interactive Itinerary:** Drag-and-drop or assign activities to specific days.
- **Favorites System:** Save places to your specific trip.

## 🛠️ Tech Stack

- **Frontend:** React.js
- **State Management:** Redux Toolkit (Slices for Auth & Trips)
- **Routing:** React Router v6 (Protected Routes implemented)
- **Styling:** CSS Modules + Bulma CSS Framework
- **Icons:** React Icons (FontAwesome)
- **API Integration:** Geoapify (Maps/Places), Unsplash (Images)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/travel-vibes-client.git
   cd travel-vibes-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Create a file named `.env` in the root directory.
   - Copy the contents from `.env.example`.
   - Add your API keys (Geoapify is required for the Explore feature).

   ```env
   REACT_APP_GEOAPIFY_API_KEY=your_key_here
   ```

4. **Run the application:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏗️ Architecture & Code Quality

This project follows React best practices:
- **Custom Hooks:** `useForm` (Validation), `useApi` (Data Fetching), `useLocalStorage` (Persistence).
- **Service Layer:** `authService.js` and `placesService.js` isolate API logic from UI components.
- **Shared Validation:** Validation logic (`src/utils/validation.js`) is separated to allow future sharing with a Node.js backend.
- **Component Design:** Small, focused components (e.g., `PlaceCard`, `EditTripModal`).

## 🔐 Authentication & Server

Currently, the application runs in **Client-Only Mode** using a robust Service Layer abstraction.
- **Auth:** Simulates a real server with JWT behavior. State is persisted in `localStorage`.
- **Database:** Trips are currently saved to `localStorage` to persist across refreshes.
- **Ready for Backend:** To connect a real Node.js/MongoDB backend, simply update the functions in `src/services/authService.js` to use `fetch()` instead of the mock implementation.

## 🛑 Validation

- **Frontend:** Real-time validation for forms (Email format, password length, required fields).
- **Error Handling:** Graceful handling of API errors and empty states.

---
Built with ❤️ by Maya for the React Final Project.