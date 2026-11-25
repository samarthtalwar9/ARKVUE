# ARKVUE – Lead Management System

<p align="center">
  <strong>A Full-Stack Lead Management Application</strong>
  <br />
  Built to simplify lead creation, tracking, searching, and management.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-blue" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green" alt="Backend" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791" alt="Database" />
  <img src="https://img.shields.io/badge/Status-Development-orange" alt="Status" />
</p>

---

## 1. Project Overview

**ARKVUE** is a full-stack Lead Management System designed to help manage and organize potential customers through a centralized application.

The application provides a structured way to create, retrieve, search, filter, and update lead records while maintaining data consistency through PostgreSQL.

It follows a client-server architecture, with a React and TypeScript frontend communicating with a Node.js and Express backend through REST APIs.

The backend uses PostgreSQL for persistent data storage and applies validation and duplicate-prevention mechanisms to maintain reliable lead records.

## 2. Problem Statement

Managing potential customers manually can lead to:

- Duplicate lead records.
- Difficulty tracking lead status.
- Inefficient searching and filtering.
- Inconsistent customer information.
- Limited visibility into overall lead statistics.

ARKVUE addresses these challenges by providing a centralized lead management solution with structured database storage and API-driven operations.

## 3. Project Objectives

- Build a user-friendly lead management interface.
- Implement REST APIs for lead operations.
- Store lead information in a PostgreSQL database.
- Prevent duplicate records using email and phone.
- Provide searching and filtering capabilities.
- Display useful dashboard statistics.
- Implement proper validation and error handling.
- Maintain a modular and maintainable application structure.

## 4. Key Features

| Feature | Description |
|---|---|
| Lead Creation | Add new leads with validated information |
| Lead Management | Retrieve and update existing leads |
| Duplicate Prevention | Prevent duplicate email addresses and phone numbers |
| Search | Search lead records using supported fields |
| Filtering | Filter leads by status and source |
| Dashboard Statistics | View lead counts by status |
| PostgreSQL Integration | Persist lead information in a relational database |
| API Error Handling | Return appropriate responses for invalid requests and database errors |

*Feature availability in the user interface depends on the frontend integration.*

## 5. Technology Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| TypeScript | Type safety and maintainable frontend code |
| Vite | Frontend development and build tooling |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API development and request handling |
| PostgreSQL | Relational database for persistent lead storage |
| `pg` | PostgreSQL connectivity from Node.js |
| Zod | Request data validation |
| CORS | Managing cross-origin frontend/backend requests |
| dotenv | Loading environment configuration |

## 6. System Architecture

ARKVUE follows a client-server architecture.

```text
             USER
               |
               v
    +----------------------+
    |  React + TypeScript  |
    |      Frontend        |
    +----------------------+
               |
               | HTTP Requests
               | REST APIs
               v
    +----------------------+
    |   Node.js + Express  |
    |       Backend        |
    +----------------------+
               |
               | Request Validation
               | Business Logic
               v
    +----------------------+
    |      PostgreSQL      |
    |       Database       |
    +----------------------+
               |
               v
       Stored Lead Data
```

### Application Flow

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. Express receives and processes the API requests.
4. Zod validates incoming lead data where applicable.
5. The backend executes SQL queries through the PostgreSQL client.
6. PostgreSQL stores or retrieves the requested information.
7. The backend returns structured JSON responses to the frontend.

## 7. Project Structure

