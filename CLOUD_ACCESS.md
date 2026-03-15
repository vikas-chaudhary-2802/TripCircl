# TripCircl — Lovable Cloud Access Guide

## 🌍 Overview

TripCircl runs on **Lovable Cloud**, which provides a fully managed backend including:
- **Database** (PostgreSQL via Supabase)
- **Authentication** (Email + Google OAuth)
- **Edge Functions** (Serverless backend logic)
- **File Storage** (Avatars, trip images)
- **Secrets Management** (API keys, environment variables)

---

## 🔑 How to Access Your Backend

### From Lovable Editor:
1. Open your project in Lovable
2. Click the **Cloud** tab in the left sidebar (or top navigation)
3. You'll see sections for:
   - **Database** → View tables, rows, schema
   - **Users** → See registered users, manage auth settings
   - **Storage** → Manage uploaded files (avatars, trip images)
   - **Edge Functions** → View deployed serverless functions
   - **Secrets** → Manage API keys and environment variables

### Direct Access:
- **Supabase Dashboard**: Your project is hosted on Supabase under the hood
- **Project ID**: `nyjuyylxkwtohamgojwh`
- **API URL**: `https://nyjuyylxkwtohamgojwh.supabase.co`
- **Anon Key**: Available in your `.env` file as `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (name, avatar, bio, travel style) |
| `trips` | Group trip listings |
| `trip_members` | Users who joined a trip |
| `itinerary_items` | Day-by-day itinerary for trips |
| `expenses` | Shared expenses within a trip |
| `conversations` | Chat conversations (direct + group) |
| `messages` | Chat messages |
| `conversation_participants` | Who's in each conversation |
| `ratings` | User reviews after trips |
| `waitlist_emails` | Emails collected from "Notify Me" on coming soon pages |

---

## 🔐 Authentication

- **Email/Password**: Standard signup with email verification
- **Google OAuth**: Managed by Lovable Cloud (no extra setup needed)
- **Profile auto-creation**: A database trigger creates a profile row when a new user signs up

---

## ⚡ Edge Functions (Serverless)

| Function | Purpose |
|----------|---------|
| `generate-itinerary` | AI-powered itinerary generation using Lovable AI |
| `send-waitlist-email` | Saves waitlist signups and sends confirmation |

Edge functions are deployed automatically when you push changes.

---

## 📁 File Storage Buckets

| Bucket | Purpose | Public? |
|--------|---------|---------|
| `avatars` | User profile pictures | ✅ Yes |
| `trip-images` | Trip cover images | ✅ Yes |

---

## 🔒 Security

- **Row Level Security (RLS)** is enabled on all tables
- Users can only modify their own data
- Trip organizers can manage their trip members
- Conversation access is restricted to participants
- Waitlist is insert-only (no one can read others' emails)

---

## 🛠 Environment Variables

These are automatically set in your `.env`:
```
VITE_SUPABASE_PROJECT_ID=nyjuyylxkwtohamgojwh
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
VITE_SUPABASE_URL=https://nyjuyylxkwtohamgojwh.supabase.co
```

Edge function secrets (managed in Cloud → Secrets):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY` (for AI features)

---

## 💡 Tips

- View your database directly from the Lovable editor → Cloud tab → Database
- To export data, use the Cloud tab → Database → Tables → Export button
- Edge functions deploy automatically — no manual deployment needed
- To add new secrets, use the Cloud tab → Secrets section
