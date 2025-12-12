# Vehicle Rental System API

A comprehensive backend API for a vehicle rental management system. This application allows customers to browse vehicles and make bookings, while providing administrators with full control over inventory, users, and booking statuses.

**Live URL:** [Vehicle Rental System API](https://expresserver.vercel.app/)

---

## 🚀 Features

*   **User Authentication & Authorization**
    *   Secure Signup and Login using JWT.
    *   Role-Based access control (Admin vs Customer).
*   **Vehicle Management**
    *   Add, Update, View, and Delete vehicles.
    *   Track vehicle availability status (Available/Booked).
*   **Booking System**
    *   Create bookings with automatic price calculation.
    *   Real-time vehicle status updates upon booking.
    *   Cancel bookings (Customers) or Mark as Returned (Admins).
*   **User Management**
    *   Admin controls to view and manage user accounts.
    *   Profile updates.

---

## 🛠️ Technology Stack

*   **Language:** TypeScript
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL (via `pg` library)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **Deployment:** Vercel

---

## ⚙️ Setup & Usage Instructions

### Prerequisites
*   Node.js installed
*   PostgreSQL database (local or cloud-hosted)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rayhan-50/expressAssignment-2.git
    cd assignment-2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    CONNECTION_STR=your_postgresql_connection_string
    JWT_SECRET=your_secure_jwt_secret
    ```

4.  **Run the application:**

    *   **Development Mode:**
        ```bash
        npm run dev
        ```

    *   **Build & Start (Production):**
        ```bash
        npm run build
        npm start
        ```

### API Documentation
The API follows standard RESTful principles.
*   **Base URL:** `http://localhost:5000/api/v1`

**Key Endpoints:**
*   `POST /auth/signup` - Register a new user
*   `POST /auth/signin` - Login
*   `GET /vehicles` - Browse vehicles
*   `POST /bookings` - Create a reservation

---

**Author:** [Rayhan Ahmed](https://github.com/Rayhan-50)
