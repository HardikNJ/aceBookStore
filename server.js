import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/Auth-Routes.js';
import bookRoutes from './routes/Book-Routes.js';
import cartRoutes from './routes/Cart-Routes.js';
import orderRoutes from './routes/Order-Routes.js';

dotenv.config();
const app = express();
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Connected to Ace Bookstore`);
});
