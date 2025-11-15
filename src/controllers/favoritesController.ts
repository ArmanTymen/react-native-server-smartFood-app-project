import { Request, Response } from 'express'
import prisma from '../../db'

export const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId)
    if(!userId) {
      return res.status(400).json({ success: false, message: 'userId required' })
    }
    const favorites = await prisma.favorites.findMany({
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
      orderBy: { createdAt: 'desc'}
    })
    res.json({ success: true, data: favorites })
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении избранного'
    })
  }
}

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const favorite = await prisma.favorites.delete({
      where: { id: Number(id) }
    })
    res.json({ success: true, message: 'Deleted from favorites', data: favorite })
  } catch (error) {
    console.error('Delete favorites error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при удаленний из избранного'
    })
  }
}

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, articleId } = req.body
    if(!userId || !articleId) {
      return res.status(400).json({ success: false, message: 'userId and articleId are required'})
    } 
    const existing = await prisma.favorites.findFirst({ where: { userId, articleId }})
    if(existing) {
      return res.status(409).json({ success: false, message: 'Already in favorites' })
    }

    const favorite = await prisma.favorites.create({
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
    })
    res.status(201).json({ success: true, message: 'Added to favorites', data: favorite })
  } catch (error) {
    console.error('Adding favorite error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлений в избранное'
    })
  }
}