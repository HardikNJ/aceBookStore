import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/Cart-Controller.js';
import { authenticateToken } from '../middlewares/Auth-Middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/', authenticateToken, addToCart);
router.delete('/:itemId', authenticateToken, removeFromCart);

export default router;
