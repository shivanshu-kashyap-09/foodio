# Foodio — Frontend (React + Vite)

This folder contains the Foodio frontend application — a Vite + React single-page app that implements the UI for a food ordering site. It is intended to work together with the `foodio_api`.

## Quick start

Prerequisites:

- Node.js (v16+ recommended)
- npm (or yarn)

Install dependencies and run the dev server:

```powershell
cd <path-to-repo>
npm install
npm run dev
```

The app runs on Vite's dev server and uses hash-based routing. The frontend expects a backend API base URL available via the `VITE_URL` environment variable (see Environment below).

Build for production:

```powershell
npm run build
npm run preview
```

## Environment

Create a `.env` file at the project root (next to `package.json`) to configure the API base URL used by the frontend. Example:

```
VITE_URL=http://localhost:5173
```

## Features

- Home page with hero banners and curated restaurant/dish previews
- Sections for Veg, Non-Veg, South Indian and Thali dishes
- Restaurant listing and per-restaurant pages
- Dish detail pages
- Cart, Wishlist and basic order/UI flows backed by `foodio_api`
- Authentication pages: Login, Signup, Forget Password
- Profile page
- Toast notifications (react-toastify)

## Routing

The app uses `HashRouter` and includes routes such as:

- `/` — Home
- `/restaurant` — Restaurant listing
- `/restaurant/:type/:res_name/:res_id` — Restaurant details
- `/cart` — Cart
- `/wishlist` — Wishlist
- `/dishdetail` — Dish detail
- `/login`, `/signup`, `/forget-password`, `/profile`
- `/thali/description/:thali_id`

## Project layout (important files)

- `src/` — application source code
	- `main.jsx` — app entry
	- `App.jsx` — router + global providers (ToastContainer)
	- `Components/` — UI components (Header, Footer, Hero, Dish/Restaurant cards, etc.)
	- `Pages/` — route pages (Home, Restaurant, Cart, Login, Signup, Profile, etc.)
	- `index.css`, `App.css` — global styles
