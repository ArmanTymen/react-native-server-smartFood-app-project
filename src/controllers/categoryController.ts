import { Request, Response } from 'express'
import prisma from '../db'

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        articles: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении категорий'
    })
  }
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // ПРОВЕРЯЕМ ЧТО ID ЕСТЬ И НЕ ПУСТОЙ
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID категории обязателен'
      })
    }

    // ПРЕОБРАЗУЕМ В ЧИСЛО
    const categoryId = parseInt(id)
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'ID должен быть числом'
      })
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        articles: {
          select: {
            id: true,
            title: true,
            content: true
          }
        }
      }
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Категория не найдена'
      })
    }

    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Get category error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении категории'
    })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Название категории обязательно'
      })
    }
    const category = await prisma.category.create({
      data: { name }
    })

    res.status(201).json({
      success: true,
      message: 'Категория создана',
      data: category
    })
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании категории'
    })
  }
}

export const getArticles = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString().trim() || '';

    if (!search) {
      return res.json({ success: true, data: [] });
    }

    const articles = await prisma.article.findMany({
      where: {
        title: { contains: search, mode: 'insensitive' },
      },
      orderBy: { id: 'asc' },
    });

    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ success: false, message: 'Error during getting articles' });
  }
};



