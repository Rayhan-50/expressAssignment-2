import { pool } from "../../database/db";
const getAllUsersFromDB = async () => {
    const result = await pool.query(`SELECT id, name, email, role, phone FROM users`);
    return result.rows;
};
const updateUserIntoDB = async (userId, payload, requestingUser) => {
    const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    if (userCheck.rows.length === 0) {
        throw new Error("User not found");
    }
    if (requestingUser.role !== 'admin' && requestingUser.id.toString() !== userId) {
        throw new Error("You are not authorized to update this user");
    }
    const { name, email, phone, role } = payload;
    if (role && requestingUser.role !== 'admin') {
        throw new Error("You are not authorized to change role");
    }
    let updateQuery = 'UPDATE users SET';
    const upgradeValues = [];
    let count = 1;
    if (name) {
        updateQuery += ` name = $${count},`;
        upgradeValues.push(name);
        count++;
    }
    if (email) {
        updateQuery += ` email = $${count},`;
        upgradeValues.push(email);
        count++;
    }
    if (phone) {
        updateQuery += ` phone = $${count},`;
        upgradeValues.push(phone);
        count++;
    }
    if (role) {
        updateQuery += ` role = $${count},`;
        upgradeValues.push(role);
        count++;
    }
    updateQuery = updateQuery.slice(0, -1);
    updateQuery += ` WHERE id = $${count} RETURNING id, name, email, phone, role`;
    upgradeValues.push(userId);
    const result = await pool.query(updateQuery, upgradeValues);
    return result.rows[0];
};
const deleteUserFromDB = async (userId) => {
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    if (user.rows.length === 0) {
        throw new Error("User not found");
    }
    const activeBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`, [userId]);
    if (activeBookings.rows.length > 0) {
        throw new Error("Cannot delete user with active bookings");
    }
    await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
};
export const userServices = {
    getAllUsersFromDB,
    updateUserIntoDB,
    deleteUserFromDB
};
