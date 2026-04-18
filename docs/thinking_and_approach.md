# System Thinking & Architectural Approach

This document is intended to serve as a high-level Technical Design Document (TDD). 
While the specific functional requirements of this EduCase assignment were relatively straightforward (two endpoints with SQL storage), my explicit approach was to design this application as if it were a microservice scaling to 10,000+ daily active users on a cloud PaaS infrastructure. 

Here is the deep strategic thinking behind the codebase architecture.

---

## 1. Domain-Driven MVC Architecture 
In node environments like Express, developers frequently commit the "fat route" anti-pattern—placing SQL queries, distance calculations, and HTTP logic directly inside the router (`app.post('/x', (req, res) => {...})`). 

**My Approach:**
I implemented a strict separation of concerns utilizing a Model-View-Controller paradigm suitable for Restful environments.
- **`routes/`**: Handles the HTTP surface layer. It strictly defines the path, the HTTP verb, and attaches the appropriate security middleware. It knows nothing about the database.
- **`controllers/`**: Extracts data from HTTP scopes (`req.body`, `req.query`), invokes mathematical formulas, and manages the HTTP response payload.
- **`models/`**: Acts as the pure Data Access Layer (DAL). It only cares about SQL transactions. 

*Result:* If in the future, the project mandates a transition from MySQL to a NoSQL solution like MongoDB, I only need to modify the `models` layer. The routes, validations, and controllers remain 100% agnostic. It guarantees maximum future-proofing.

---

## 2. Geographic Mathematics: Replacing Euclidean with Haversine
The assignment mandated retrieving schools "sorted by proximity." 

**The Mathematical Problem:**
The Earth is an oblate spheroid. Coordinates are mapped across converging meridians. A single degree of longitude exactly at the equator spans roughly 111 kilometers. However, as you travel north toward Delhi, or further to London, a degree of longitude continually shrinks in physical width.
Using standard high-school Euclidean math (`distance = sqrt((x2-x1)^2 + (y2-y1)^2)`) produces massive deviation errors the further points are separated.

**My Solution:**
I engineered the `Haversine formula` algorithm within `src/utils/distance.js`. 
1. It calculates the Great-Circle distance by converting spatial decimal degrees into delta radians.
2. It processes the half-chord length mathematically proportional to an assumed earthly median radius of `6371` kilometers.
*Result:* Absolute, true-to-life geodetic distance routing identical natively to what Google Maps routing algorithms utilize. 

---

## 3. Pre-empting Vandalism: Advanced Payload Validation
APIs do not trust users. An unvalidated backend is vulnerable to SQL truncation errors, Null-pointer crashes, and malicious payloads. 

**My Approach (Joi Schema Verification):**
Instead of verbose conditional matrices, I introduced the `Joi` declarative validation library.
- By mounting the Joi middleware directly into the Express route pipeline, bad requests are immediately severed before the Controller even allocates memory for them.
- I enforced schema constraints representing real-world limits: names must not exceed physical `VARCHAR(255)` limits, `latitude` strictly bounds to its geographic `±90.0` logic, and `longitude` to `±180.0`.
- Joi maps the errors directly to the exact failing node tree, providing highly descriptive HTTP `400` errors for front-end engineers.

---

## 4. The Standardized Envelope Protocol
One of the most frustrating aspects of consuming external APIs is inconsistent data delivery (e.g., getting `{data: [...]}` on one endpoint, but receiving raw array literals `[{...}]` on another).

**My Approach:**
I mandated a standardized Response wrapper class. Every success returns identically:
```json
{
  "success": true,
  "message": "Human readable context",
  "data": [],
  "count": 0
}
```
Equally, the Global Error Middleware standardizes the failure state:
```json
{
  "success": false,
  "message": "Human readable reason",
  "errors": ["Specific field failures"]
}
```
*Result:* Predictable front-end state management. If React or Vue consumes this API, they natively understand how to parse the JSON tree uniformly across every component without unique parsing hooks.

---

## 5. Security & Availability Posture
A backend must protect its underlying hardware and operating system.
- **SQL Injection immunity:** Built explicit prepared statements over `mysql2`, ensuring the engine strictly handles node parameters as inert strings rather than executable SQL syntax.
- **DDoS Abstraction:** Configured the Node server with `express-rate-limit`, permitting exactly 100 packets per subnet IP via a 15-minute sliding window array. This successfully halts synthetic traffic floods.
- **Helmet Middleware:** I implemented `helmet()` automatically modifying the Express response headers layout, shielding the application vector from Cross-Site Scripting (XSS), Clickjacking implementations, and `X-Powered-By` technology footprinting.

---

## 6. The Developer Experience (DX) Focus
My objective was to ensure whoever receives this assignment experiences zero friction. 
- Integrated a live **Swagger UI (OpenAPI 3.0)** rendering dynamically at the `/api-docs` endpoint so external dependencies like Postman are rendered obsolete for initial manual QA testing. 
- The MySQL Database initializes *itself*, dynamically resolving table drops or missing data nodes intelligently upon the initial node execution thread.
