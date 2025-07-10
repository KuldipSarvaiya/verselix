# Verselix Interview Task

## Project Setup

- Create `.env` file in root of the project and copy paste variable from `.env.example` to `.env` and than add values to those environtment variables.

### Install dependency
```bash
$ npm install
```

### Generate database type
```bash
$ npx prisma generate
```

### Compile and run the project
```bash
$ npm run start:dev
```

## Instructions

- visit `http://localhost:8000/swagger` to access swagger documentation.

- Since this was backend only task, i've added server side authentication using supabase, therefor we need to visit `/api/v1/login` in browser to social login and get JWT token.

- Alternatively, i've made API to get the URL to login and using that you can get url to do login. You need to manuly set the Token from reponse to Swagger.

- Since there is no Frontend to manage the roles, i've added the additional API to promote currently loggedin user to ADMIN role, after caclling this API you need to login again and use new Token to get ADMIN access.


## Tech Stack

- **NestJS**: A progressive, opinionated, TypeScript-first, OOP-based backend framework.
- **Supabase**: Used for PostgreSQL database, social authentication, and file storage.
- **Prisma ORM**: ORM used to connect with the Supabase PostgreSQL database.
