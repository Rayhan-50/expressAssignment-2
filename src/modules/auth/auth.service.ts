import bcrypt from "bcryptjs";
import { pool } from "../../database/db";
import jwt from "jsonwebtoken";

export const secret = process.env.JWT_SECRET as string;

const registerUserIntoDB = async (payload: any) => {
    const { name, email, password, phone, role } = payload;
    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role;
  `;
    const values = [name, email, hashedPassword, phone, role];

    const result = await pool.query(query, values);
    return result.rows[0];
};

const loginUserIntoDB = async (email: string, password: string) => {
    const userQuery = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = userQuery.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
        throw new Error('Invalid Credentials');
    }

   
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: "1y" }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};

export const authServices = {
    registerUserIntoDB,
    loginUserIntoDB,
};