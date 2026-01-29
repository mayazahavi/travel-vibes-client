# 🌍 Travel Vibes – Full Stack Final Project

**Travel Vibes** is a full-stack web application designed for planning and managing personalized trips based on user preferences ("vibes").  
Users select a travel vibe, search for destinations and places that match it, and create a personalized trip card containing curated favorite locations for a chosen destination.  
Each trip card can be edited or deleted as needed and serves as the foundation for building a structured travel itinerary.  
Based on the selected trip, users create their own daily travel journal, organizing activities by specific dates and times to plan each day of the trip in a clear and structured manner.

This project serves as the final submission for the React course and demonstrates a strong understanding of component architecture, state management, integration with external APIs, and secure backend development.


## ✨ Features

- **User Authentication:** Secure registration and login using JWT with password hashing
- **Personalized Trip Planning:** Create trips based on travel vibes (Relaxing, Adventure, Cultural, etc.)
- **Smart Destination Search:** Find places and activities using the Geoapify API
- **Full Trip Management (CRUD):** Create, read, update, and delete trips
- **Favorites System:** Save and organize favorite places within trips
- **Interactive Itinerary & Travel Journal:** Build a structured itinerary by assigning activities to specific dates and times
- **Authorization:** Owner-only access control for all trip-related resources
- **Server-side Validation:** Shared validation rules between client and server
- **Error Handling:** Comprehensive handling of loading, error, and empty states with clear user feedback
- **Dark Mode Support:** User interface theme preferences are preserved across sessions
- **Server-side Persistence:** All data is securely stored in a MongoDB database


## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React.js
- **State Management:** Redux Toolkit with async thunks
- **Routing:** React Router v6 (Protected Routes)
- **Styling:** CSS Modules + Bulma CSS Framework
- **UI Components:** React Icons (FontAwesome)

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (MongoDB Atlas)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Server-side validation with shared rules between client and server
- **Authorization:** Owner-based access control for protected resources
- **Architecture:** MVC pattern (Models, Controllers, Routes)

### External APIs
- **Geoapify API:** Maps and places search (accessed via server-side proxy)
- **Unsplash API:** Image retrieval (accessed via server-side proxy)


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works) or a local MongoDB instance

### MongoDB Atlas Setup Notes (Required)
To connect successfully:
- Create a MongoDB Atlas database and obtain the connection string (URI).
- Create a DB user with password and permissions to the database.
- In **Network Access**, allow your IP (or use `0.0.0.0/0` for development/testing).
- Paste the URI into `MONGODB_URI` in the server `.env`.


## 📦 Installation & Setup

This project consists of two separate GitHub repositories:
- travel-vibes-client – React frontend
- travel-vibes-server – Node.js + Express backend

Both repositories must be cloned and configured in order to run the full application locally.

--------------------------------------------------

1. Clone the Repositories

Clone the client repository:
git clone https://github.com/mayazahavi/travel-vibes-client.git

Clone the server repository:
git clone https://github.com/mayazahavi/travel-vibes-server.git

--------------------------------------------------

2. Backend Setup (Server)

Navigate to the server directory:
cd travel-vibes-server

Install dependencies:
npm install

Create a .env file in the root directory of the server project.
Copy the contents from .env.example and fill in your values.

Example .env file:

PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# External API Keys (server-only)
GEOAPIFY_API_KEY=your_geoapify_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

Note: These external API keys must be defined in the **server** `.env` file (they are never stored on the client).


Run the server:

Development mode (with nodemon):
npm run dev

Production mode:
npm start

The server will run on:
http://localhost:5000

--------------------------------------------------

3. Frontend Setup (Client)

Navigate to the client directory:
cd travel-vibes-client

Install dependencies:
npm install

Create a .env file in the root directory of the client project.
Copy the contents from .env.example.

The .env.example file includes both local and production backend URLs.
By default, it is configured for local development.

Example .env file:

REACT_APP_API_URL=http://localhost:5000/api

Production (Render):
REACT_APP_API_URL=https://travel-vibes-server.onrender.com/api

Important notes:
- External API keys (Geoapify, Unsplash) are configured only on the server
- The client communicates with the backend via the /api prefix

Run the client:
npm start

The client will run on:
http://localhost:3000

--------------------------------------------------

4. Running the Full Application

1. Start the backend server first
2. Start the React client
3. Open the browser at http://localhost:3000

The React client communicates with the backend API at:
http://localhost:5000/api


## 🏗️ Architecture & Code Quality

This project follows full-stack best practices (React + Node.js API) with clear separation of concerns across the client and server.

### **Custom Hooks (Client)**
- `useForm` - Form state & validation
- `useApi` - Data fetching with loading/error/data
- `useLocalStorage` - Persistent state management (token, UI preferences)

### **Service Layer (Client)**
- `authService.js` - Authentication API calls
- `tripsService.js` - Trip CRUD operations
- `placesService.js` - Places search and processing

### **Shared Validation (Client + Server)**
- `validation.js` - Shared validation rules used on both the frontend and backend (never trust client input)

### **Component Design (Client)**
- Small, focused components (e.g., `PlaceCard`, `EditTripModal`)
- Clear separation: Pages + Reusable Components
- Clean props (no excessive prop drilling)

### **State Management (Client)**
- Redux Toolkit with async thunks
- Server API as the source of truth
- localStorage as backup/cache for session continuity

