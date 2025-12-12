import { pool } from "../../database/db";
const createBookingIntoDB = async (payload) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const vehicleQuery = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);
    if (vehicleQuery.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    const vehicle = vehicleQuery.rows[0];
    if (vehicle.availability_status !== 'available') {
        throw new Error("Vehicle is not available");
    }
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
        throw new Error("End date must be after start date");
    }
    const total_price = diffDays * Number(vehicle.daily_rent_price);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const bookingResult = await client.query(`
        INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *;
        `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);
        await client.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);
        await client.query('COMMIT');
        const newBooking = bookingResult.rows[0];
        const fullBooking = {
            id: newBooking.id,
            customer_id: newBooking.customer_id,
            vehicle_id: newBooking.vehicle_id,
            rent_start_date: new Date(newBooking.rent_start_date).toISOString().split('T')[0],
            rent_end_date: new Date(newBooking.rent_end_date).toISOString().split('T')[0],
            total_price: newBooking.total_price,
            status: newBooking.status,
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price
            }
        };
        return fullBooking;
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
};
const getAllBookingsFromDB = async (role, userId, queryParams) => {
    let query = `
        SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            to_char(b.rent_start_date, 'YYYY-MM-DD') as rent_start_date,
            to_char(b.rent_end_date, 'YYYY-MM-DD') as rent_end_date,
            b.total_price,
            b.status,
            json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number,
                'type', v.type,
                'daily_rent_price', v.daily_rent_price,
                'availability_status', v.availability_status
            ) as vehicle
    `;
    if (role === 'admin') {
        query += `, json_build_object(
                'name', u.name,
                'email', u.email,
                'phone', u.phone,
                'role', u.role
            ) as customer `;
    }
    query += `
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
    `;
    const values = [];
    if (role === 'customer') {
        query += ` WHERE b.customer_id = $1`;
        values.push(userId);
    }
    if (queryParams?.status) {
        if (values.length > 0) {
            query += ` AND b.status = $${values.length + 1}`;
        }
        else {
            query += ` WHERE b.status = $1`;
        }
        values.push(queryParams.status);
    }
    const result = await pool.query(query, values);
    return result.rows;
};
const updateBookingIntoDB = async (bookingId, payload, requestingUser) => {
    const { status } = payload;
    const bookingQuery = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (bookingQuery.rows.length === 0) {
        throw new Error("Booking not found");
    }
    const booking = bookingQuery.rows[0];
    if (requestingUser.role === 'customer') {
        if (booking.customer_id !== requestingUser.id) {
            throw new Error("You are not authorized to update this booking");
        }
        if (status !== 'cancelled') {
            throw new Error("Customers can only cancel bookings");
        }
        if (booking.status !== 'active') {
        }
    }
    if (requestingUser.role === 'admin') {
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updateResult = await client.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [status, bookingId]);
        if (status === 'returned' || status === 'cancelled') {
            await client.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [booking.vehicle_id]);
        }
        await client.query('COMMIT');
        const updatedBooking = updateResult.rows[0];
        const vehicleRes = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1`, [booking.vehicle_id]);
        const responseData = {
            id: updatedBooking.id,
            customer_id: updatedBooking.customer_id,
            vehicle_id: updatedBooking.vehicle_id,
            rent_start_date: new Date(updatedBooking.rent_start_date).toISOString().split('T')[0],
            rent_end_date: new Date(updatedBooking.rent_end_date).toISOString().split('T')[0],
            total_price: updatedBooking.total_price,
            status: updatedBooking.status
        };
        if (status === 'returned') {
            responseData.vehicle = {
                availability_status: vehicleRes.rows[0].availability_status
            };
        }
        return responseData;
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
};
export const bookingService = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    updateBookingIntoDB
};
