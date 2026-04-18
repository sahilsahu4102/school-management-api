# 🏫 School Management API

A **production-grade** REST API built with Node.js, Express.js, and MySQL for managing school data. Add new schools and retrieve schools sorted by proximity to any location using the **Haversine formula**.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## ✨ Features

- **Add School** — Register schools with name, address, and coordinates
- **List Schools by Proximity** — Find nearby schools sorted by distance (Haversine formula)
- **Interactive API Docs** — Swagger UI at `/api-docs`
- **Input Validation** — Joi-based schema validation with detailed error messages
- **Security** — Helmet, CORS, rate limiting, prepared statements (SQL injection safe)
- **Production Ready** — Connection pooling, error handling, graceful shutdown

---

## 🚀 Live API

| Resource | URL |
|---|---|
| **Base URL** | `https://your-app.onrender.com` |
| **API Docs** | `https://your-app.onrender.com/api-docs` |
| **Postman Collection** | [Click to Import](#) |

---

## 📡 API Endpoints

### `POST /addSchool`

Add a new school to the database.

**Request Body:**
```json
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi, 110003",
  "latitude": 28.5839,
  "longitude": 77.2410
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi, 110003",
    "latitude": 28.5839,
    "longitude": 77.241
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "School name is required" },
    { "field": "latitude", "message": "Latitude must be between -90 and 90" }
  ]
}
```

---

### `GET /listSchools?latitude=28.6139&longitude=77.2090`

Retrieve all schools sorted by proximity to the provided coordinates.

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `latitude` | number | ✅ | User's latitude (-90 to 90) |
| `longitude` | number | ✅ | User's longitude (-180 to 180) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": [
    {
      "id": 3,
      "name": "Kendriya Vidyalaya",
      "address": "Connaught Place, New Delhi",
      "latitude": 28.6315,
      "longitude": 77.2167,
      "distance_km": 2.15
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi, 110003",
      "latitude": 28.5839,
      "longitude": 77.241,
      "distance_km": 4.82
    }
  ],
  "count": 2
}
```

---

## 🔧 Local Setup

### Prerequisites
- **Node.js** >= 18.0.0
- **MySQL** >= 8.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/educase-school-management.git
cd educase-school-management

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Start the development server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | Database name | `school_management` |
| `DB_PORT` | MySQL port | `3306` |

> **Note:** The `schools` table is auto-created on server startup. You only need to create the database itself.

```sql
CREATE DATABASE school_management;
```

---

## 🏗️ Architecture

```
src/
├── config/
│   └── db.js                 # MySQL connection pool + table initialization
├── controllers/
│   └── schoolController.js   # Request handlers (business logic)
├── middleware/
│   ├── errorHandler.js       # Global error handling middleware
│   └── validate.js           # Joi validation middleware factory
├── models/
│   └── schoolModel.js        # Database queries (prepared statements)
├── routes/
│   └── schoolRoutes.js       # Express router + Swagger annotations
├── utils/
│   ├── ApiError.js           # Custom error class
│   ├── ApiResponse.js        # Standardized response wrapper
│   └── distance.js           # Haversine distance calculator
└── validators/
    └── schoolValidator.js    # Joi validation schemas
```

### Key Design Decisions

- **Haversine Formula** — Calculates real geodesic distance on Earth's surface (not Euclidean)
- **Connection Pooling** — Handles concurrent requests efficiently with `mysql2/promise`
- **Prepared Statements** — All queries use parameterized inputs to prevent SQL injection
- **MVC Pattern** — Clean separation of routes → controllers → models
- **Validation Layer** — Joi schemas with custom error messages for professional UX

---

## 🛡️ Security

| Feature | Implementation |
|---|---|
| SQL Injection | Prepared statements via `mysql2` |
| XSS Protection | Helmet security headers |
| Rate Limiting | 100 requests / 15 min per IP |
| CORS | Configurable origin whitelist |
| Input Validation | Joi schema validation |
| Body Size Limit | 10KB max JSON payload |

---

## 📬 Postman Collection

Import the Postman collection to test both APIs:

1. Open Postman
2. Click **Import** → **Link**
3. Paste: `[Postman Collection Link]`
4. Switch environment to **Production** or **Local**

---

## 📄 License

MIT © Sahil
