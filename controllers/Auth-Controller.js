import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

// Register a new user
export const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check for user already exist case
        const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already registered' });
        }

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await db.query('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', [
            username, email, hashedPassword, role
        ]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log("DB Error", error);
    }
};

// Login an existing user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = rows[0];

        // Compare the provided password with the hashed password stored in the database
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log("DB Error", error);

    }
};
