"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.updatePersonalRation = exports.getUserPersonalRation = void 0;
const db_1 = __importDefault(require("../db"));
const getUserPersonalRation = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Пользователь не авторизован" });
        }
        const ration = await db_1.default.personalRation.findUnique({
            where: { userId: req.user.userId },
        });
        res.json({ success: true, data: ration || null });
    }
    catch (error) {
        console.error("Get personal ration error:", error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
};
exports.getUserPersonalRation = getUserPersonalRation;
const updatePersonalRation = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Пользователь не авторизован" });
        }
        const { weight, height, age, gender, activityLevel, goal, dietType, allergies } = req.body;
        const ration = await db_1.default.personalRation.upsert({
            where: { userId: req.user.userId },
            update: { weight, height, age, gender, activityLevel, goal, dietType, allergies },
            create: {
                userId: req.user.userId,
                weight, height, age, gender, activityLevel, goal, dietType, allergies
            },
        });
        res.json({ success: true, message: "Рацион обновлен", data: ration });
    }
    catch (error) {
        console.error("Update personal ration error:", error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
};
exports.updatePersonalRation = updatePersonalRation;
const getRecommendations = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Пользователь не авторизован' });
        }
        const userRation = await db_1.default.personalRation.findUnique({
            where: { userId: req.user.userId }
        });
        const recommendations = [
            { id: 1, meal: 'Овсянка с фруктами', calories: '350' },
            { id: 2, meal: 'Салат с курицей', calories: '400' },
            { id: 3, meal: 'Протеиновый коктейль', calories: '300' },
        ];
        res.json({ success: true, data: recommendations });
    }
    catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};
exports.getRecommendations = getRecommendations;
