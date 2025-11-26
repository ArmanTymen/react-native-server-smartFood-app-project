"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFavorite = exports.deleteFavorite = exports.getAllFavorites = void 0;
const db_1 = __importDefault(require("../db"));
const getAllFavorites = async (req, res) => {
    try {
        const userId = Number(req.query.userId);
        if (!userId) {
            return res.status(400).json({ success: false, message: 'userId required' });
        }
        const favorites = await db_1.default.favorites.findMany({
            where: { userId },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        content: true
                    },
                },
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: favorites });
    }
    catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении избранного'
        });
    }
};
exports.getAllFavorites = getAllFavorites;
const deleteFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const favorite = await db_1.default.favorites.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true, message: 'Deleted from favorites', data: favorite });
    }
    catch (error) {
        console.error('Delete favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удаленний из избранного'
        });
    }
};
exports.deleteFavorite = deleteFavorite;
const addFavorite = async (req, res) => {
    try {
        const { userId, articleId } = req.body;
        if (!userId || !articleId) {
            return res.status(400).json({ success: false, message: 'userId and articleId are required' });
        }
        const existing = await db_1.default.favorites.findFirst({ where: { userId, articleId } });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Already in favorites' });
        }
        const favorite = await db_1.default.favorites.create({
            data: { userId, articleId },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        content: true
                    }
                }
            }
        });
        res.status(201).json({ success: true, message: 'Added to favorites', data: favorite });
    }
    catch (error) {
        console.error('Adding favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при добавлений в избранное'
        });
    }
};
exports.addFavorite = addFavorite;
