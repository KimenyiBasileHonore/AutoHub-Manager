import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoute from './src/routes/userRoute.js';
import dbConnect from './src/database/dbConnect.js';
import feedbackRoute from './src/routes/feedbackRoute.js';
import announcementRoute from './src/routes/announcementRouter.js';
import messageRouter from './src/routes/messageRouter.js';
import productRouter from './src/routes/productRouter.js';
import cartRoutes from './src/routes/cartRoute.js';
import paymentRouter from './src/routes/paymentRouter.js';
import {createAdminUser}from './src/controllers/userController.js';

// Initialize dotenv configuration
dotenv.config();

const app = express();

// Connect to database
dbConnect();
createAdminUser ();

// Middleware setup
app.use(express.json());
app.use(cors({ origin: '*' }));

// Routes
app.use('/api/user', userRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/announc', announcementRoute);
app.use('/api/messages', messageRouter);
app.use('/api/prod', productRouter);
app.use('/api/cart', cartRoutes);
app.use(express.static('uploads'));
app.use('/api/payment', paymentRouter);

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
