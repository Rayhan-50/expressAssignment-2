import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secret } from "../modules/auth/auth.service";
import { pool } from "../database/db";


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenHeader = req.headers.authorization;
      if (!tokenHeader) {
        throw new Error("You are not authorized");
      }

      const token = tokenHeader.split(' ')[1]; 
      if (!token) {
        throw new Error("You are not authorized");
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      
      const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [decoded.email]);
      if (user.rows.length === 0) {
        throw new Error("User not found!");
      }

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("You are not authorized");
      }

      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
        errors: error.message
      });
    }
  };
};

export default auth;