### **Server Architecture (Backend)**
- MVC structure: **Routes → Controllers → Models**
- Centralized middleware for authentication, validation, and error handling
- Authorization rules enforced on the server (owner-only access)

---

## 🔐 Authentication & Data Flow

- **Registration/Login:** JWT token stored in localStorage, used for authenticated requests
- **Authorization:** Server enforces owner-only access (only the trip owner can edit/delete trips and favorites)
- **Trip Creation:** POST to server → validated + authorized → saved in MongoDB
- **Favorites & Itinerary:** Favorites are stored per trip and can be scheduled by date/time
- **Refresh:** Token persists, trips are re-fetched from the server to restore state
- **Error Handling:** Clear server error responses + user-friendly UI states (loading/error/empty)


## 🛑 Validation & Error Handling

### **Frontend Validation**
- Real-time validation (email format, password length, required fields)
- Clear error messages

### **Backend Validation (BONUS)**
- Server-side validation using shared rules
- Authorization checks (only trip owners can edit/delete)
- Centralized validation and error-handling middleware (consistent API responses)
- Comprehensive error responses (clear status codes/messages)

### **Error States**
- Loading states during API calls
- Error messages with retry options
- Empty states for lists
- Server-side logging in development for easier debugging and tracing


## 📚 API Endpoints

### Health
- `GET /api/health` – Server health check (status endpoint)

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current authenticated user (protected)

### Trips
- `GET /api/trips` – Get all user trips (protected)
- `POST /api/trips` – Create a new trip (protected)
- `GET /api/trips/:id` – Get trip by ID (owner only)
- `PUT /api/trips/:id` – Update trip (owner only)
- `DELETE /api/trips/:id` – Delete trip (owner only)

### Places
- `GET /api/places/search` – Search places by query
- `GET /api/places/image` – Get image for a place
- `GET /api/places/geocode` – Get coordinates for a place


### Favorites
- `POST /api/trips/:id/favorites` – Add favorite place to a trip (owner only)
- `DELETE /api/trips/:id/favorites/:favoriteId` – Remove favorite place (owner only)
- `PATCH /api/trips/:id/favorites/:favoriteId` – Update favorite / itinerary details (owner only)

---


## 🚢 Deployment

### Backend (Render)
1. Push the backend code to GitHub
2. Create a new Web Service on Render and connect the backend repository
3. Set the required environment variables in the Render dashboard (based on `.env.example`)
4. Configure the Render service:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Deploy the service

The backend will be available at:
https://travel-vibes-server.onrender.com

--------------------------------------------------

### Frontend (Render / Vercel / Netlify)
1. Build the React application:
   npm run build
2. Deploy the generated build folder to the hosting platform
3. Set the production API URL in the client environment variables:
   REACT_APP_API_URL=https://travel-vibes-server.onrender.com/api

--------------------------------------------------

After deployment, the React client communicates with the backend API via:
https://travel-vibes-server.onrender.com/api

## 🔎 Server Details & Notes

- **Health Check Endpoint:**  
  `GET /api/health` – Used to verify that the backend server is running correctly.

- **CORS Configuration:**  
  The server is configured to allow requests **only** from the client URL defined in `CLIENT_URL` (via environment variables).

- **JWT Expiration:**  
  Authentication tokens are issued with an expiration time (30 days) for security reasons.

- **Database Optimization:**  
  MongoDB indexes are used on key fields to ensure efficient queries and performance.

- **External APIs Security:**  
  All external API keys (Geoapify, Unsplash) are stored and used **only on the server side** and are never exposed to the client.


## 🧪 Testing

### Manual Testing Checklist (End-to-End – Client & Server)

#### User Flow & UI Testing
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] Create a new trip
- [ ] Search for places (Explore page)
- [ ] Add places to favorites
- [ ] Edit trip details
- [ ] Delete trip
- [ ] Build and update itinerary (dates & times)
- [ ] Refresh page (authentication and data persist)
- [ ] Test empty states (no trips / no favorites)
- [ ] Test loading states during API requests
- [ ] Test error states when server is unavailable

#### Backend & API Testing
- [ ] Test API endpoints using Postman / Thunder Client
- [ ] Test registration and login endpoints (`/api/auth`)
- [ ] Test protected routes with valid JWT token
- [ ] Test protected routes without JWT token (unauthorized access)
- [ ] Test authorization rules (non-owner cannot edit/delete trips)
- [ ] Test validation errors (missing fields, invalid data)
- [ ] Verify data is correctly persisted in MongoDB

All critical user flows, API endpoints, validation rules, and error scenarios were tested manually to ensure system stability, correct authorization, and a smooth user experience.

## 📋 Project Structure

```
travel-vibes-client/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API service layer
│   ├── store/              # Redux slices
│   ├── utils/              # Validation, helpers
│   └── styles/             # CSS modules
└── public/

travel-vibes-server/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema & methods
│   │   └── Trip.js            # Trip schema with favorites
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── tripController.js  # Trip & favorites logic
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── trips.js           # Trip routes
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── errorHandler.js    # Error handling
│   │   └── validate.js        # Validation middleware
│   ├── utils/
│   │   ├── validation.js      # Shared validation rules
│   │   └── responseHelper.js  # API response helpers
│   └── server.js              # Main entry point
├── .env                        # Environment variables (not in git)
├── .env.example                # Example env file
├── .gitignore
├── package.json
└── README.md
```


---
