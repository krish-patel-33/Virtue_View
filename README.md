# VirtueView

A full-stack real estate platform focused on **3D property visualization** and **online booking workflows**. VirtueView helps buyers explore under-construction properties with better clarity before purchase.

## Overview

VirtueView combines a modern React client, Node.js/Express API, and Prisma-backed MongoDB data layer to deliver:
- property discovery and listing management
- secure authentication and session handling
- booking and user interaction workflows
- optional real-time communication support via Socket.IO

## Key Features

- 3D property preview integration (Unity/Blender assets)
- role-based user flows (buyer/seller/admin-oriented surfaces)
- JWT-based authentication
- property management and booking-related modules
- responsive frontend UI with Tailwind + SCSS

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Sass |
| Backend | Node.js, Express |
| Database | MongoDB with Prisma ORM |
| Auth | JWT, HTTP-only cookies |
| Realtime (optional) | Socket.IO |

## Repository Structure

```text
VirtueView_r/
├── client/        # React + Vite frontend
├── api/           # Express API + Prisma
├── socket/        # Socket.IO server (optional)
├── docs/          # Project docs
├── scripts/       # Utility scripts
├── start-all.bat  # Windows start helper
└── start_project.sh # Linux/macOS start helper
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance

### 1) Install dependencies

```bash
cd client && npm install
cd ../api && npm install
cd ../socket && npm install
```

### 2) Configure environment

Create your `.env` files (at minimum in `api/`) with required values such as:

```env
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

### 3) Run database sync

```bash
cd api
npx prisma db push
```

### 4) Start the application

**Windows**
```bat
start-all.bat
```

**Linux/macOS**
```bash
./start_project.sh
```

Or run manually:

```bash
# terminal 1
cd api && npm start

# terminal 2
cd client && npm run dev

# terminal 3 (optional)
cd socket && npm start
```

## Available Scripts

### API (`api/`)
- `npm start` - run API
- `npm run dev` - run API with nodemon
- `npm run db:push` - sync Prisma schema
- `npm run db:studio` - open Prisma Studio

### Client (`client/`)
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - run ESLint

### Socket (`socket/`)
- `npm start` - run Socket.IO server

## Screenshots

> Save your images in `docs/screenshots/` (recommended), then replace the paths below.

<!-- SCREENSHOT: Home page -->
![Home Page](docs/screenshots/home-page.png)

<!-- SCREENSHOT: Property details / 3D view -->
![Property 3D View](docs/screenshots/property-3d-view.png)

<!-- SCREENSHOT: Booking flow/dashboard -->
![Booking Dashboard](docs/screenshots/booking-dashboard.png)

<!-- SCREENSHOT: Admin panel -->
![Admin Panel](docs/screenshots/admin-panel.png)

## Security Notes

- Do not commit real secrets in `.env` files.
- Use strong `JWT_SECRET_KEY` values.
- Use production HTTPS URLs for `CLIENT_URL`.

## License

This project is licensed under the ISC License unless updated otherwise in the repository.
