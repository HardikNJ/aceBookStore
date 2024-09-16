import express from 'express';
import { placeOrder, getOrderHistory, getOrderDetails } from '../controllers/Order-Controller.js';
import { authenticateToken } from '../middlewares/Auth-Middleware.js';

const router = express.Router();

router.post('/', authenticateToken, placeOrder);
router.get('/', authenticateToken, getOrderHistory);
router.get('/:id', authenticateToken, getOrderDetails);

export default router;
