import { Response } from "express";
import prisma from "../db";
import { AuthRequest } from '../middleware/auth'; // ← Используем авторизованный запрос

export const getUserPersonalRation = async (req: AuthRequest, res: Response) => {
  try {
    // Берем userId из авторизованного пользователя, а не из query!
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Пользователь не авторизован" });
    }

    const ration = await prisma.personalRation.findUnique({
      where: { userId: req.user.userId },
    });

    res.json({ success: true, data: ration || null });

  } catch (error) {
    console.error("Get personal ration error:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

export const updatePersonalRation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Пользователь не авторизован" });
    }

    const { weight, height, age, gender, activityLevel, goal, dietType, allergies } = req.body;

    // ⚡ Убираем userId из body - используем только из авторизации!
    const ration = await prisma.personalRation.upsert({
      where: { userId: req.user.userId }, // ← Только свой рацион!
      update: { weight, height, age, gender, activityLevel, goal, dietType, allergies },
      create: { 
        userId: req.user.userId, // ← Только свой рацион!
        weight, height, age, gender, activityLevel, goal, dietType, allergies 
      },
    });

    res.json({ success: true, message: "Рацион обновлен", data: ration });

  } catch (error) {
    console.error("Update personal ration error:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Пользователь не авторизован' });
    }

    // TODO: Реальная логика рекомендаций на основе рациона пользователя
    const userRation = await prisma.personalRation.findUnique({
      where: { userId: req.user.userId }
    });

    const recommendations = [
      { id: 1, meal: 'Овсянка с фруктами', calories: '350' },
      { id: 2, meal: 'Салат с курицей', calories: '400' },
      { id: 3, meal: 'Протеиновый коктейль', calories: '300' },
    ];

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};