## Plan My Trip - Trip planner backend api (for showcase purposes only)

---

### Technologies used: Nest.js, PrismaORM, Typescript, Jest. Docker, Swagger UI, ESLint, Prettier

This is a backend api for a travel planner application. Includes:

1. Authentication (login, registration).
2. Managing Destinations (you can add/edit/delete a destination, its description and date, get all destinations by user).
3. Managing Activities (add/edit/delete activity by type, like flights, hotels, etc. or add your own type, its description, get all activities by destination).
4. RBAC (role-based access control) - user types include User(traveller) and Admin (site admin).
5. Managing users (route guard, only for Admin)
6. Utilities: request body validation, route tests


