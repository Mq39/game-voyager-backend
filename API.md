# GameVoyager API Documentation

Base URL:
/api

---

## Health

### GET /health

Checks whether the API is running.

Response (200):
{
  "message": "API is running"
}

---

## Authentication

### POST /auth/register

Request body:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response (201):
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "username",
    "email": "email"
  }
}

Errors:
- 400 Bad Request
- 409 Conflict
- 500 Internal Server Error

---

### POST /auth/login

Request body:
{
  "username": "string",
  "password": "string"
}

Response (200):
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "username",
    "email": "email"
  }
}

Errors:
- 400 Bad Request
- 401 Unauthorized
- 500 Internal Server Error

---

## Games

### GET /games/hero

Response (200):
[
  {
    "id": 1,
    "title": "Game Title",
    "image": "url"
  }
]

---

### GET /games/popular

Response (200):
[
  {
    "id": 1,
    "title": "Game Title",
    "image": "url",
    "rating": 4.5
  }
]

---

### GET /games/search

Query params:
- query (string)
- pageSize (number)

Example:
/games/search?query=gta&pageSize=6

Notes:
If query is empty, returns an empty array.

Response (200):
[
  {
    "id": 3498,
    "title": "Grand Theft Auto V",
    "image": "url",
    "rating": 4.47
  }
]

---

### GET /games/browse

Query params:
- page
- pageSize
- search
- genre
- platform
- ordering

Response (200):
{
  "results": [],
  "next": null,
  "previous": null
}

---

### GET /games/:id

Response (200):
{
  "id": 3498,
  "title": "Game Title",
  "description": "text",
  "released": "date",
  "rating": 4.5
}

Errors:
- 500 Internal Server Error

---

### GET /games/:id/screenshots

Response (200):
[
  {
    "id": 1,
    "image": "url"
  }
]

---

### GET /games/:id/movies

Response (200):
[
  {
    "id": 1,
    "name": "Trailer",
    "preview": "url"
  }
]

---

## Cart

All cart routes require Authorization header:

Authorization: Bearer <token>

---

### GET /cart

Response (200):
{
  "items": [
    {
      "id": 1,
      "gameId": 3498,
      "title": "Game Title",
      "image": "url",
      "quantity": 2
    }
  ]
}

---

### POST /cart

Request body:
{
  "gameId": 3498,
  "quantity": 1,
  "title": "Game Title",
  "image": "url"
}

Response (201):
{
  "message": "Added to cart."
}

---

### PATCH /cart/:gameId

Request body:
{
  "quantity": 3
}

Response (200):
{
  "message": "Quantity updated."
}

If quantity <= 0:
{
  "message": "Item removed."
}

---

### DELETE /cart/:gameId

Response (200):
{
  "message": "Removed game 3498 from cart."
}

---

## Wishlist

All wishlist routes require Authorization header:

Authorization: Bearer <token>

---

### GET /wishlist

Response (200):
{
  "items": [
    {
      "id": 1,
      "gameId": 3498,
      "title": "Game Title",
      "image": "url"
    }
  ]
}

---

### POST /wishlist

Request body:
{
  "gameId": 3498,
  "title": "Game Title",
  "image": "url"
}

Response (201):
{
  "message": "Added to wishlist."
}

---

### DELETE /wishlist/:gameId

Response (200):
{
  "message": "Removed from wishlist."
}

---

## Authentication Notes

- All protected routes require JWT token
- Token must be sent via Authorization header
- Format: Bearer <token>

---

## Common Status Codes

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error