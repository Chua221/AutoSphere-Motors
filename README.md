# AutoSphere Motors - Used Car Marketplace Portal (Assignment 3)

This submission has two projects that run together:

```
car-marketplace-portal/
├── autosphere-api/   <- NEW: Java Spring Boot + MySQL REST API (Task 1 & 2)
└── frontend/         <- React JS app from Assignments 1-2, updated to call it
```

The old `frontend/db.json` (json-server) and `frontend/server/` (Node OAuth
server) from Assignments 1-2 are **no longer used** and are only left in
place for reference - everything they used to do now lives in
`autosphere-api`.

## What changed for Assignment 3

- **Profile Management** - `PUT /api/users/{id}` only ever updates
  `phone`/`address`. Name and email always come back exactly as stored and
  are shown read-only on the Profile page.
- **Car Listings + Search & Filter** - `GET /api/cars` supports `make`,
  `model`, `year`, `registrationNumber`, `minPrice`, `maxPrice`, `sellerId`,
  `sort` and `order`, built with JPA Specifications so any combination can
  be searched at once.
- **Full REST CRUD** - `GET/POST/PUT/PATCH/DELETE /api/cars`, all with Bean
  Validation and a single consistent JSON error shape
  (`GlobalExceptionHandler` -> 400/401/403/404/409/500).
- **Authentication** - email/password uses BCrypt + a signed JWT; Google
  sign-in now sends the access token to the backend, which verifies it
  directly with Google instead of trusting anything decoded in the browser;
  GitHub/Facebook keep the same "authorization code" redirect flow as
  Assignment 2, just handled by this backend instead of the small Node
  server.
- **MySQL** - Hibernate creates/updates the `users` and `cars` tables for
  you (`spring.jpa.hibernate.ddl-auto=update`); a `DataSeeder` inserts two
  demo sellers and 12 listings the first time you run it.

## 1. Set up MySQL

```sql
CREATE DATABASE autosphere_db;
```

Then open `autosphere-api/src/main/resources/application.properties` and
fill in your MySQL username/password.

## 2. Run the backend (Eclipse / STS, or the command line)

- **Eclipse/STS**: `File > Import > Existing Maven Project`, select
  `autosphere-api`, then run `AutosphereApiApplication` as a Java
  Application.
- **Command line** (needs internet the first time, to download
  dependencies): `cd autosphere-api && mvn spring-boot:run`

It starts on **http://localhost:8080**.

## 3. Configure OAuth (only needed if you want to demo GitHub/Facebook login)

In `application.properties`, fill in:
- `app.oauth.github.client-id` / `client-secret`
- `app.oauth.facebook.app-id` / `app-secret`

Then, in your GitHub OAuth App / Facebook App settings, set the callback
URL to:
- GitHub: `http://localhost:8080/auth/github/callback`
- Facebook: `http://localhost:8080/auth/facebook/callback`

(Google sign-in needs no backend secret - only the public Client ID in the
frontend's `.env`, unchanged from Assignment 2.)

## 4. Run the frontend

```
cd frontend
npm install
npm start
```

Runs on **http://localhost:3000** and talks to the API at
`http://localhost:8080/api`.

## 5. Demo accounts

Seeded automatically on first backend run:

| Email                  | Password    |
|-------------------------|-------------|
| farah@autosphere.my     | password123 |
| kaiming@autosphere.my   | password123 |

## Testing with Postman

Import the API base URL `http://localhost:8080`. A typical flow:
1. `POST /api/auth/login` with `{"email":"farah@autosphere.my","password":"password123"}` -> copy `token`.
2. Add header `Authorization: Bearer <token>` to protected requests.
3. `GET /api/cars?make=Toyota&minPrice=50000&maxPrice=100000` to try search/filter.
4. `POST /api/cars` (with the header above) with a full car body to test
   validation - try omitting `make` to see the 400 response shape.
5. `PUT /api/users/{id}` with `{"phone":"...","address":"..."}` - try sending
   a different id than your own token's to see the 403 response.

These are good starting points for the Task 3 White Box / Black Box test
evidence required in the Project Report.
