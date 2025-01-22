import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

const PORT = process.env.PORT || 3000;

//importing routes

import userRoutes from './Routes/user.js';
import productRoutes from './Routes/product.js';
import cartRoutes from './Routes/cart.js';
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

