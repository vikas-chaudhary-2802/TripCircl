# 🌍 trip.cicl

### Your Personal Travel Copilot

trip.cicl is an intelligent travel planning platform designed to turn overwhelming trip planning into a seamless, personalized experience.

Instead of browsing endlessly or juggling multiple apps, trip.cicl understands how you want to travel — and builds a journey tailored just for you.

---

## ✨ What Makes trip.cicl Different

Most travel platforms give you options.
trip.cicl gives you **clarity**.

It doesn’t just suggest places — it designs your entire experience based on:

* Your travel pace
* Your preferences
* Your style of exploration

Whether you want a relaxed getaway or a fast-paced adventure, trip.cicl adapts to you.

---

## 🧠 Built Around You

Every journey starts with you.

trip.cicl personalizes your trip by understanding:

* How many places you want to explore in a day
* Whether you prefer famous landmarks or hidden gems
* How you like to experience a destination

The result is a plan that feels natural, realistic, and enjoyable.

---

## 📅 Smarter Itineraries

Your trip is not just a list — it’s a story.

trip.cicl creates structured, day-wise plans that:

* Avoid overwhelming schedules
* Group places intelligently
* Make every day feel balanced and meaningful

So you spend less time planning, and more time experiencing.

---

## 🎯 Designed for Real Travel

Trips are dynamic — and so is trip.cicl.

It gives you flexibility to:

* Adjust your plans easily
* Explore alternatives
* Stay in control without stress

Because no two journeys are the same.

---

## 💡 The Experience

Using trip.cicl should feel like:

* Talking to a smart travel companion
* Being guided, not instructed
* Feeling confident about every decision

---

## 🚀 Our Vision

To build a world where planning a trip feels as exciting as taking one.

trip.cicl is not just a planner —
it’s your **travel thinking partner**.

---

## 🌐 Get Started

### Project Structure

This repository is divided into two main parts:
- **`frontend/`**: The React/Vite application.
- **`backend/`**: Node.js/Express server (migrating from Supabase to MongoDB).

### 🛠 Collaborator Migration Guide (MongoDB & Auth)

We are shifting from Supabase to a custom Node.js/MongoDB backend with RBAC (Role-Based Access Control). Here is how you should proceed:

#### 1. Backend Development (`/backend`)
- **Database**: Use `src/config/db.js` to configure your MongoDB connection.
- **Models**: Define your Mongoose schemas in `src/models/`. A `User` model with roles (`user`, `admin`, `moderator`) is already scaffolded.
- **Auth & RBAC**: Implementation logic for login/signup should go in `src/controllers/authController.js`. Use the `protect` and `authorize` middlewares in `src/middlewares/authMiddleware.js` to secure your routes.
- **Routes**: Define your API endpoints in `src/routes/`.

#### 2. Frontend Development (`/frontend`)
- **API Calls**: Do NOT use Supabase client directly for new features. Use the abstracted `src/services/api.ts` which uses Axios and automatically attaches JWT tokens.
- **Global Auth State**: Use the `AuthProvider` in `src/context/AuthContext.tsx` to access user info and roles throughout the app.

---

### Setup Instructions

1. **Environment Variables**:
   Navigate to both `frontend/` and `backend/` directories and copy the `.env.example` files to `.env`.
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Start your journey with trip.cicl and experience travel planning, reimagined.
