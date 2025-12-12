import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signup = async (req: Request, res: Response) => {
    try {
        const result = await authServices.registerUserIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message,
        });
    }
};

const signin = async (req: Request, res: Response) => {
    try {
        const result = await authServices.loginUserIntoDB(req.body.email, req.body.password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error: any) {
        if (error.message === 'User not found' || error.message === 'Invalid Credentials') {
            res.status(401).json({
                success: false,
                message: "Authentication failed",
                errors: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                errors: error.message,
            });
        }
    }
};

export const authController = {
    signup,
    signin,
};