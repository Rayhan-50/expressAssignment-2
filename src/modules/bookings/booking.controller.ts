import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.createBookingIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong", 
            errors: error.message,
        });
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const role = req.user?.role;
        const userId = req.user?.id;
        const { status } = req.query;

        const result = await bookingService.getAllBookingsFromDB(role, userId, { status });

        if (result.length === 0) {
            res.status(200).json({
                success: true,
                message: "No bookings found",
                data: []
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: role === 'customer' ? "Your bookings retrieved successfully" : "Bookings retrieved successfully",
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

const updateBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
                errors: "Booking ID is required"
            });
        }

        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
                errors: "User not authenticated"
            });
        }

        const result = await bookingService.updateBookingIntoDB(bookingId, req.body, req.user);

        if (req.body.status === 'cancelled') {
            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result
            });
        } else if (req.body.status === 'returned') {
            res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: result
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Booking updated successfully",
                data: result
            });
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            errors: error.message
        });
    }
}

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
};