```text
ARKVUE/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   │
│   │   ├── routes/
│   │   │   └── leads.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

*The structure above describes the main application organization. Update it if your actual frontend contains additional folders or files.*

## 8. Database Design

ARKVUE uses PostgreSQL to store lead information.

### Leads Table

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR(120) | Lead's name |
| email | VARCHAR(255) | Lead's email address |
| phone | VARCHAR(20) | Contact number |
| company | VARCHAR(150) | Company name |
| source | VARCHAR(50) | Lead acquisition source |
| status | VARCHAR(30) | Current lead status |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### Lead Statuses

The application supports the following statuses:

- New
- Contacted
- Qualified
- Converted

### Database Constraints

- UUID is used as the primary identifier.
- Email addresses are protected by a case-insensitive unique index.
- Phone numbers have a unique index.
- Required fields are defined with `NOT NULL` constraints.
- Timestamps help track record creation and updates.

The database initialization logic creates the leads table and required unique indexes if they do not already exist.

## 9. REST API Documentation

Base URL:

```text
http://localhost:5000
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend health check |
| POST | `/api/leads` | Create a new lead |
| GET | `/api/leads` | Retrieve leads |
| GET | `/api/leads/:id` | Retrieve a lead by ID |
| PUT | `/api/leads/:id` | Update an existing lead |
| GET | `/api/dashboard/stats` | Retrieve dashboard statistics |

### 9.1 Create a Lead

**POST** `/api/leads`

Example request:

```json
{
  "name": "Aarav Kulkarni",
  "email": "aarav@example.com",
  "phone": "+919876500001",
  "company": "Example Technologies",
  "source": "Website",
  "status": "New"
}
```

The backend validates the submitted information and attempts to insert the lead into PostgreSQL.

A successful creation returns HTTP `201 Created`.

Duplicate email or phone records return HTTP `409 Conflict`.

### 9.2 Retrieve Leads

**GET** `/api/leads`

Retrieve the available lead records.

Optional query parameters:

| Parameter | Purpose |
|---|---|
| search | Search supported lead fields |
| status | Filter by lead status |
| source | Filter by lead source |
| limit | Control the number of records returned |

Example:

```text
GET /api/leads?search=Aarav
GET /api/leads?status=New
GET /api/leads?source=Website
```

### 9.3 Retrieve a Lead by ID

**GET** `/api/leads/:id`

Example:

```text
GET /api/leads/your-lead-uuid
```

Returns the requested lead if found. Invalid UUIDs and missing records are handled by the backend.

### 9.4 Update a Lead

**PUT** `/api/leads/:id`

Example request:

```json
{
  "status": "Contacted"
}
```

The backend validates the lead ID and update data before modifying the record.

### 9.5 Dashboard Statistics

**GET** `/api/dashboard/stats`

Returns aggregate lead statistics, including:

- Total leads.
- New leads.
- Contacted leads.
- Qualified leads.
- Converted leads.

Example response structure:

```json
{
  "success": true,
  "stats": {
    "total": "10",
    "new": "4",
    "contacted": "2",
    "qualified": "3",
    "converted": "1"
  }
}
```

*The numbers above are illustrative, not actual project data.*

## 10. Validation and Error Handling

Data validation is important for maintaining reliable records.

ARKVUE uses Zod schemas to validate incoming lead information.

The backend handles situations such as:

- Missing required fields.
- Invalid email formats.
- Invalid lead IDs.
- Duplicate email addresses.
- Duplicate phone numbers.
- Missing lead records.
- Database operation failures.

PostgreSQL error codes are used to identify duplicate-key conflicts and return an appropriate HTTP response.

This helps keep API responses consistent and makes errors easier to understand and debug.

## 11. My Approach & Engineering Decisions

I approached ARKVUE by breaking the problem into three main components: frontend, backend, and database.

Instead of treating lead management as only a form-based application, I focused on building a structured full-stack system where data is validated, stored, retrieved, and updated through clearly defined APIs.

### 11.1 Frontend – React and TypeScript

I selected React to build a component-based user interface.

TypeScript helps maintain type safety and makes the application easier to maintain as the project grows.

I used Vite as the frontend development and build tool.

### 11.2 Backend – Node.js and Express

I used Node.js with Express to build the backend REST APIs.

This approach separates the user interface from the business logic and database operations.

It also makes the backend easier to test and extend independently.

### 11.3 Database – PostgreSQL

I selected PostgreSQL because lead information is structured and has clear relationships between fields and constraints.

