"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Токен отсутствует'
        });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: 'Неверный формат токена'
        });
    }
    const token = parts[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            algorithms: ['HS256']
        });
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Токен просрочен'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Невалидный токен'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Ошибка аутентификации'
        });
    }
};
exports.default = authenticate;
