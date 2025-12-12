import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsersFromDB();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
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

const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new Error("User ID is required");
        }

       
        if (!req.user) {
            throw new Error("User not authenticated");
        }

        const result = await userServices.updateUserIntoDB(userId, req.body, req.user);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new Error("User ID is required");
        }

        await userServices.deleteUserFromDB(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message,
        });
    }
};

export const userController = {
    getAllUsers,
    updateUser,
    deleteUser,
};