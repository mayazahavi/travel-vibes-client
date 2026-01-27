# 🌍 Travel Vibes - Full Stack Application

Travel Vibes is a modern, full-stack web application that helps users plan personalized trips based on their travel preferences ("vibe"). Users can create itineraries, search for destinations, manage trips, and save favorite places in a beautiful, responsive interface.

## ✨ Features

- **Personalized Trip Planning:** Create trips based on vibes (Relaxing, Adventure, Cultural, etc.)
- **Smart Destination Search:** Powered by **Geoapify API** to find places and activities
- **Full Trip Management (CRUD):** Create, Read, Update, and Delete trips
- **User Authentication:** Secure Login and Registration with JWT
- **Interactive Itinerary:** Drag-and-drop or assign activities to specific days
- **Favorites System:** Save places to your trips and organize them
- **Server-side Persistence:** All data saved to MongoDB database

## 🛠️ Tech Stack

### **Frontend**
- React.js
- Redux Toolkit (State Management with async thunks)
- React Router v6 (Protected Routes)
- CSS Modules + Bulma CSS Framework
- React Icons (FontAwesome)

### **Backend**
- Node.js + Express.js
- MongoDB (MongoDB Atlas)
- JWT Authentication
- bcryptjs (Password hashing)
- Server-side validation

### **APIs**
- Geoapify (Maps & Places) via server proxy
- Unsplash (Images) via server proxy

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)

---

## 📦 Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/travel-vibes.git
cd travel-vibes
```

You'll have two folders:
- `travel-vibes-client` - React frontend
- `travel-vibes-server` - Node.js backend

---

### **2. Backend Setup (Server)**

```bash
cd travel-vibes-server

# Install dependencies
npm install

# Create .env file
# Copy .env.example to .env and fill in your values:
```

**`.env` example:**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Start the server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

### **3. Frontend Setup (Client)**

```bash
cd travel-vibes-client

# Install dependencies
npm install

# Create .env file
# Copy .env.example to .env and set your API URL:
```

**`.env` example:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**API Keys:**
- Geoapify and Unsplash keys are configured on the **server** (not in the client).

**Start the client:**
```bash
npm start
```

Client will run on `http://localhost:3000`

---

## 🏗️ Architecture & Code Quality

This project follows React best practices:

### **Custom Hooks**
- `useForm` - Form state & validation
- `useApi` - Data fetching with loading/error/data
- `useLocalStorage` - Persistent state management

### **Service Layer**
- `authService.js` - Authentication API calls
- `tripsService.js` - Trip CRUD operations
- `placesService.js` - Place data processing

### **Shared Validation**
- `src/utils/validation.js` - Validation logic shared between client and server

### **Component Design**
- Small, focused components (e.g., `PlaceCard`, `EditTripModal`)
- Clear separation: Pages + Reusable Components
- Clean props (no excessive prop drilling)

### **State Management**
- Redux Toolkit with async thunks
- Server API as source of truth
- localStorage as backup/cache

---

## 🔐 Authentication & Data Flow

- **Registration/Login:** JWT token stored in localStorage
- **Trip Creation:** POST to server → saved in MongoDB
- **Favorites:** Associated with specific trips in database
- **Refresh:** Token persists, trips fetched from server

---

## 🛑 Validation & Error Handling

### **Frontend Validation**
- Real-time validation (email format, password length, required fields)
- Clear error messages

### **Backend Validation (BONUS)**
- Server-side validation using shared rules
- Authorization checks (only trip owners can edit/delete)
- Comprehensive error responses

### **Error States**
- Loading states during API calls
- Error messages with retry options
- Empty states for lists

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Trips
- `GET /api/trips` - Get all user trips (protected)
- `POST /api/trips` - Create trip (protected)
- `GET /api/trips/:id` - Get trip by ID (owner only)
- `PUT /api/trips/:id` - Update trip (owner only)
- `DELETE /api/trips/:id` - Delete trip (owner only)

### Favorites
- `POST /api/trips/:id/favorites` - Add favorite (owner only)
- `DELETE /api/trips/:id/favorites/:favoriteId` - Remove favorite (owner only)
- `PATCH /api/trips/:id/favorites/:favoriteId` - Update favorite/itinerary (owner only)

---

## 🚢 Deployment

### **Backend (Render)**
1. Push code to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy!

### **Frontend (Render / Vercel / Netlify)**
1. Build: `npm run build`
2. Deploy build folder
3. Update `REACT_APP_API_URL` to production server URL

---

## 🧪 Testing

### Manual Testing Checklist:
- [ ] Register new user
- [ ] Login with credentials
- [ ] Create a new trip
- [ ] Search for places (Explore page)
- [ ] Add places to favorites
- [ ] Edit trip details
- [ ] Delete trip
- [ ] Schedule itinerary
- [ ] Refresh page (persist auth & data)
- [ ] Test with server offline (error handling)

---

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
│   ├── config/             # DB connection
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # Business logic
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, validation, errors
│   └── utils/              # Shared validation
└── package.json
```

---

## ✅ Bonus Features Implemented

✨ **Server-side validation** with shared rules  
✨ **Authorization** - only trip owners can edit/delete  
✨ **MVC architecture** - clean separation of concerns  
✨ **Error handling** - comprehensive error states  
✨ **Custom hooks** - useForm, useApi, useLocalStorage  
✨ **Protected routes** - authentication required  

---

**Built with ❤️ by Maya for the React Final Project**