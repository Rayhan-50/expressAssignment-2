import express, { Request, Response } from 'express';
import { userRoute } from './modules/user/user.route';
import { initDB } from './database/db';
import { authRoute } from './modules/auth/auth.route';
import { vehicleRoute } from './modules/vehicles/vehicle.route';
import { bookingRoute } from './modules/bookings/booking.route';

const app = express();
const PORT = 5000;

app.use(express.json());

initDB();

app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/vehicles', vehicleRoute);
app.use('/api/v1/bookings', bookingRoute);


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello, World!',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});