A relational database provides useful capabilities such as:

- Structured data storage.
- Unique constraints.
- SQL-based querying.
- Consistent data management.
- Aggregate queries for dashboard statistics.

### 11.4 Preventing Duplicate Records

One important requirement was preventing duplicate leads.

I implemented unique indexes for email and phone numbers at the database level.

Email uniqueness is case-insensitive, which prevents records such as `USER@example.com` and `user@example.com` from being stored as separate leads.

The backend also handles PostgreSQL duplicate-key errors and returns a conflict response.

### 11.5 Validation and Error Handling

I used Zod for validating incoming API data.

Rather than relying only on frontend validation, I placed validation on the backend so that incoming requests are checked before database operations.

I also considered database-specific errors and invalid record identifiers while designing API responses.

### 11.6 Modular Application Structure

I separated database configuration, API routes, and server initialization into different files.

For example:

- `db.ts` manages PostgreSQL connectivity and database initialization.
- `leads.ts` contains lead management routes.
- `server.ts` configures Express middleware and registers application routes.

This separation improves readability and makes future changes easier.

## 12. Installation and Setup

### Prerequisites

Install the following:

- Node.js
- npm
- PostgreSQL database (local or hosted)
- Git
- Visual Studio Code

### Step 1 – Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd ARKVUE
```

### Step 2 – Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory.

Add your own configuration:

```env
PORT=5000
DATABASE_URL=YOUR_POSTGRESQL_CONNECTION_STRING
```

Use your actual PostgreSQL connection string locally. Never commit this file.

### Step 3 – Start the Backend

Use the development script configured in `server/package.json`.

For example, if the project has a `dev` script:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:5000
```

### Step 4 – Configure the Frontend

Open another terminal:

```bash
cd client
npm install
```

If the frontend uses a configurable API base URL, configure its local environment file:

```env
VITE_API_URL=http://localhost:5000
```

Only public configuration belongs in frontend environment variables. Never put database passwords or private API keys in frontend files.

### Step 5 – Start the Frontend

Use the development script configured in `client/package.json`.

For example:

```bash
npm run dev
```

Vite commonly serves the application at:

```text
http://localhost:5173
```

Open the displayed local URL in your browser.

## 13. Environment Variable Security

The application uses environment variables to keep configuration separate from source code.

Example `.env.example`:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

Copy the example file into a local `.env` file and replace the placeholders with your own values.

**Security guidelines:**

- Never upload `.env` files to GitHub.
- Never hardcode database credentials in source code.
- Never expose private credentials in frontend code.
- Rotate credentials if they are accidentally exposed.

## 14. Testing the APIs

The backend APIs can be tested using PowerShell, Postman, or another HTTP client.

Example PowerShell request to create a lead:

```powershell
$body = @{
  name = "Aarav Kulkarni"
  email = "aarav.test@example.com"
  phone = "+919876500001"
  company = "Example Technologies"
  source = "Website"
  status = "New"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:5000/api/leads" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Retrieve leads:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/leads" `
  -Method GET
```

Retrieve dashboard statistics:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/dashboard/stats" `
  -Method GET
```

## 15. Future Improvements

Potential enhancements include:

- User authentication and role-based access control.
- Lead assignment to team members.
- Advanced filtering and sorting.
- Lead activity history.
- Exporting lead reports.
- Pagination improvements.
- Automated testing.
- Production deployment and monitoring.

These are potential future improvements, not claims about existing functionality.

## 16. Author

**Samarth  Talwar**



- GitHub: [github.com/samarthtalwar9](https://github.com/samarthtalwar9)
- LinkedIn: [linkedin.com/in/samarthtalwar](https://www.linkedin.com/in/samarthtalwar/)

---

<p align="center">
  <strong>Designed & Developed by Samarth A Talwar</strong>
  <br />
  ARKVUE – Lead Management System
  <br />
  © 2026 Samarth A Talwar. All rights reserved.
</p>
