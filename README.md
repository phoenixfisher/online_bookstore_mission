# IS 413 Mission 11 - Online Bookstore

This assignment builds an online bookstore app with ASP.NET Core API (C#) backend and React + TypeScript frontend.

## Mission

Create a web app for an online bookstore that stores and displays books from a database.

### Book fields (all required)

- Title
- Author
- Publisher
- ISBN
- Classification/Category
- Number of pages
- Price

## Project structure

- `frontend` - React + TypeScript frontend
- `backend` - ASP.NET Core API backend
- `db` - SQLite database used by the backend

## Requirements

1. Use the provided bookstore database and connect it to the app.
2. Ensure backend models match database tables.
3. Build a React component that lists each book from the database.
4. Add pagination: default 5 books per page.
5. Allow user to change results per page.
6. Add sorting by book title.
7. Add the component to `App.tsx`.
8. Style the page using Bootstrap.

## Run the app

1. Run backend:

```bash
cd backend/backend
dotnet run
```

2. Run frontend:

```bash
cd frontend
npm install
npm run dev
```
