"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Пользователь с таким email уже существует' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await db_1.default.user.create({
            data: { email, password: hashedPassword },
            select: { id: true, email: true, createdAt: true, updatedAt: true }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.status(201).json({
            success: true,
            message: 'Пользователь успешно создан',
            data: { user, token },
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.default.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true, createdAt: true, updatedAt: true },
        });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.json({ success: true, message: 'Вход выполнен успешно', data: { user: { id: user.id, email: user.email }, token } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
    }
};
exports.login = login;
const getCurrentUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Пользователь не авторизован' });
    }
    try {
        const user = await db_1.default.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, email: true, createdAt: true, updatedAt: true }
        });
        res.json({ success: true, data: user });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};
exports.getCurrentUser = getCurrentUser;
