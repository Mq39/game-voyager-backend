# GameVoyager Backend

Backend API for the GameVoyager application.
It provides authentication, game data integration, cart management, and wishlist functionality.

---

## Overview

This service is built using Node.js and Express with TypeScript.
It exposes a REST API that communicates with a MySQL database and integrates with the RAWG API for game data.

The backend handles authentication, business logic, and persistence for user-related data.

---

## Features

* User registration and login with JWT authentication
* Password hashing using bcrypt
* Game data retrieval from RAWG API
* Search, browse, and detailed game endpoints
* Cart management (add, update, remove items)
* Wishlist management
* Local database caching for games
* Middleware-based request handling and authorization

---

## Tech Stack

* Node.js
* Express
* TypeScript
* MySQL
* bcryptjs
* jsonwebtoken
* axios
* morgan
* cors

---

## Project Structure

```
src/
├── controllers/
├── routes/
├── middleware/
├── db/
├── models/
└── server.ts
```

---

## Installation

### Prerequisites

* Node.js
* npm
* MySQL

---

### Clone the repository

```bash
git clone https://github.com/Mq39/game-voyager-backend
cd game-voyager-backend
```

---

### Install dependencies

```bash
npm install
```

---

### Environment variables

Create a `.env` file in the root directory:

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=game_voyager
JWT_SECRET=your_secret
RAWG_API_KEY=your_rawg_api_key
```

---

### Run the server

```bash
npm run dev
```

---

## API Endpoints

### Health

* GET `/api/health`

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Games

* GET `/api/games/hero`
* GET `/api/games/popular`
* GET `/api/games/search`
* GET `/api/games/browse`
* GET `/api/games/:id`
* GET `/api/games/:id/screenshots`
* GET `/api/games/:id/movies`

### Cart

* GET `/api/cart`
* POST `/api/cart`
* PATCH `/api/cart/:gameId`
* DELETE `/api/cart/:gameId`

### Wishlist

* GET `/api/wishlist`
* POST `/api/wishlist`
* DELETE `/api/wishlist/:gameId`

---

## API Documentation

Interactive Swagger documentation is available at:

`/api-docs`

Example local URL:

`http://localhost:4000/api-docs`

## Database

The application uses a relational database with the following tables:

* `users`
* `games`
* `cart_items`
* `wishlist_items`

The `games` table acts as a local cache for external API data.

---

## Development Notes

* All protected routes require a valid JWT token
* Token must be provided in the Authorization header
* Format: `Bearer <token>`
* External API data is transformed before being returned to the client

---

## Future Improvements

* Input validation layer
* Rate limiting
* Logging and monitoring
* Payment integration
* Order system

---


## License

This project is licensed under the MIT License.

---

## Author

Predrag Mitrović
