# SyncRoom

**SyncRoom** is a collaborative, real-time music listening web application built using Spotify’s API. Users can join or create virtual “rooms” to listen to the same music together, chat, and manage a shared queue — all synchronized across devices.

This project was developed as part of a university course and demonstrates full-stack integration, real-time communication, and third-party API integration.

---

## Features

- **Real-Time Music Sync**  
  All users in a room hear the same track at the same time via Spotify's Web Playback SDK.

- **Spotify OAuth**  
  Secure authentication and playback through users’ Spotify accounts.

- **Live Chat**  
  Communicate with other users in the room with a built-in chat interface.

- **Collaborative Queue**  
  Add, view, and manage songs in a shared room queue.

- **Room Management**  
  Create a DJ room or join an existing one to sync playback with friends.

---

## Tech Stack

| Category       | Tech Used                                 |
| -------------- | ----------------------------------------- |
| **Frontend**   | Next.js, React, TypeScript                |
| **Styling**    | Tailwind CSS, shadcn/ui                   |
| **Backend**    | Supabase (auth, real-time database)       |
| **Database**   | PostgreSQL (via Supabase)                 |
| **Streaming**  | Spotify Web API, Spotify Web Playback SDK |
| **Deployment** | Vercel                                    |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/x5uw/SyncRoom.git
cd SyncRoom
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Variables

Create a `.env.local` file at the root of your project and fill in the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> Don’t forget to whitelist `http://localhost:3000` and your deployed domain in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) under "Redirect URIs".

---

### 4. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

App will be available at: [http://localhost:3000](http://localhost:3000)

---

## Live Demo

[https://syncroom.vercel.app](https://syncroom.vercel.app)

---
