# Data Model Overview

## 1. Product Collection

### Fields:
- **id**: Unique identifier for each product.
- **title**: Title of the product listing.
- **description**: Description of the item.
- **listingDate**: Date the item was listed.
- **condition**: Condition of the item (e.g., new, used).
- **pictures**: Array of URLs linking to images of the product.
- **owner**: Reference or ID linking to the owner in the `user` collection.

### CRUD Operations:
- **Create**: Add a new product to the collection with all necessary fields filled in.
- **Read**: Retrieve product details based on various filters, such as category, condition, and owner.
- **Update**: Modify product details (e.g., update description, condition, pictures).
- **Delete**: Remove a product from the collection, which may also trigger updates in the `user` collection where it’s marked as a listed or favorite item.

---

## 2. User Collection

### Fields:
- **username**: Unique identifier or name of the user.
- **email**: User’s email address.
- **phone**: Contact number.
- **dateOfBirth**: User’s birth date.
- **listedItems**: Array of `id`s of products listed by the user, referencing the `product` collection.
- **favouriteItems**: Array of `id`s of products marked as favorites, referencing the `product` collection.
- **interestedEvents**: Array of `id`s of events the user is interested in, referencing the `event` collection.

### CRUD Operations:
- **Create**: Register a new user with their personal information.
- **Read**: Retrieve user details, including their listings, favorite items, and interested events.
- **Update**: Update user information or modify the arrays for `listedItems` and `favouriteItems` (e.g., add or remove a product). When a user marks interest in an event, the event’s `id` is added to the `interestedEvents` array.
- **Delete**: Remove user data, which may also trigger deletions or modifications in the `product` collection if listings are specific to this user. If a user’s data is deleted, their `interestedEvents` are also removed, without impacting the `event` collection itself.

---

## 3. Event Collection

### Fields:
- **id**: Unique identifier for each event.
- **title**: Title of the event.
- **description**: Description of the event.
- **location**: Location information for the event (could be a string or a structured address object).

### CRUD Operations:
- **Create**: Add a new event to the collection.
- **Read**: Retrieve event details for display or filtering by location, title, etc.
- **Update**: Modify event details (e.g., description, location).
- **Delete**: Remove an event from the collection.

---

## Relationships

- **User and Product**: The `user` collection has fields referencing the `product` collection to list the items they own or have marked as favorites.
- **Product and User Ownership**: Each product entry has an `owner` field that references the user who listed it.
- **User and Event**: The `interestedEvents` field in the `user` collection references the `event` collection, allowing users to track events they are interested in attending or viewing.
