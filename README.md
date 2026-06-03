# Apartment Listings — Full-Stack App

A full-stack Node.js + React application to manage apartment listings.

## Project Structure

```
Apartments.com/
├── package.json                  ← root scripts (concurrently, install:all)
├── server/
│   ├── index.js                  ← Express entry point
│   ├── .env                      ← PORT config
│   ├── routes/
│   │   ├── listings.js           ← GET/POST/DELETE /api/listings
│   │   └── validate.js           ← POST /api/validate
│   └── utils/
│       └── validateAddress.js    ← address validation logic (pool-based)
└── client/
    ├── vite.config.js            ← Vite + proxy to server (port 5001)
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx               ← root component; filters, dialog, data fetching
        ├── images/               ← static icon assets (PNG)
        │   ├── home.png          ← dwellings icon
        │   ├── house.png
        │   ├── internet.png      ← NBN icon
        │   ├── paw.png           ← pets icon
        │   ├── remove.png        ← "not allowed" icon
        │   ├── trash.png         ← delete button icon
        │   ├── delete.png
        │   ├── edit.png
        │   └── check.png
        ├── utils/
        │   ├── api.js            ← fetch helpers + Zod schema for listings
        │   └── validateAddress.js← calls POST /api/validate
        └── components/
            ├── AddListingForm.jsx ← modal form with address validation + TriToggle
            ├── ListingCard.jsx    ← card with TriBadge for NBN/pets status
            └── StatsBar.jsx      ← summary stats (total, avg price, NBN, dwellings)
```

## Setup & Run

### 1. Install dependencies

```bash
# From the root — installs all three packages in one command
npm run install:all
```

Or manually:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 2. Start both servers

```bash
npm run dev
```

- React app: http://localhost:5173
- Express API: http://localhost:5001

> **Note:** The Vite dev server proxies all `/api` requests to `http://localhost:5001`.
> The server port is set in `server/.env` — make sure it matches the proxy target in `client/vite.config.js`.

---

## API Endpoints

| Method | Endpoint          | Description                         |
|--------|-------------------|-------------------------------------|
| GET    | /api/health       | Health check                        |
| GET    | /api/listings     | Get all listings (supports filters) |
| POST   | /api/listings     | Create a new listing                |
| DELETE | /api/listings/:id | Delete a listing by ID              |
| POST   | /api/validate     | Validate and resolve an address     |

### GET /api/listings — query params

| Param    | Example          | Description                              |
|----------|------------------|------------------------------------------|
| maxPrice | ?maxPrice=5000   | Filter listings at or below this price   |
| state    | ?state=VIC       | Filter by state abbreviation             |
| nbn      | ?nbn=true        | Filter by NBN availability (true/false/unknown) |
| pets     | ?pets=false      | Filter by pet policy (true/false/unknown)|
| sort     | ?sort=price-asc  | Sort order (see values below)            |

**Sort values:** `price-asc`, `price-desc`, `dwellings`, or omit for newest-first (default).

### POST /api/listings — request body

```json
{
  "price": 150000,
  "dwellings": 2,
  "address": "12 Harbour St, Sydney, NSW, Australia",
  "nbn": "true",
  "pets": "false",
  "lat": -33.8688,
  "lng": 151.2093,
  "img": "https://..."
}
```

**Required fields:** `price`, `dwellings`, `address`, `lat`, `lng`

`nbn` and `pets` accept `"true"`, `"false"`, or `"unknown"` (stored as booleans or the string `"unknown"`).
`img` is optional; omitting it stores an empty string.

### POST /api/validate — request body

```json
{ "address": "12 Harbour St, Sydney NSW" }
```

**Response:**

```json
{
  "streetAddress": "12 Harbour St",
  "suburb": "Sydney",
  "postcode": 2000,
  "state": "NSW",
  "lat": -33.8688,
  "lng": 151.2093
}
```

The server matches the input against a pool of real Australian addresses by comparing the suburb and state. If no match is found, a `500` error is returned.

---

## Client Components

### `App.jsx`

Root component. Manages:

- `listings` — the filtered list shown in the UI
- `allListings` — unfiltered list used to calculate stats
- `filters` — `{ maxPrice, state, nbn, pets, sort }`
- Add-listing dialog (open/close state)

Both `listings` and `allListings` are re-fetched after every add or delete.

### `AddListingForm.jsx`

Modal form for creating a new listing. Features:

- **Address validation** — user types an address then clicks *Validate*, which calls `POST /api/validate`. On success the resolved address and coordinates are shown and locked in for submission.
- **TriToggle** — reusable three-state button group (Yes / No / Unknown) used for NBN and Pets fields.
- Zod schema validation (via `api.js`) runs client-side before the network request is made.
- Closes automatically on successful submission.

### `ListingCard.jsx`

Displays a single listing. Features:

- **TriBadge** — colour-coded pill badge (green / red / grey) for NBN and Pets status, with icon images.
- Thumbnail image with graceful fallback if the URL fails to load.
- Delete button calling `onDelete(id)`.

### `StatsBar.jsx`

Displays four summary stats across the top of the page, calculated from `allListings` (unfiltered):

| Stat | Description |
|------|-------------|
| Total listings | Count of all listings |
| Avg price | Mean price across all listings |
| NBN connected | Count where `nbn === true` |
| Total dwellings | Sum of `dwellings` across all listings |

---

## Client Utilities

### `src/utils/api.js`

Exports three fetch helpers and a Zod schema:

| Export | Description |
|--------|-------------|
| `getListings(filters)` | `GET /api/listings` with optional filter params |
| `createListing(data)` | Validates with `CreateListingSchema`, then `POST /api/listings` |
| `deleteListing(id)` | `DELETE /api/listings/:id` |

`createListing` runs Zod validation **before** hitting the network. Validation rules:

- `price` — number or numeric string, must be `> 0`
- `dwellings` — number or numeric string
- `address` — string, minimum 5 characters
- `nbn` / `pets` — `true`, `false`, or `"unknown"` (defaults to `"unknown"`)
- `lat` / `lng` — number or numeric string
- `img` — valid URL, empty string, or omitted

### `src/utils/validateAddress.js`

Thin wrapper that calls `POST /api/validate` and returns the structured address object. Throws if the response is not `ok`.

---

## Server Utilities

### `server/utils/validateAddress.js`

Matches an address string against a pool of 12 real Australian addresses (covering NSW, VIC, QLD, WA, SA, TAS). Matching is case-insensitive and requires both **suburb** and **state** to appear in the input string.

- Returns a shallow copy of the matched pool entry with `{ streetAddress, suburb, postcode, state, lat, lng }`.
- If multiple entries match, one is chosen at random.
- Throws `"Address could not be validated"` if there is no match.
- Throws `"Invalid input"` if the argument is not a non-empty string.

---

## Dependencies

### Root

| Package | Purpose |
|---------|---------|
| concurrently | Run server and client dev processes together |
| zod | Schema validation (shared, installed at root) |

### Server

| Package | Purpose |
|---------|---------|
| express | HTTP server and routing |
| cors | Cross-origin request headers |
| dotenv | Load `PORT` from `.env` |
| nodemon *(dev)* | Auto-restart server on file changes |

### Client

| Package | Purpose |
|---------|---------|
| react / react-dom | UI framework |
| vite | Dev server and bundler |
| @vitejs/plugin-react | React Fast Refresh for Vite |
| tailwindcss | Utility-first CSS |
| autoprefixer / postcss | CSS processing for Tailwind |
| axios | HTTP client (installed, available for use) |
