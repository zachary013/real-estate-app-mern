import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        console.log(newUser);
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create user' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //? Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //? Check if user exists
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to login' });
    }

}

export const logout = (req, res) => {
    console.log('logout');
}