import { db } from '../config/db.js';

export const getCart = async (req, res) => {
    const userId = req.user.userId;

    try {
        // Query to get cart items
        const [cartItems] = await db.query(
            `SELECT c.cartId, b.title, b.price,b.bookId ,ci.quantity, 
            (b.price * ci.quantity) AS itemTotal
            FROM Cart c
            JOIN Cart_Items ci ON c.cartId = ci.cartId
            JOIN Books b ON ci.bookId = b.bookId
            WHERE c.userId = ?`,
            [userId]
        );

        // Query to get cart total
        const [[{ cartTotal }]] = await db.query(
            `SELECT SUM(b.price * ci.quantity) AS cartTotal
            FROM Cart_Items ci
            JOIN Books b ON ci.bookId = b.bookId
            JOIN Cart c ON ci.cartId = c.cartId
            WHERE c.userId = ?`,
            [userId]
        );

        // Respond with cart items and cart total
        res.json({
            items: cartItems,
            cartTotal: cartTotal
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addToCart = async (req, res) => {
    const { bookId, quantity } = req.body;
    const userId = req.user.userId;

    try {
        let [cart] = await db.query('SELECT cartId FROM Cart WHERE userId = ?', [userId]);

        if (cart.length === 0) {
            const [cartResult] = await db.query('INSERT INTO Cart (userId) VALUES (?)', [userId]);
            cart = [{ cartId: cartResult.insertId }];
        }

        const [existingItem] = await db.query(
            'SELECT * FROM Cart_Items WHERE cartId = ? AND bookId = ?',
            [cart[0].cartId, bookId]
        );

        if (existingItem.length > 0) {
            await db.query(
                'UPDATE Cart_Items SET quantity = quantity + ? WHERE cartId = ? AND bookId = ?',
                [quantity, cart[0].cartId, bookId]
            );
        } else {
            await db.query(
                'INSERT INTO Cart_Items (cartId, bookId, quantity) VALUES (?, ?, ?)',
                [cart[0].cartId, bookId, quantity]
            );
        }

        res.json({ message: 'Book added to cart' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const removeFromCart = async (req, res) => {
    const { itemId } = req.params; // Assuming itemId is referring to bookId
    const userId = req.user.userId; // Extracted from JWT token

    try {
        // Check if the item exists in the cart
        const [cartItem] = await db.query(
            'SELECT * FROM Cart_Items WHERE bookId = ? AND cartId = (SELECT cartId FROM Cart WHERE userId = ?)',
            [itemId, userId]
        );

        if (cartItem.length === 0) {
            return res.status(404).json({ error: 'Item not in cart' });
        }

        // If the item exists, delete it from the cart
        await db.query(
            'DELETE FROM Cart_Items WHERE bookId = ? AND cartId = (SELECT cartId FROM Cart WHERE userId = ?)',
            [itemId, userId]
        );

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
