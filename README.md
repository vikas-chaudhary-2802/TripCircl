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

### 📁 Project Structure

```
TripCircl/
├── frontend/               # React + Vite + TypeScript + Supabase Auth
│   └── src/
│       ├── pages/          # Route-level page components
│       ├── components/     # Shared UI components + shadcn/ui
│       ├── contexts/       # AuthContext.tsx (Supabase session state)
│       ├── services/
│       │   ├── api.ts      # Axios instance (auto JWT refresh interceptor)
│       │   └── authService.ts  # Typed calls to custom backend /api/auth/*
│       ├── hooks/
│       │   └── useApi.ts   # Generic loading/error/data state hook
│       └── integrations/supabase/  # Auto-generated Supabase client + types
│
└── backend/                # Node.js + Express 5 + MongoDB (production-grade)
    └── src/
        ├── index.js        # Server entrypoint — graceful shutdown
        ├── app.js          # Express factory + full middleware chain
        ├── config/
        │   ├── env.js      # Env var validation & typed exports
        │   ├── db.js       # Mongoose connection with reconnect logic
        │   ├── logger.js   # Winston — colorized dev, JSON prod
        │   └── cors.js     # Environment-aware CORS allowlist
        ├── models/
        │   ├── User.js     # User schema: roles, indexes, password hashing
        │   └── Token.js    # Refresh token store: TTL, revocation, device info
        ├── repositories/
        │   ├── userRepository.js   # All User DB queries (no business logic)
        │   └── tokenRepository.js  # All Token DB queries
        ├── services/
        │   └── authService.js  # Auth business logic: login, refresh, logout
        ├── controllers/
        │   └── authController.js   # HTTP handlers — calls service, returns res
        ├── middlewares/
        │   ├── authenticate.js # JWT access token verification
        │   ├── authorize.js    # RBAC — authorize('admin', 'moderator')
        │   ├── errorHandler.js # Centralized error handler (MUST be last)
        │   ├── rateLimiter.js  # General + strict auth rate limits
        │   └── sanitize.js     # NoSQL injection + XSS prevention
        ├── validators/
        │   └── authValidator.js    # Joi schemas for all auth endpoints
        ├── routes/
        │   ├── index.js        # Route registry — mount all feature routers here
        │   └── authRoutes.js   # /api/auth/* endpoints
        └── utils/
            ├── apiResponse.js  # res.success() / res.paginated() / res.error()
            ├── asyncHandler.js # try/catch wrapper for async route handlers
            └── AppError.js     # Operational error class with status codes
```

---

## 👥 Collaborator Guide — Read Before Writing Any Code

> **Architecture rule of thumb:** Each layer only talks to the layer directly below it.
> Controller → Service → Repository → Model. Never skip layers.

---

### 🔐 Auth & RBAC

**How authentication works:**
1. User calls `POST /api/auth/login` → gets `accessToken` (15 min) + `refreshToken` (7 days)
2. Frontend attaches `accessToken` to every request as `Authorization: Bearer <token>`
3. When access token expires, `api.ts` interceptor **automatically** calls `POST /api/auth/refresh` and retries the original request — no logout flash
4. Refresh tokens are stored **hashed** in MongoDB (`Token` collection) — can be revoked per-device or globally

**Protected routes:** Wrap with `authenticate` middleware. Role-guard with `authorize`:
```js
// In any route file:
const authenticate = require('../middlewares/authenticate');
const authorize    = require('../middlewares/authorize');

router.get('/admin-data', authenticate, authorize('admin'), controller.getData);
router.get('/mod-data',   authenticate, authorize('admin', 'moderator'), controller.getData);
```

---

### 🗄️ Adding a New Feature (e.g. Trips)

Follow this exact pattern:

1. **Model** → `src/models/Trip.js` — Mongoose schema with indexes
2. **Repository** → `src/repositories/tripRepository.js` — only DB queries, no logic
3. **Service** → `src/services/tripService.js` — business rules, calls repository
4. **Controller** → `src/controllers/tripController.js` — calls service, uses `res.success()`
5. **Validator** → `src/validators/tripValidator.js` — Joi schema
6. **Routes** → `src/routes/tripRoutes.js` — mount in `src/routes/index.js`

---

### 📡 API Response Contract

Every endpoint returns this shape — **never deviate from it:**

```json
{
  "success": true,
  "message": "Human-readable status",
  "data": { }
}
```

Errors follow the same envelope:
```json
{
  "success": false,
  "message": "What went wrong",
  "error": "Details or validation array"
}
```

Use the helper methods already attached to `res`:
```js
res.success(data, 'Created', 201);   // 2xx
res.paginated(items, { page, limit, total, totalPages });
// Errors are thrown and caught by the central error handler:
throw new AppError('Not found', 404);
```

---

### ⚡ Frontend — Calling the Backend

**Never call `fetch` or `axios` directly in a component.** Always go through the service layer:

```ts
// In a component or hook:
import authService from '@/services/authService';
import { useApi } from '@/hooks/useApi';

const { data, loading, error, execute } = useApi(authService.getSessions);

useEffect(() => { execute(); }, [execute]);
```

For new features, add a new service file (e.g. `src/services/tripService.ts`) that calls `api.ts` (the Axios instance with auto-refresh).

---

## 🛠 Setup Instructions

### 1. Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Then fill in MONGO_URI and JWT_SECRET

# Frontend
cp frontend/.env.example frontend/.env
# Then fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
# (from Supabase Dashboard → Project Settings → API)
```

### 2. Running Locally

```bash
# Backend (from /backend)
npm run dev         # nodemon with hot reload

# Frontend (from /frontend)
npm run dev         # Vite dev server at localhost:5173
```

### 3. Available API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login → get tokens |
| POST | `/api/auth/refresh` | ❌ | Rotate refresh token |
| POST | `/api/auth/logout` | ❌ | Revoke current device |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/logout-all` | ✅ | Revoke all devices |
| GET | `/api/auth/sessions` | ✅ | List active sessions |
| GET | `/api/health` | ❌ | Server health check |

Start your journey with trip.cicl — where travel planning meets intelligent design.

