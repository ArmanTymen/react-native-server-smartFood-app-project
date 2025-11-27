"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticle = exports.getArticleById = exports.getAllArticles = void 0;
const db_1 = __importDefault(require("../db"));
const getAllArticles = async (req, res) => {
    try {
        const articles = await db_1.default.article.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        res.json({
            success: true,
            data: articles
        });
    }
    catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении статей'
        });
    }
};
exports.getAllArticles = getAllArticles;
const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await db_1.default.article.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Статья не найдена'
            });
        }
        res.json({
            success: true,
            data: article
        });
    }
    catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении статьи'
        });
    }
};
exports.getArticleById = getArticleById;
const createArticle = async (req, res) => {
    try {
        const { title, content, categoryId } = req.body;
        const article = await db_1.default.article.create({
            data: {
                title,
                content,
                categoryId: parseInt(categoryId)
            }
        });
        res.status(201).json({
            success: true,
            message: 'Статья создана',
            data: article
        });
    }
    catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании статьи'
        });
    }
};
exports.createArticle = createArticle;
