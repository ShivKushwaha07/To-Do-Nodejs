# Todo Backend Application with Authentication and Advanced Features
This project implements a backend application for managing todos with user authentication, CRUD operations, pagination, search functionality, and special handling for pinned todos. Users can sign up, sign in, create, update, delete, search, and prioritize todos as favorites or pinned items. The application stores data in MongoDB.

## Main Features
### 1. User Authentication
Secure authentication using JSON Web Tokens (JWT) to protect API endpoints. Users obtain a JWT token upon successful authentication, which is required for accessing protected routes.

### 2. CRUD Operations for Todos
#### Create Todo
Users can create new todos by sending a POST request to /api/todos.

#### Read Todos
Retrieve todos with options for pagination and search by title. Pinned todos are returned first in the listing.

#### Update Todo
Update an existing todo's details, including title, description, and pinned status.

#### Delete Todo
Remove a todo from the list.

### 3. Special Features
#### Pinned Todos First
Todos marked as pinned are prioritized and returned first in API responses, ensuring users can easily access their most important todos.

#### Favorite Todos
Users can mark todos as favorites for quick access and personal organization.

## Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) for authentication
- Postman for API testing

## Getting Started
To get a local copy up and running follow these simple steps.

### Prerequisites
- Node.js installed on your machine
- MongoDB installed and running locally or a remote MongoDB instance

### API Usage
- Sign Up:
   
``` console
POST /api/auth/signup
```

- Sign In:
   
``` console
POST /api/auth/signin
```

- Create Todos:
   
``` console
POST /api/todos
```

- Update Todo:
   
``` console
PUT /api/todos/:id
```

- Get Todos:
   
``` console
GET /api/todos?page=1&limit=10&search=keyword
```

- Delete Todo:
   
``` console
DELETE /api/todos/:id
```

- Mark Todo as Favorite:
   
``` console
PUT /api/todos/:id/favorite
```

- Mark Todo as Pinned:
   
``` console
PUT /api/todos/:id/pinned
```

