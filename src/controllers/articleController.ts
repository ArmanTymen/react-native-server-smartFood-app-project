import { Request, Response } from 'express'
import prisma from '../db'

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: articles
    })
  } catch (error) {
    console.error('Get articles error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статей'
    })
  }
}

// Получить статью по ID
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // ПРЕОБРАЗУЕМ ID И ПРОВЕРЯЕМ
    const articleId = parseInt(id)
    if (isNaN(articleId)) {
      return res.status(400).json({
        success: false,
        message: 'ID должен быть числом'
      })
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Статья не найдена'
      })
    }

    res.json({
      success: true,
      data: article
    })
  } catch (error) {
    console.error('Get article error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статьи'
    })
  }
}

// Создать новую статью
export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, categoryId } = req.body

    // ВАЛИДАЦИЯ ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ
    if (!title?.trim() || !content?.trim() || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны: title, content, categoryId'
      })
    }

    // ПРЕОБРАЗУЕМ И ПРОВЕРЯЕМ categoryId
    const categoryIdNum = parseInt(categoryId)
    if (isNaN(categoryIdNum)) {
      return res.status(400).json({
        success: false,
        message: 'categoryId должен быть числом'
      })
    }

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        categoryId: categoryIdNum
      }
    })

    res.status(201).json({
      success: true,
      message: 'Статья создана',
      data: article
    })
  } catch (error) {
    console.error('Create article error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании статьи'
    })
  }
}