import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post('/', auth('customer', 'admin'), bookingController.createBooking);
router.get('/', auth('admin', 'customer'), bookingController.getAllBookings);
router.put('/:bookingId', auth('admin', 'customer'), bookingController.updateBooking);

export const bookingRoute = router;
