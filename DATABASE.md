# Database Structure

## Tables

### users
- id (primary key)
- username
- email
- password_hash
- created_at

### games
- id (primary key)
- rawg_id
- title
- image
- created_at

### cart_items
- id (primary key)
- user_id (foreign key)
- game_id (foreign key)
- quantity
- created_at

### wishlist_items
- id (primary key)
- user_id (foreign key)
- game_id (foreign key)
- created_at

## Relationships

- One user can have many cart items
- One user can have many wishlist items
- Games are referenced by cart and wishlist