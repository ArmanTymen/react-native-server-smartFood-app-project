"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.updatePersonalRation = exports.getUserPersonalRation = void 0;
const db_1 = __importDefault(require("../db"));
const getUserPersonalRation = async (req, res) => {
    try {
        const userId = Number(req.query.userId);
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId required" });
        }
        const ration = await db_1.default.personalRation.findUnique({
            where: { userId },
        });
        res.json({ success: true, data: ration || null });
    }
    catch (error) {
        console.error("Get personal ration error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getUserPersonalRation = getUserPersonalRation;
const updatePersonalRation = async (req, res) => {
    try {
        const { userId, weight, height, age, gender, activityLevel, goal, dietType, allergies } = req.body;
        if (!userId)
            return res.status(400).json({ success: false, message: "userId required" });
        const ration = await db_1.default.personalRation.upsert({
            where: { userId },
            update: { weight, height, age, gender, activityLevel, goal, dietType, allergies },
            create: { userId, weight, height, age, gender, activityLevel, goal, dietType, allergies },
        });
        res.json({ success: true, message: "Ration updated", data: ration });
    }
    catch (error) {
        console.error("Update personal ration error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updatePersonalRation = updatePersonalRation;
const getRecommendations = async (req, res) => {
    try {
        const userId = Number(req.query.userId);
        if (!userId)
            return res.status(400).json({ success: false, message: 'userId required' });
        const recommendations = [
            { id: 1, meal: 'Oatmeal with fruits', calories: '350' },
            { id: 2, meal: 'Grilled chicken salad', calories: '400' },
            { id: 3, meal: 'Protein smoothie', calories: '300' },
        ];
        res.json(recommendations);
    }
    catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getRecommendations = getRecommendations;
