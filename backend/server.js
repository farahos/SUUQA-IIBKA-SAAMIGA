import express from 'express';
import { connect } from 'mongoose';
import conectBD from './config/db.js';
import { registerUser } from './controller/UserController.js';
import userRouter from './routes/UserRoute.js';

import cookieParser from 'cookie-parser';
import sellerRoutes from './routes/sellerRoutes.js';
import buyerRoutes from "./routes/buyerRoute.js";
import TokenRoute from './routes/TokenRoute.js';


const app = express();
const PORT = 8000

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use("/api/sellers", sellerRoutes);
app.use("/api/buyers", buyerRoutes);

// forget password
app.use('/api/forgetpassword', TokenRoute);


conectBD();
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);

})
