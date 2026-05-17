# Finance Management Application

Simple full-stack finance management application with:

- React + Vite frontend
- Spring Boot backend
- PostgreSQL database

## Project structure

```text
frontend/  React dashboard UI
backend/   Spring Boot REST API
```

## Features

- Add income and expense transactions
- View a recent transactions list
- Delete transactions
- See total income, expenses, and current balance

## Backend API

Base URL: `http://localhost:8080/api`

- `GET /transactions` - list all transactions
- `POST /transactions` - create a transaction
- `DELETE /transactions/{id}` - delete a transaction

Example request body:

```json
{
  "title": "Salary",
  "amount": 50000,
  "type": "INCOME",
  "category": "Job",
  "transactionDate": "2026-04-21",
  "notes": "Monthly salary"
}
```

## PostgreSQL setup

Create a local PostgreSQL database named `finance_management`.

Default backend settings:

- database: `finance_management`
- username: `postgres`
- password: `postgres`

If your local PostgreSQL uses different credentials, update [application.properties](C:\Users\KIIT0001\Documents\Codex\2026-04-21-create-a-simple-application-finance-management-2\backend\src\main\resources\application.properties).

## Run the backend

Requirements:

- Java 17+
- Maven 3.9+

From [`backend`](C:\Users\KIIT0001\Documents\Codex\2026-04-21-create-a-simple-application-finance-management-2\backend):

```bash
mvn spring-boot:run
```

The backend runs on `http://localhost:8080`.

## Run the frontend

Requirements:

- Node.js 18+

From [`frontend`](C:\Users\KIIT0001\Documents\Codex\2026-04-21-create-a-simple-application-finance-management-2\frontend):

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

If PowerShell blocks `npm`, use:

```bash
cmd /c npm.cmd install
cmd /c npm.cmd run dev
```

## Environment notes

The frontend defaults to `http://localhost:8080/api`.

If needed, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## What is included

- Responsive dashboard-style UI
- Spring Data JPA persistence
- Basic validation and API error handling
- CORS setup for local frontend development

## Verification status

The source code and project wiring were created in this workspace, but dependency installation and full runtime verification were not completed in this session.
