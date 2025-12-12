import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.createVehicleIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
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

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehiclesFromDB();

        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Vehicle ID is required",
                errors: "Vehicle ID is required"
            });
        }
        const result = await vehicleService.getVehicleByIdFromDB(vehicleId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "Vehicle with the given ID does not exist"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message,
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Vehicle ID is required",
                errors: "Vehicle ID is required"
            });
        }
        const result = await vehicleService.updateVehicleIntoDB(vehicleId, req.body);

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === "Vehicle not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
                errors: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message,
        });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Vehicle ID is required",
                errors: "Vehicle ID is required"
            });
        }
        await vehicleService.deleteVehicleFromDB(vehicleId);

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    } catch (error: any) {
        if (error.message === "Vehicle not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
                errors: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message,
        });
    }
}

export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
