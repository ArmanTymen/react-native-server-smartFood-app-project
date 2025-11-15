import { Request, Response } from 'express'
import prisma from '../../db'

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
    
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
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

    const article = await prisma.article.create({
      data: {
        title,
        content,
        categoryId: parseInt(categoryId)
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