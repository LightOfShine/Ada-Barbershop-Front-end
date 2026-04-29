# Absensi Barbershop API Documentation

This documentation outlines the available API endpoints for the Absensi Barbershop backend application.

**Base URL:** `https://ada-backend-service.onrender.com`

---

## Authentication & Authorization
Most endpoints (except `/auth/login` and `/health`) require authentication via a JWT token.
Include the token in the request header:
`Authorization: Bearer <your_jwt_token>`

## Endpoints

### 1. Health
- **`GET /health`**
  - **Description:** Server health check.
  - **Auth Required:** No
  - **Response:**
    ```json
    { "status": "OK", "message": "Absensi Barbershop API is running" }
    ```

### 2. Auth `(/auth)`
- **`POST /auth/login`**
  - **Description:** Authenticates a user and returns a JWT token.
  - **Auth Required:** No
  - **Body (JSON):**
    - `email` (string, required)
    - `password` (string, required)
  - **Success Response:** `200 OK`
  
- **`POST /auth/register`**
  - **Description:** Registers a new user. Only users with `OWNER` or `ADMIN` roles can register new users.
  - **Auth Required:** Yes (`OWNER`, `ADMIN`)
  - **Body (JSON):**
    - `name` (string, required)
    - `email` (string, required)
    - `password` (string, required)
    - `role` (string - e.g., 'OWNER', 'ADMIN', 'EMPLOYEE')
    - `companyId` (uuid, optional)
    - `regionId` (uuid, optional)
    - `barbershopId` (uuid, optional)
    - `shiftStart` (string, optional - e.g., '08:00')
    - `shiftEnd` (string, optional - e.g., '17:00')
  - **Success Response:** `201 Created`

### 3. Regions `(/regions)`
All region endpoints are scoped based on the authenticated user's data scope constraint.

- **`POST /regions`**
  - **Description:** Create a new region within the company. 
  - **Auth Required:** Yes (`OWNER` only)
  - **Body (JSON):**
    - `name` (string, required)
  - **Success Response:** `201 Created`

- **`GET /regions`**
  - **Description:** Retrieves a list of regions within the user's allowed scope.
  - **Auth Required:** Yes (`OWNER` only)
  - **Success Response:** `200 OK`

- **`DELETE /regions/:id`**
  - **Description:** Deletes a specific region by its ID.
  - **Auth Required:** Yes (`OWNER` only)
  - **Success Response:** `200 OK`

### 4. Barbershops `(/barbershops)`
- **`POST /barbershops`**
  - **Description:** Create a new barbershop branch.
  - **Auth Required:** Yes (`OWNER` only)
  - **Body (JSON):**
    - `name` (string, required)
    - `address` (string, optional)
    - `regionId` (uuid, required)
  - **Success Response:** `201 Created`

- **`GET /barbershops`**
  - **Description:** Lists barbershops within the user's data scope constraint (company-wide, or region-wide).
  - **Auth Required:** Yes (`OWNER`, `ADMIN`)
  - **Success Response:** `200 OK`

- **`DELETE /barbershops/:id`**
  - **Description:** Deletes a specific barbershop by its ID.
  - **Auth Required:** Yes (`OWNER` only)
  - **Success Response:** `200 OK`

### 5. Users `(/users)`
- **`GET /users`**
  - **Description:** Get a list of users constrained by the accessing user's scope (Admins see regional employees, Owners see company-wide).
  - **Auth Required:** Yes (`OWNER`, `ADMIN`)
  - **Success Response:** `200 OK`

### 6. Attendance `(/attendance)`
- **`POST /attendance/check-in`**
  - **Description:** Submits a check-in request for a user's shift. Fails if invalid QR, wrong branch, or already checked in.
  - **Auth Required:** Yes (`EMPLOYEE`, `ADMIN`)
  - **Body (JSON):**
    - `qrToken` (string, required)
    - `latitude` (number, optional)
    - `longitude` (number, optional)
  - **Success Response:** `201 Created`

- **`POST /attendance/check-out`**
  - **Description:** Submits a check-out request, effectively ending an open shift.
  - **Auth Required:** Yes (`EMPLOYEE`, `ADMIN`)
  - **Body:** None required
  - **Success Response:** `200 OK`

### 7. Export `(/export)`
All export endpoints are scoped based on the authenticated user's data scope constraint (Company-wide for Owners, Region-wide for Admins).

- **`GET /export/attendance`**
  - **Description:** Generate and fetch attendance reports securely constrained to the requester's branch/company.
  - **Auth Required:** Yes (`OWNER`, `ADMIN`)
  - **Query Params:** 
    - `startDate` (string, optional - e.g., '2024-01-01')
    - `endDate` (string, optional - e.g., '2024-01-31')
  - **Success Response:** `200 OK`
    - Returns a flattened array of attendance records containing fields: `attendanceId`, `employeeName`, `employeeEmail`, `employeeRole`, `branchName`, `date`, `checkInTime`, `checkOutTime`, `checkInStatus`, and `checkOutStatus`.

- **`GET /export/reward`**
  - **Description:** Generate and fetch reward reports.
  - **Auth Required:** Yes (`OWNER`, `ADMIN`)
  - **Query Params:** Optional report filters
  - **Success Response:** `200 OK`
