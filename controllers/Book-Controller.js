import { db } from '../config/db.js';

export const getAllBooks = async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM Books');
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const getBookDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const [book] = await db.query('SELECT * FROM Books WHERE bookId = ?', [id]);
        if (book.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};
