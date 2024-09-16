import { db } from '../config/db.js';

export const placeOrder = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [cartItems] = await db.query(
            'SELECT ci.bookId, ci.quantity, b.price FROM Cart_Items ci JOIN Books b ON ci.bookId = b.bookId WHERE ci.cartId = (SELECT cartId FROM Cart WHERE userId = ?)',
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

        const [order] = await db.query('INSERT INTO Orders (userId, totalAmount, createdAt) VALUES (?, ?, NOW())', [userId, totalAmount]);

        for (const item of cartItems) {
            await db.query('INSERT INTO Order_Items (orderId, bookId, quantity, price) VALUES (?, ?, ?, ?)', [order.insertId, item.bookId, item.quantity, item.price]);
        }

        await db.query('DELETE FROM Cart_Items WHERE cartId = (SELECT cartId FROM Cart WHERE userId = ?)', [userId]);

        res.json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getOrderHistory = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [orders] = await db.query('SELECT orderId,userId,totalAmount FROM Orders WHERE userId = ?', [userId]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getOrderDetails = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.userId;

    try {
        // Get order information
        const [order] = await db.query(
            'SELECT * FROM Orders WHERE orderId = ? AND userId = ?',
            [orderId, userId]
        );

        if (order.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Get ordered items (books) for the given order
        const [orderItems] = await db.query(
            `SELECT oi.bookId, b.title, oi.quantity, oi.price 
             FROM Order_Items oi
             JOIN Books b ON oi.bookId = b.bookId
             WHERE oi.orderId = ?`,
            [orderId]
        );

        const orderDetails = {
            orderId: order[0].orderId,
            totalAmount: order[0].totalAmount,
            orderDate: order[0].orderDate,
            items: orderItems
        };

        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

