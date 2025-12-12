import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.CONNECTION_STR
});


export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(50) CHECK (role IN ('admin', 'customer')) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
      registration_number VARCHAR(100) UNIQUE NOT NULL,
      daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(50) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available' NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES users(id),
      vehicle_id INTEGER REFERENCES vehicles(id),
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
      total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
      status VARCHAR(50) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active' NOT NULL
    );
  `);
};
