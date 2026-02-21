import { authService } from '../services/authService.js';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req, res) => {
    try {
        const registrationData = registerSchema.parse(req.body);
        const user = await authService.register(registrationData);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message || 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message || 'Login failed' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};
