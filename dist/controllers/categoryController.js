"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticles = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const db_1 = __importDefault(require("../db"));
const getAllCategories = async (req, res) => {
    try {
        const categories = await db_1.default.category.findMany({
            include: {
                articles: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении категорий'
        });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await db_1.default.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                articles: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                    }
                }
            }
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Категория не найдена'
            });
        }
        res.json({
            success: true,
            data: category
        });
    }
    catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении категории'
        });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await db_1.default.category.create({
            data: { name }
        });
        res.status(201).json({
            success: true,
            message: 'Категория создана',
            data: category
        });
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании категории'
        });
    }
};
exports.createCategory = createCategory;
const getArticles = async (req, res) => {
    try {
        const search = req.query.search?.toString().trim() || '';
        if (!search) {
            return res.json({ success: true, data: [] });
        }
        const articles = await db_1.default.article.findMany({
            where: {
                title: { contains: search, mode: 'insensitive' },
            },
            orderBy: { id: 'asc' },
        });
        res.json({ success: true, data: articles });
    }
    catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({ success: false, message: 'Error during getting articles' });
    }
};
exports.getArticles = getArticles;
