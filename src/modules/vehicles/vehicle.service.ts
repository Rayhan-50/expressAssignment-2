import { pool } from "../../database/db";

const createVehicleIntoDB = async (payload: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(
        `
      INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status || 'available']
    );
    return result.rows[0];
};

const getAllVehiclesFromDB = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rows;
};

const getVehicleByIdFromDB = async (vehicleId: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    return result.rows[0];
}

const updateVehicleIntoDB = async (vehicleId: string, payload: any) => {
    // Check if vehicle exists
    const vehicleCheck = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    if (vehicleCheck.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    // Construct dynamic query
    let updateQuery = 'UPDATE vehicles SET';
    const upgradeValues = [];
    let count = 1;

    if (vehicle_name) {
        updateQuery += ` vehicle_name = $${count},`;
        upgradeValues.push(vehicle_name);
        count++;
    }
    if (type) {
        updateQuery += ` type = $${count},`;
        upgradeValues.push(type);
        count++;
    }
    if (registration_number) {
        updateQuery += ` registration_number = $${count},`;
        upgradeValues.push(registration_number);
        count++;
    }
    if (daily_rent_price) {
        updateQuery += ` daily_rent_price = $${count},`;
        upgradeValues.push(daily_rent_price);
        count++;
    }
    if (availability_status) {
        updateQuery += ` availability_status = $${count},`;
        upgradeValues.push(availability_status);
        count++;
    }

    updateQuery = updateQuery.slice(0, -1);
    updateQuery += ` WHERE id = $${count} RETURNING *`;
    upgradeValues.push(vehicleId);

    const result = await pool.query(updateQuery, upgradeValues);
    return result.rows[0];
};

const deleteVehicleFromDB = async (vehicleId: string) => {
   
    const vehicleCheck = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    if (vehicleCheck.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    
    const activeBookings = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [vehicleId]
    );

    if (activeBookings.rows.length > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
    }

    await pool.query(`DELETE FROM vehicles WHERE id = $1`, [vehicleId]);
};

export const vehicleService = {
    createVehicleIntoDB,
    getAllVehiclesFromDB,
    getVehicleByIdFromDB,
    updateVehicleIntoDB,
    deleteVehicleFromDB
};
